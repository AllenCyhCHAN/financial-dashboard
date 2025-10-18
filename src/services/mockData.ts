import type { Transaction, Investment, Account } from '../types/index.js';
import {
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  InvestmentType,
  Currency,
} from '../types/index.js';
import { subMonths } from 'date-fns';

// Generate random ID
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Transactions - Using environment variables for sensitive data
export const mockTransactions: Transaction[] = [
  // Your actual banking accounts (Assets)
  {
    id: generateId(),
    type: TransactionType.ASSET,
    amount: parseFloat(import.meta.env.VITE_BOC_BALANCE || '0'),
    currency: (import.meta.env.VITE_BANKING_CURRENCY as Currency) || Currency.USD,
    description: 'Initial BOC balance',
    category: 'Initial Balance' as any,
    date: new Date(),
    account: 'savings',
  },
  {
    id: generateId(),
    type: TransactionType.ASSET,
    amount: parseFloat(import.meta.env.VITE_MOX_BALANCE || '0'),
    currency: (import.meta.env.VITE_BANKING_CURRENCY as Currency) || Currency.USD,
    description: 'Initial Mox balance',
    category: 'Initial Balance' as any,
    date: new Date(),
    account: 'savings',
  },

  // Your actual debts (Liabilities)
  {
    id: generateId(),
    type: TransactionType.LIABILITY,
    amount: parseFloat(import.meta.env.VITE_MOX_DEBT || '0'),
    currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
    description: 'Initial Mox debt',
    category: 'Debt' as any,
    date: new Date(),
    account: 'credit_card',
  },
  {
    id: generateId(),
    type: TransactionType.LIABILITY,
    amount: parseFloat(import.meta.env.VITE_MPOWER_DEBT || '0'),
    currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
    description: 'Initial MPower debt',
    category: 'Debt' as any,
    date: new Date(),
    account: 'credit_card',
  },
  {
    id: generateId(),
    type: TransactionType.LIABILITY,
    amount: parseFloat(import.meta.env.VITE_TRAVEL_PLUS_DEBT || '0'),
    currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
    description: 'Initial Travel + debt',
    category: 'Debt' as any,
    date: new Date(),
    account: 'credit_card',
  },
  {
    id: generateId(),
    type: TransactionType.LIABILITY,
    amount: parseFloat(import.meta.env.VITE_UNI_LOAN_DEBT || '0'),
    currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
    description: 'Initial Uni loan debt',
    category: 'Debt' as any,
    date: new Date(),
    account: 'credit_card',
  },

  // Your actual investments (Assets)
  {
    id: generateId(),
    type: TransactionType.ASSET,
    amount: parseFloat(import.meta.env.VITE_BINANCE_INVESTMENT || '0'),
    currency: (import.meta.env.VITE_INVESTMENT_CURRENCY_USD as Currency) || Currency.USD,
    description: 'Initial Binance investment',
    category: InvestmentType.OTHER,
    date: new Date(),
    account: 'investment',
  },
  {
    id: generateId(),
    type: TransactionType.ASSET,
    amount: parseFloat(import.meta.env.VITE_FUTU_INVESTMENT || '0'),
    currency: (import.meta.env.VITE_INVESTMENT_CURRENCY_HKD as Currency) || Currency.HKD,
    description: 'Initial Futu investment',
    category: InvestmentType.OTHER,
    date: new Date(),
    account: 'investment',
  },

  // Historical data for trends (last month)
  {
    id: generateId(),
    type: TransactionType.INCOME,
    amount: 25000,
    currency: Currency.HKD,
    description: 'Previous Month Salary',
    category: IncomeCategory.SALARY,
    date: subMonths(new Date(), 1),
    account: 'checking',
  },
  {
    id: generateId(),
    type: TransactionType.EXPENSE,
    amount: 12000,
    currency: Currency.HKD,
    description: 'Previous Month Expenses',
    category: ExpenseCategory.OTHER,
    date: subMonths(new Date(), 1),
    account: 'checking',
  },

  // More historical data (2 months ago)
  {
    id: generateId(),
    type: TransactionType.INCOME,
    amount: 25000,
    currency: Currency.HKD,
    description: 'Two Months Ago Salary',
    category: IncomeCategory.SALARY,
    date: subMonths(new Date(), 2),
    account: 'checking',
  },
  {
    id: generateId(),
    type: TransactionType.EXPENSE,
    amount: 11000,
    currency: Currency.HKD,
    description: 'Two Months Ago Expenses',
    category: ExpenseCategory.OTHER,
    date: subMonths(new Date(), 2),
    account: 'checking',
  },
];

