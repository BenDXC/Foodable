import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes Router
export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
}

// Mock for sessionStorage
export const mockSessionStorage = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock for window.alert
export const mockAlert = vi.fn();

// Mock axios responses
export const mockAxiosSuccess = (data = {}) => ({
  status: 200,
  data,
  headers: {
    authorization: 'Bearer mock-jwt-token',
  },
});

export const mockAxiosError = (status = 400, message = 'Error') => ({
  response: {
    status,
    data: { message },
  },
});
