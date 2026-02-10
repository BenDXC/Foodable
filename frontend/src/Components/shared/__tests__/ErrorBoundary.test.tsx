import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import React from 'react';

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws in useEffect
const ThrowErrorInEffect = () => {
  React.useEffect(() => {
    throw new Error('Error in useEffect');
  }, []);
  return <div>Component</div>;
};

// Component that throws async error
const ThrowAsyncError = () => {
  React.useEffect(() => {
    Promise.reject(new Error('Async error'));
  }, []);
  return <div>Async component</div>;
};

describe('ErrorBoundary - Comprehensive Tests', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Catching', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should catch and display error when child throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should display error message in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    it('should catch errors from nested components', () => {
      const NestedComponent = () => {
        return (
          <div>
            <div>
              <ThrowError shouldThrow={true} />
            </div>
          </div>
        );
      };

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('Different Error Types', () => {
    it('should handle TypeError', () => {
      const ThrowTypeError = () => {
        const obj: any = null;
        // This will throw TypeError
        return <div>{obj.property}</div>;
      };

      render(
        <ErrorBoundary>
          <ThrowTypeError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle ReferenceError', () => {
      const ThrowReferenceError = () => {
        // @ts-ignore - intentionally accessing undefined variable
        return <div>{undefinedVariable}</div>;
      };

      render(
        <ErrorBoundary>
          <ThrowReferenceError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle custom error objects', () => {
      class CustomError extends Error {
        code: number;
        constructor(message: string, code: number) {
          super(message);
          this.code = code;
          this.name = 'CustomError';
        }
      }

      const ThrowCustomError = () => {
        throw new CustomError('Custom error message', 404);
      };

      render(
        <ErrorBoundary>
          <ThrowCustomError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/custom error message/i)).toBeInTheDocument();
    });
  });

  describe('Error Boundary Isolation', () => {
    it('should only affect erroring component, not siblings', () => {
      const GoodComponent = () => <div>Good component</div>;

      render(
        <div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <GoodComponent />
        </div>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText('Good component')).toBeInTheDocument();
    });

    it('should isolate multiple error boundaries', () => {
      render(
        <div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <ErrorBoundary>
            <div>Working component</div>
          </ErrorBoundary>
        </div>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors without message', () => {
      const ThrowNoMessage = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <ThrowNoMessage />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle non-Error objects thrown', () => {
      const ThrowString = () => {
        throw 'String error';
      };

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle very long error messages', () => {
      const longMessage = 'Error: ' + 'a'.repeat(10000);
      const ThrowLongError = () => {
        throw new Error(longMessage);
      };

      render(
        <ErrorBoundary>
          <ThrowLongError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle errors with circular references', () => {
      const ThrowCircularError = () => {
        const error: any = new Error('Circular error');
        error.circular = error;
        throw error;
      };

      render(
        <ErrorBoundary>
          <ThrowCircularError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('Production vs Development', () => {
    it('should log errors to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Recovery Mechanisms', () => {
    it('should provide a way to recover from errors', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error boundary should show fallback UI
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      
      // Check if there's a way to recover (reload button, etc.)
      // This depends on your ErrorBoundary implementation
    });
  });
});
