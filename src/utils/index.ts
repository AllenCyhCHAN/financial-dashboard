import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import type { Transaction } from '../types/index.js';
import {
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  Currency,
} from '../types/index.js';
import { currencyService } from '../services/currencyService';

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: Currency = Currency.USD
): string => {
  return currencyService.formatCurrency(amount, currency);
};

// Date formatting
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd');
};

export const formatMonthYear = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM yyyy');
};

// Number formatting
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${formatNumber(value, decimals)}%`;
};

// Transaction calculations
export const calculateTotalByType = (
  transactions: Transaction[],
  type: TransactionType
): number => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateMonthlyTotal = (
  transactions: Transaction[],
  type: TransactionType,
  month: Date
): number => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  return transactions
    .filter(t => {
      const transactionDate =
        typeof t.date === 'string' ? parseISO(t.date) : t.date;
      return (
        t.type === type && transactionDate >= start && transactionDate <= end
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateNetWorth = (
  totalIncome: number,
  totalExpenses: number,
  totalInvestments: number
): number => {
  return totalIncome - totalExpenses + totalInvestments;
};

// Category helpers
export const getCategoryLabel = (category: string): string => {
  const categoryLabels: Record<string, string> = {
    // Expense categories
    [ExpenseCategory.FOOD]: 'Food & Dining',
    [ExpenseCategory.TRANSPORTATION]: 'Transportation',
    [ExpenseCategory.ENTERTAINMENT]: 'Entertainment',
    [ExpenseCategory.HEALTHCARE]: 'Healthcare',
    [ExpenseCategory.EDUCATION]: 'Education',
    [ExpenseCategory.SHOPPING]: 'Shopping',
    [ExpenseCategory.UTILITIES]: 'Utilities',
    [ExpenseCategory.OTHER]: 'Other',

    // Income categories
    [IncomeCategory.SALARY]: 'Salary',
    [IncomeCategory.FREELANCE]: 'Freelance',
    [IncomeCategory.INVESTMENT_RETURN]: 'Investment Return',
    [IncomeCategory.BUSINESS]: 'Business',
    [IncomeCategory.OTHER]: 'Other',
  };

  return categoryLabels[category] || category;
};

export const getCategoryColor = (category: string, index: number): string => {
  const colors = [
    '#1976d2',
    '#dc004e',
    '#2e7d32',
    '#ed6c02',
    '#0288d1',
    '#9c27b0',
    '#d32f2f',
    '#388e3c',
    '#f57c00',
    '#5e35b1',
    '#c2185b',
    '#00796b',
    '#fbc02d',
    '#303f9f',
    '#689f38',
  ];

  return colors[index % colors.length];
};

// Data aggregation
export const groupTransactionsByCategory = (
  transactions: Transaction[],
  type: TransactionType
): Array<{ category: string; amount: number; count: number }> => {
  const filtered = transactions.filter(t => t.type === type);
  const grouped = filtered.reduce(
    (acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += transaction.amount;
      acc[category].count += 1;
      return acc;
    },
    {} as Record<string, { category: string; amount: number; count: number }>
  );

  return Object.values(grouped).sort((a, b) => b.amount - a.amount);
};

export const generateMonthlyTrends = (
  transactions: Transaction[],
  months: number = 12
): Array<{
  month: string;
  income: number;
  expenses: number;
  savings: number;
}> => {
  const trends = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const month = subMonths(now, i);
    const monthStr = formatMonthYear(month);

    const income = calculateMonthlyTotal(
      transactions,
      TransactionType.INCOME,
      month
    );
    const expenses = calculateMonthlyTotal(
      transactions,
      TransactionType.EXPENSE,
      month
    );
    const savings = income - expenses;

    trends.push({
      month: monthStr,
      income,
      expenses,
      savings,
    });
  }

  return trends;
};

// Validation helpers
export const validateAmount = (amount: string | number): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num >= 0;
};

export const validateDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Local storage helpers
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
