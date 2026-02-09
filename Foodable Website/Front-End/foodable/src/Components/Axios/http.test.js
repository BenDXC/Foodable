import { describe, it, expect } from 'vitest';
import http from './http';

describe('HTTP Axios Instance', () => {
  it('creates axios instance with correct baseURL', () => {
    expect(http.defaults.baseURL).toBe('http://localhost:8080/api');
  });

  it('sets correct Content-Type header', () => {
    expect(http.defaults.headers['Content-type']).toBe('application/json');
  });

  it('is an axios instance with get method', () => {
    expect(typeof http.get).toBe('function');
  });

  it('is an axios instance with post method', () => {
    expect(typeof http.post).toBe('function');
  });

  it('is an axios instance with put method', () => {
    expect(typeof http.put).toBe('function');
  });

  it('is an axios instance with delete method', () => {
    expect(typeof http.delete).toBe('function');
  });

  it('is an axios instance with request method', () => {
    expect(typeof http.request).toBe('function');
  });
});
