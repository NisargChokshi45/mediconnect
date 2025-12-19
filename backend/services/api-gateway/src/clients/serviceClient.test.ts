import axios from 'axios';
import { authServiceClient } from './serviceClient';

jest.mock('axios', () => {
    const mInstance = {
        get: jest.fn().mockResolvedValue({ data: 'ok' }),
        post: jest.fn().mockResolvedValue({ data: 'ok' }),
        put: jest.fn().mockResolvedValue({ data: 'ok' }),
        delete: jest.fn().mockResolvedValue({ data: 'ok' }),
    };
    return {
        create: jest.fn(() => mInstance),
        mInstance // export for easy access
    };
});

describe('ServiceClient', () => {
  const mockAxiosInstance = (axios as any).mInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call get on axios instance', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: 'ok' });
    const result = await authServiceClient.get('/test', { 'x-test': 'val' });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', { headers: { 'x-test': 'val' } });
    expect(result.data).toBe('ok');
  });

  it('should call post on axios instance', async () => {
    await authServiceClient.post('/test', { body: 'val' }, { 'x-test': 'val' });
    expect(mockAxiosInstance.post).toHaveBeenCalled();
  });

  it('should call put on axios instance', async () => {
    await authServiceClient.put('/test', { body: 'val' }, { 'x-test': 'val' });
    expect(mockAxiosInstance.put).toHaveBeenCalled();
  });

  it('should call delete on axios instance', async () => {
    await authServiceClient.delete('/test', { 'x-test': 'val' });
    expect(mockAxiosInstance.delete).toHaveBeenCalled();
  });

  it('should call methods without headers', async () => {
    await authServiceClient.get('/test');
    await authServiceClient.post('/test', {});
    await authServiceClient.put('/test', {});
    await authServiceClient.delete('/test');
    
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', { headers: {} });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', {}, { headers: {} });
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', {}, { headers: {} });
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test', { headers: {} });
  });
});
