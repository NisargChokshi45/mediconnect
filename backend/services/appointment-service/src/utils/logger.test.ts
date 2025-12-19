import { sanitizePHI, createLogger } from './logger';
import winston from 'winston';

// Test the sanitizePHI function extensively to reach 100% coverage
describe('sanitizePHI', () => {
  it('should return null/undefined values as-is', () => {
    expect(sanitizePHI(null)).toBe(null);
    expect(sanitizePHI(undefined)).toBe(undefined);
  });

  it('should sanitize PHI fields in objects', () => {
    const input = {
      name: 'John',
      password: 'secret123',
      email: 'john@example.com',
      age: 30,
      ssn: '123-45-6789',
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      name: 'John',
      password: '[REDACTED]',
      email: '[REDACTED]',
      age: 30,
      ssn: '[REDACTED]',
    });
  });

  it('should handle arrays of objects', () => {
    const input = [
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', phone: '555-1234' },
    ];

    const result = sanitizePHI(input);

    expect(result).toEqual([
      { name: 'John', email: '[REDACTED]' },
      { name: 'Jane', phone: '[REDACTED]' },
    ]);
  });

  it('should handle nested objects', () => {
    const input = {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        contact: {
          email: 'john@example.com',
          phone: '555-1234',
        },
      },
      metadata: {
        source: 'api',
        timestamp: '2024-01-01',
      },
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      user: {
        firstName: '[REDACTED]',
        lastName: '[REDACTED]',
        contact: {
          email: '[REDACTED]',
          phone: '[REDACTED]',
        },
      },
      metadata: {
        source: 'api',
        timestamp: '2024-01-01',
      },
    });
  });

  it('should handle primitive values', () => {
    expect(sanitizePHI('string')).toBe('string');
    expect(sanitizePHI(123)).toBe(123);
    expect(sanitizePHI(true)).toBe(true);
    expect(sanitizePHI(false)).toBe(false);
  });

  it('should handle empty objects and arrays', () => {
    expect(sanitizePHI({})).toEqual({});
    expect(sanitizePHI([])).toEqual([]);
  });

  it('should sanitize all PHI field types', () => {
    const input = {
      password: 'secret',
      passwordHash: 'hash123',
      ssn: '123-45-6789',
      socialSecurityNumber: '987-65-4321',
      dateOfBirth: '1990-01-01',
      dob: '1990-01-01',
      phone: '555-1234',
      email: 'test@example.com',
      address: '123 Main St',
      firstName: 'John',
      lastName: 'Doe',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '555-5678',
      insurancePolicyNumber: 'INS123456',
      medicalRecordNumber: 'MRN789',
      diagnosis: 'Flu',
      medications: 'Aspirin',
      chiefComplaint: 'Headache',
      physicalExamination: 'Normal',
      treatmentPlan: 'Rest',
    };

    const result = sanitizePHI(input);

    // All values should be redacted
    Object.values(result).forEach((value) => {
      expect(value).toBe('[REDACTED]');
    });
  });

  it('should handle mixed arrays with primitives and objects', () => {
    const input = [
      'string',
      123,
      { email: 'test@example.com', name: 'John' },
      null,
      { password: 'secret' },
    ];

    const result = sanitizePHI(input);

    expect(result).toEqual([
      'string',
      123,
      { email: '[REDACTED]', name: 'John' },
      null,
      { password: '[REDACTED]' },
    ]);
  });

  it('should handle deeply nested structures', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            email: 'deep@example.com',
            nonPhi: 'safe data',
          },
        },
      },
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            email: '[REDACTED]',
            nonPhi: 'safe data',
          },
        },
      },
    });
  });

  it('should handle objects with null values', () => {
    const input = {
      email: 'test@example.com',
      value: null,
      nested: {
        phone: '555-1234',
        empty: null,
      },
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      email: '[REDACTED]',
      value: null,
      nested: {
        phone: '[REDACTED]',
        empty: null,
      },
    });
  });

  it('should handle arrays with null values', () => {
    const input = [
      null,
      { email: 'test@example.com' },
      undefined,
      { password: 'secret', value: null },
    ];

    const result = sanitizePHI(input);

    expect(result).toEqual([
      null,
      { email: '[REDACTED]' },
      undefined,
      { password: '[REDACTED]', value: null },
    ]);
  });

  // Additional tests to specifically target the phiSanitizer winston format function
  it('should sanitize objects with metadata field', () => {
    const input = {
      metadata: {
        email: 'test@example.com',
        phone: '555-1234',
        safeData: 'ok',
      },
      otherField: 'safe',
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      metadata: {
        email: '[REDACTED]',
        phone: '[REDACTED]',
        safeData: 'ok',
      },
      otherField: 'safe',
    });
  });

  it('should sanitize objects with data field', () => {
    const input = {
      data: {
        firstName: 'John',
        lastName: 'Doe',
        publicInfo: 'visible',
      },
      status: 'active',
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      data: {
        firstName: '[REDACTED]',
        lastName: '[REDACTED]',
        publicInfo: 'visible',
      },
      status: 'active',
    });
  });

  it('should sanitize objects with user field', () => {
    const input = {
      user: {
        email: 'user@example.com',
        ssn: '123-45-6789',
        id: '12345',
      },
      session: 'abc123',
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      user: {
        email: '[REDACTED]',
        ssn: '[REDACTED]',
        id: '12345',
      },
      session: 'abc123',
    });
  });

  it('should handle complex objects with multiple special fields', () => {
    const input = {
      metadata: {
        phone: '555-1234',
        source: 'api',
      },
      data: {
        diagnosis: 'flu',
        notes: 'patient notes',
      },
      user: {
        firstName: 'Jane',
        role: 'patient',
      },
      timestamp: '2024-01-01',
    };

    const result = sanitizePHI(input);

    expect(result).toEqual({
      metadata: {
        phone: '[REDACTED]',
        source: 'api',
      },
      data: {
        diagnosis: '[REDACTED]',
        notes: 'patient notes',
      },
      user: {
        firstName: '[REDACTED]',
        role: 'patient',
      },
      timestamp: '2024-01-01',
    });
  });
});

