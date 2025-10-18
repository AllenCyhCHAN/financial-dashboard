import { VALIDATION_RULES } from '../constants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Generic validation function
export const validateRequired = (
  value: any,
  fieldName: string
): ValidationError | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
};

export const validateMinValue = (
  value: number,
  minValue: number,
  fieldName: string
): ValidationError | null => {
  if (value < minValue) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minValue}`,
    };
  }
  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address',
    };
  }
  return null;
};

// Validation schemas for different forms
export const validateAccount = (account: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(account.name, 'Account name');
  if (nameError) errors.push(nameError);

  const balanceError = validateMinValue(
    account.balance,
    VALIDATION_RULES.MIN_VALUES.balance,
    'Balance'
  );
  if (balanceError) errors.push(balanceError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDebt = (debt: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(debt.name, 'Debt name');
  if (nameError) errors.push(nameError);

  const balanceError = validateMinValue(
    debt.balance,
    VALIDATION_RULES.MIN_VALUES.balance,
    'Balance'
  );
  if (balanceError) errors.push(balanceError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateInvestment = (investment: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(investment.name, 'Investment name');
  if (nameError) errors.push(nameError);

  const balanceError = validateMinValue(
    investment.balance,
    VALIDATION_RULES.MIN_VALUES.balance,
    'Balance'
  );
  if (balanceError) errors.push(balanceError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTransaction = (transaction: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const descriptionError = validateRequired(
    transaction.description,
    'Description'
  );
  if (descriptionError) errors.push(descriptionError);

  const amountError = validateMinValue(
    transaction.amount,
    VALIDATION_RULES.MIN_VALUES.amount,
    'Amount'
  );
  if (amountError) errors.push(amountError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate arrays of items
export const validateItems = <T>(
  items: T[],
  validator: (item: T) => ValidationResult,
  itemName: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  items.forEach((item, index) => {
    const result = validator(item);
    if (!result.isValid) {
      result.errors.forEach(error => {
        errors.push({
          field: `${itemName}[${index}].${error.field}`,
          message: `${itemName} ${index + 1}: ${error.message}`,
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
