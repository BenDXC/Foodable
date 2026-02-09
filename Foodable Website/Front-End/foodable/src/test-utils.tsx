import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

// Custom render function that includes Router
export function renderWithRouter(
  ui: ReactElement,
  { route = '/', ...renderOptions }: RenderWithRouterOptions = {}
) {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(ui, { wrapper: BrowserRouter, ...renderOptions }),
  };
}

// Mock for sessionStorage
export const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

// Mock for window.alert
export const mockAlert = vi.fn();

interface MockAxiosSuccessOptions {
  status?: number;
  data?: any;
  authorization?: string;
}

// Mock axios responses
export const mockAxiosSuccess = ({
  status = 200,
  data = {},
  authorization = 'Bearer mock-jwt-token',
}: MockAxiosSuccessOptions = {}) => ({
  status,
  data,
  headers: {
    authorization,
  },
});

export const mockAxiosError = (status = 400, message = 'Error') => ({
  response: {
    status,
    data: { message },
  },
});