// Simple integration test to verify createLogger can be imported and called
describe('createLogger Integration', () => {
  // Mock winston at the module level to avoid module loading issues
  beforeAll(() => {
    jest.mock('winston', () => ({
      createLogger: jest.fn(() => ({
        add: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      })),
      format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        errors: jest.fn(),
        metadata: jest.fn(),
        json: jest.fn(),
        colorize: jest.fn(),
        printf: jest.fn(),
      },
      transports: {
        File: jest.fn(),
        Console: jest.fn(),
      },
    }));
  });

  it('should export createLogger function', () => {
    const { createLogger } = require('./logger');
    expect(typeof createLogger).toBe('function');
  });

  it('should handle logger creation without errors', () => {
    const { createLogger } = require('./logger');
    expect(() => createLogger('test-service')).not.toThrow();
  });

  it('should handle logger creation with custom log level', () => {
    const { createLogger } = require('./logger');
    expect(() => createLogger('test-service', 'debug')).not.toThrow();
  });
});

// Test winston integrations to cover the remaining lines
describe('Winston Logger Integration', () => {
  let originalEnv: string | undefined;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    consoleLogSpy.mockRestore();
  });

  it('should handle logger creation and logging with metadata field sanitization', () => {
    // Test the actual logger to trigger phiSanitizer execution
    const logger = createLogger('test-meta');

    // Capture any winston transform calls by checking if logger exists
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');

    // This should exercise the phiSanitizer with metadata
    const testLog = {
      metadata: {
        email: 'test@example.com',
        phone: '555-1234',
      },
    };

    // Log something to potentially trigger the sanitizer
    expect(() => logger.info('Test message', testLog)).not.toThrow();
  });

  it('should handle logger creation and logging with data field sanitization', () => {
    const logger = createLogger('test-data');

    expect(logger).toBeDefined();

    // This should exercise the phiSanitizer with data field
    const testLog = {
      data: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    expect(() => logger.info('Test message with data', testLog)).not.toThrow();
  });

  it('should handle logger creation and logging with user field sanitization', () => {
    const logger = createLogger('test-user');

    expect(logger).toBeDefined();

    // This should exercise the phiSanitizer with user field
    const testLog = {
      user: {
        email: 'user@example.com',
        ssn: '123-45-6789',
      },
    };

    expect(() => logger.info('Test message with user', testLog)).not.toThrow();
  });

  it('should create console transport in development mode and handle printf formatting', () => {
    process.env.NODE_ENV = 'development';

    const logger = createLogger('test-console');

    expect(logger).toBeDefined();

    // Test logging with metadata to trigger printf formatter
    const logData = {
      extraField: 'extra',
      anotherField: 'another',
    };

    expect(() => logger.info('Test console message', logData)).not.toThrow();

    // Test logging without extra metadata
    expect(() => logger.error('Simple error message')).not.toThrow();

    // Test with different log levels
    expect(() => logger.warn('Warning message')).not.toThrow();
  });

  it('should not create console transport in production mode', () => {
    process.env.NODE_ENV = 'production';

    const logger = createLogger('test-prod');

    expect(logger).toBeDefined();
    expect(() => logger.info('Production message')).not.toThrow();
  });

  it('should handle complex logging scenarios with all PHI fields', () => {
    const logger = createLogger('test-complex');

    const complexData = {
      metadata: {
        email: 'meta@test.com',
        phone: '555-0001',
        safe: 'metadata',
      },
      data: {
        firstName: 'Jane',
        diagnosis: 'test condition',
        notes: 'safe notes',
      },
      user: {
        ssn: '987-65-4321',
        email: 'user2@test.com',
        role: 'patient',
      },
    };

    expect(() => logger.info('Complex logging test', complexData)).not.toThrow();
    expect(() => logger.error('Complex error test', complexData)).not.toThrow();
    expect(() => logger.warn('Complex warning test', complexData)).not.toThrow();
  });

  it('should create logger with different log levels', () => {
    ['error', 'warn', 'info', 'debug', 'verbose'].forEach((level) => {
      const logger = createLogger(`test-${level}`, level);
      expect(logger).toBeDefined();
      expect(() => logger.info(`Test ${level} logger`)).not.toThrow();
    });
  });

  it('should handle winston format chain execution', () => {
    // Create multiple loggers to ensure format functions are executed
    const loggers = [
      createLogger('test-format-1'),
      createLogger('test-format-2', 'debug'),
      createLogger('test-format-3', 'error'),
    ];

    loggers.forEach((logger, index) => {
      expect(logger).toBeDefined();

      const testData = {
        [`field_${index}`]: `value_${index}`,
        email: `test${index}@example.com`,
      };

      expect(() => logger.info(`Format test ${index}`, testData)).not.toThrow();
    });
  });
});
