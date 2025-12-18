import axios from 'axios';
import { patientServiceClient } from './serviceClient';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('ServiceClient', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = (axios.create as jest.Mock).mock.results[0].value;
    jest.clearAllMocks();
  });

  it('should call get on axios instance', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: 'ok' });
    const result = await patientServiceClient.get('/test', { 'x-test': 'val' });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', { headers: { 'x-test': 'val' } });
    expect(result.data).toBe('ok');
  });

  it('should call post on axios instance', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: 'ok' });
    await patientServiceClient.post('/test', { body: 'val' }, { 'x-test': 'val' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', { body: 'val' }, { headers: { 'x-test': 'val' } });
  });

  it('should call put on axios instance', async () => {
    mockAxiosInstance.put.mockResolvedValue({ data: 'ok' });
    await patientServiceClient.put('/test', { body: 'val' }, { 'x-test': 'val' });
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', { body: 'val' }, { headers: { 'x-test': 'val' } });
  });

  it('should call delete on axios instance', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: 'ok' });
    await patientServiceClient.delete('/test', { 'x-test': 'val' });
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test', { headers: { 'x-test': 'val' } });
  });
});
