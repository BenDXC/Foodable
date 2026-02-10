import { renderHook, act, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';
import { ApiService, ApiError } from '../../services/api.service';

jest.mock('../../services/api.service');

const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe('useApi Hook - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Operations', () => {
    it('should handle successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockApiService.get = jest.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useApi());

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle successful POST request', async () => {
      const mockResponse = { success: true, id: 1 };
      mockApiService.post = jest.fn().mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({
          method: 'POST',
          url: '/test',
          data: { name: 'Test' },
        });
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
        expect(mockApiService.post).toHaveBeenCalledWith('/test', { name: 'Test' }, expect.any(Object));
      });
    });

    it('should handle successful PUT request', async () => {
      const mockResponse = { success: true };
      mockApiService.put = jest.fn().mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({
          method: 'PUT',
          url: '/test/1',
          data: { name: 'Updated' },
        });
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });
    });

    it('should handle successful DELETE request', async () => {
      mockApiService.delete = jest.fn().mockResolvedValue({ success: true });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({
          method: 'DELETE',
          url: '/test/1',
        });
      });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors and set error state', async () => {
      const apiError = new ApiError(404, 'Not found');
      mockApiService.get = jest.fn().mockRejectedValue(apiError);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('Not found');
      });
    });

    it('should handle network errors', async () => {
      const networkError = new ApiError(0, 'Network Error');
      mockApiService.get = jest.fn().mockRejectedValue(networkError);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        const response = await result.current.execute({ method: 'GET', url: '/test' });
        expect(response).toBeNull();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network Error');
      });
    });

    it('should handle 500 server errors', async () => {
      const serverError = new ApiError(500, 'Internal Server Error');
      mockApiService.post = jest.fn().mockRejectedValue(serverError);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'POST', url: '/test', data: {} });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Internal Server Error');
      });
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new ApiError(408, 'Request Timeout');
      mockApiService.get = jest.fn().mockRejectedValue(timeoutError);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/slow' });
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('Loading States', () => {
    it('should set loading to true during request', async () => {
      mockApiService.get = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100))
      );

      const { result } = renderHook(() => useApi());

      act(() => {
        result.current.execute({ method: 'GET', url: '/test' });
      });

      expect(result.current.loading).toBe(true);
    });

    it('should reset loading to false after success', async () => {
      mockApiService.get = jest.fn().mockResolvedValue({ data: 'test' });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should reset loading to false after error', async () => {
      mockApiService.get = jest.fn().mockRejectedValue(new ApiError(500, 'Error'));

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all state to initial values', async () => {
      mockApiService.get = jest.fn().mockResolvedValue({ data: 'test' });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test' });
      });

      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing URL', async () => {
      mockApiService.get = jest.fn().mockResolvedValue({ data: 'test' });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET' });
      });

      expect(mockApiService.get).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('should handle undefined method (defaults to GET)', async () => {
      mockApiService.get = jest.fn().mockResolvedValue({ data: 'test' });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ url: '/test' });
      });

      expect(mockApiService.get).toHaveBeenCalled();
    });

    it('should handle null data in request', async () => {
      mockApiService.post = jest.fn().mockResolvedValue({ success: true });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({
          method: 'POST',
          url: '/test',
          data: null,
        });
      });

      expect(mockApiService.post).toHaveBeenCalledWith('/test', null, expect.any(Object));
    });

    it('should handle rapid consecutive calls', async () => {
      mockApiService.get = jest.fn()
        .mockResolvedValueOnce({ data: 1 })
        .mockResolvedValueOnce({ data: 2 })
        .mockResolvedValueOnce({ data: 3 });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test1' });
        await result.current.execute({ method: 'GET', url: '/test2' });
        await result.current.execute({ method: 'GET', url: '/test3' });
      });

      await waitFor(() => {
        expect(result.current.data).toEqual({ data: 3 });
      });
    });

    it('should handle errors without message', async () => {
      const error = new ApiError(500, '');
      mockApiService.get = jest.fn().mockRejectedValue(error);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({ method: 'GET', url: '/test' });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('');
      });
    });

    it('should handle case-insensitive HTTP methods', async () => {
      mockApiService.post = jest.fn().mockResolvedValue({ success: true });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.execute({
          method: 'post' as any,
          url: '/test',
          data: {},
        });
      });

      expect(mockApiService.post).toHaveBeenCalled();
    });

    it('should return null on error', async () => {
      mockApiService.get = jest.fn().mockRejectedValue(new ApiError(404, 'Not found'));

      const { result } = renderHook(() => useApi());

      let response: any;
      await act(async () => {
        response = await result.current.execute({ method: 'GET', url: '/test' });
      });

      expect(response).toBeNull();
    });
  });

  describe('Multiple Hook Instances', () => {
    it('should maintain separate state for different instances', async () => {
      mockApiService.get = jest.fn()
        .mockResolvedValueOnce({ data: 'first' })
        .mockResolvedValueOnce({ data: 'second' });

      const { result: result1 } = renderHook(() => useApi());
      const { result: result2 } = renderHook(() => useApi());

      await act(async () => {
        await result1.current.execute({ method: 'GET', url: '/test1' });
      });

      await act(async () => {
        await result2.current.execute({ method: 'GET', url: '/test2' });
      });

      await waitFor(() => {
        expect(result1.current.data).toEqual({ data: 'first' });
        expect(result2.current.data).toEqual({ data: 'second' });
      });
    });
  });
});
