import axios from 'axios';
import CircuitBreaker from 'opossum';
import { config } from '../config';
import { createLogger } from '../../../../shared/logger';

const logger = createLogger('insurance-service');

interface InsuranceVerificationResult {
  verified: boolean;
  eligibilityStatus: string;
  coverageDetails?: string;
}

async function verifyInsuranceEligibility(
  patientId: string,
  insurancePolicyNumber: string
): Promise<InsuranceVerificationResult> {
  try {
    const response = await axios.post(
      `${config.insurance.apiUrl}/verify`,
      { patientId, insurancePolicyNumber },
      {
        headers: {
          'X-API-Key': config.insurance.apiKey,
        },
        timeout: 5000,
      }
    );

    return response.data;
  } catch (error: any) {
    logger.error('Insurance API call failed', { error: error.message });
    throw error;
  }
}

// Circuit breaker configuration
const options = {
  timeout: 5000, // Timeout after 5 seconds
  errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
  resetTimeout: 30000, // Try again after 30 seconds
};

const breaker = new CircuitBreaker(verifyInsuranceEligibility, options);

breaker.on('open', () => {
  logger.warn('Insurance API circuit breaker OPENED');
});

breaker.on('halfOpen', () => {
  logger.info('Insurance API circuit breaker HALF-OPEN');
});

breaker.on('close', () => {
  logger.info('Insurance API circuit breaker CLOSED');
});

export class InsuranceService {
  async verifyEligibility(
    patientId: string,
    insurancePolicyNumber: string
  ): Promise<InsuranceVerificationResult> {
    try {
      return await breaker.fire(patientId, insurancePolicyNumber);
    } catch (error) {
      logger.warn('Insurance verification failed, continuing without verification');
      return {
        verified: false,
        eligibilityStatus: 'VERIFICATION_FAILED',
      };
    }
  }

  getCircuitBreakerStats() {
    return {
      state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED',
      stats: breaker.stats,
    };
  }
}
