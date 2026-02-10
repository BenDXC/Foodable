import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import http from '../Components/Axios/http';
import logger from '../utils/logger';
import { LoginData, UserData } from '../types';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private static handleError(error: AxiosError): never {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    logger.error(`API Error: ${statusCode} - ${message}`, error);
    throw new ApiError(statusCode, message, error.response?.data);
  }

  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      logger.api('GET', url);
      const response = await http.get<T>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async post<T>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      logger.api('POST', url, data);
      const response = await http.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async put<T>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      logger.api('PUT', url, data);
      const response = await http.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      logger.api('DELETE', url);
      const response = await http.delete<T>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}

// Auth Service
export class AuthService {
  static async login(credentials: LoginData): Promise<{ token: string }> {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      const response: AxiosResponse = await axios.post(
        `${apiBaseUrl}${API_ENDPOINTS.SIGNIN}`,
        credentials
      );

      if (response.status === 200) {
        const token = response.headers.authorization?.split(" ")[1];
        if (!token) {
          throw new ApiError(401, ERROR_MESSAGES.TOKEN_FAILURE);
        }
        return { token };
      }
      
      throw new ApiError(response.status, ERROR_MESSAGES.LOGIN_FAILURE);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      const err = error as AxiosError;
      logger.error('Login failed', err);
      throw new ApiError(
        err.response?.status || 500,
        ERROR_MESSAGES.LOGIN_FAILURE
      );
    }
  }

  static async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ message: string }> {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      const response = await axios.post(
        `${apiBaseUrl}${API_ENDPOINTS.SIGNUP}`,
        data
      );

      if (response.status === 201) {
        return { message: `Registration success: ${data.username}` };
      }
      
      throw new ApiError(response.status, ERROR_MESSAGES.REGISTRATION_FAILURE);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      const err = error as AxiosError;
      logger.error('Registration failed', err);
      throw new ApiError(
        err.response?.status || 500,
        ERROR_MESSAGES.REGISTRATION_FAILURE
      );
    }
  }

  static async getUserData(email: string): Promise<UserData> {
    try {
      const jwt = sessionStorage.getItem('jwt');
      if (!jwt) {
        throw new ApiError(401, 'No authentication token');
      }

      const response = await axios.get<UserData>(API_ENDPOINTS.USER, {
        params: { email },
        headers: { Authorization: `Bearer ${jwt}` },
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      logger.error('Failed to fetch user data', err);
      throw new ApiError(
        err.response?.status || 500,
        ERROR_MESSAGES.DATA_FAILURE
      );
    }
  }
}