// Mock Investments - Using environment variables for sensitive data
export const mockInvestments: Investment[] = [
  {
    id: generateId(),
    name: 'Binance',
    type: InvestmentType.OTHER,
    symbol: '',
    quantity: 1,
    purchasePrice: parseFloat(import.meta.env.VITE_BINANCE_INVESTMENT || '0'),
    currentPrice: parseFloat(import.meta.env.VITE_BINANCE_INVESTMENT || '0'),
    currency: (import.meta.env.VITE_INVESTMENT_CURRENCY_USD as Currency) || Currency.USD,
    purchaseDate: new Date(),
    description: 'Initial Binance investment account',
  },
  {
    id: generateId(),
    name: 'Futu',
    type: InvestmentType.OTHER,
    symbol: '',
    quantity: 1,
    purchasePrice: parseFloat(import.meta.env.VITE_FUTU_INVESTMENT || '0'),
    currentPrice: parseFloat(import.meta.env.VITE_FUTU_INVESTMENT || '0'),
    currency: (import.meta.env.VITE_INVESTMENT_CURRENCY_HKD as Currency) || Currency.HKD,
    purchaseDate: new Date(),
    description: 'Initial Futu investment account',
  },
];

// Mock Accounts - Using environment variables for sensitive data
export const mockAccounts: Account[] = [
  {
    id: generateId(),
    name: 'BOC',
    type: 'savings',
    balance: parseFloat(import.meta.env.VITE_BOC_BALANCE || '0'),
    currency: (import.meta.env.VITE_BANKING_CURRENCY as Currency) || Currency.USD,
  },
  {
    id: generateId(),
    name: 'Mox',
    type: 'savings',
    balance: parseFloat(import.meta.env.VITE_MOX_BALANCE || '0'),
    currency: (import.meta.env.VITE_BANKING_CURRENCY as Currency) || Currency.USD,
  },
];

// Local Storage Service
export class LocalStorageService {
  static getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem('financial-dashboard-transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
      }
    } catch (error) {
      console.error('Error loading transactions from localStorage:', error);
    }
    return mockTransactions;
  }

  static saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(
        'financial-dashboard-transactions',
        JSON.stringify(transactions)
      );
    } catch (error) {
      console.error('Error saving transactions to localStorage:', error);
    }
  }

  static getInvestments(): Investment[] {
    try {
      const stored = localStorage.getItem('financial-dashboard-investments');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((investment: any) => ({
          ...investment,
          purchaseDate: new Date(investment.purchaseDate),
        }));
      }
    } catch (error) {
      console.error('Error loading investments from localStorage:', error);
    }
    return mockInvestments;
  }

  static saveInvestments(investments: Investment[]): void {
    try {
      localStorage.setItem(
        'financial-dashboard-investments',
        JSON.stringify(investments)
      );
    } catch (error) {
      console.error('Error saving investments to localStorage:', error);
    }
  }

  static getAccounts(): Account[] {
    try {
      const stored = localStorage.getItem('financial-dashboard-accounts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading accounts from localStorage:', error);
    }
    return mockAccounts;
  }

  static saveAccounts(accounts: Account[]): void {
    try {
      localStorage.setItem(
        'financial-dashboard-accounts',
        JSON.stringify(accounts)
      );
    } catch (error) {
      console.error('Error saving accounts to localStorage:', error);
    }
  }

  static clearAllData(): void {
    try {
      localStorage.removeItem('financial-dashboard-transactions');
      localStorage.removeItem('financial-dashboard-investments');
      localStorage.removeItem('financial-dashboard-accounts');
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
    }
  }
}
