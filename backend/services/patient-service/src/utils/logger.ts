import winston from 'winston';

// PHI (Protected Health Information) fields that must never be logged
const PHI_FIELDS = [
  'password',
  'passwordHash',
  'ssn',
  'socialSecurityNumber',
  'dateOfBirth',
  'dob',
  'phone',
  'email',
  'address',
  'firstName',
  'lastName',
  'emergencyContact',
  'emergencyPhone',
  'insurancePolicyNumber',
  'medicalRecordNumber',
  'diagnosis',
  'medications',
  'chiefComplaint',
  'physicalExamination',
  'treatmentPlan',
];

/**
 * Sanitize object to remove PHI fields
 */
export function sanitizePHI(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizePHI(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (PHI_FIELDS.includes(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizePHI(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Custom format to sanitize PHI from logs
 */
const phiSanitizer = winston.format((info) => {
  if (info.metadata) {
    info.metadata = sanitizePHI(info.metadata);
  }
  if (info.data) {
    info.data = sanitizePHI(info.data);
  }
  if (info.user) {
    info.user = sanitizePHI(info.user);
  }
  return info;
});

export function createLogger(serviceName: string, logLevel: string = 'info') {
  const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      phiSanitizer(),
      winston.format.metadata(),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.File({ filename: `logs/${serviceName}-error.log`, level: 'error' }),
      new winston.transports.File({ filename: `logs/${serviceName}-combined.log` }),
    ],
  });

  // Add console transport in development
  if (process.env.NODE_ENV === 'development') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
            const metaStr = JSON.stringify(meta, null, 2);
            return `${timestamp} [${service}] [${level}]: ${message} ${metaStr}`;
          })
        ),
      })
    );
  }

  return logger;
}
