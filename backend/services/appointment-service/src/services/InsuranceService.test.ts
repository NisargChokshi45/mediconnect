import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }),
}));

describe('InsuranceService', () => {
  let insuranceService: any;
  let InsuranceServiceClass: any;
  let mockBreaker: any;

  beforeAll(() => {
    mockBreaker = {
      opened: false,
      halfOpen: false,
      fire: jest.fn(),
      on: jest.fn((event, cb) => cb()),
      stats: { failures: 0 },
    };

    jest.doMock('opossum', () => {
      return jest.fn().mockImplementation((fn) => {
        mockBreaker.fire.mockImplementation((...args: any[]) => fn(...args));
        return mockBreaker;
      });
    });

    // Require the class AFTER mocking
    const module = require('./InsuranceService');
    InsuranceServiceClass = module.InsuranceService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockBreaker.opened = false;
    mockBreaker.halfOpen = false;
    insuranceService = new InsuranceServiceClass();
  });

  afterAll(() => {
    jest.dontMock('opossum');
  });

  describe('verifyEligibility', () => {
    it('should return verified result on success', async () => {
      const mockResult = { verified: true, eligibilityStatus: 'ACTIVE' };
      mockedAxios.post.mockResolvedValue({ data: mockResult });
      const result = await insuranceService.verifyEligibility('p1', 'POL123');
      expect(result).toEqual(mockResult);
    });

    it('should return failure result on error', async () => {
      mockedAxios.post.mockRejectedValue(new Error('fail'));
      const result = await insuranceService.verifyEligibility('p1', 'POL123');
      expect(result.verified).toBe(false);
    });
  });

  describe('getCircuitBreakerStats', () => {
    it('should return OPEN state', () => {
      mockBreaker.opened = true;
      expect(insuranceService.getCircuitBreakerStats().state).toBe('OPEN');
    });

    it('should return HALF_OPEN state', () => {
      mockBreaker.opened = false;
      mockBreaker.halfOpen = true;
      expect(insuranceService.getCircuitBreakerStats().state).toBe('HALF_OPEN');
    });

    it('should return CLOSED state', () => {
      mockBreaker.opened = false;
      mockBreaker.halfOpen = false;
      expect(insuranceService.getCircuitBreakerStats().state).toBe('CLOSED');
    });
  });
});
