import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface ValidationRules<T> {
  [K in keyof T]?: ValidationRule<T[K]>[];
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validateAll: () => boolean;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  reset: () => void;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  rules?: ValidationRules<T>
): UseFormValidationReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof T];
        return newErrors;
      });
    }
  }, [errors]);

  const validateField = useCallback((name: keyof T): boolean => {
    if (!rules || !rules[name]) return true;

    const fieldRules = rules[name]!;
    const value = values[name];

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    return true;
  }, [values, rules]);

  const handleBlur = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name as keyof T]: true }));
    validateField(name as keyof T);
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    if (!rules) return true;

    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(rules).forEach((field) => {
      const key = field as keyof T;
      const fieldRules = rules[key];
      if (!fieldRules) return;

      for (const rule of fieldRules) {
        if (!rule.validate(values[key])) {
          newErrors[key] = rule.message;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, rules]);

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
    reset,
  };
};

export default useFormValidation;
