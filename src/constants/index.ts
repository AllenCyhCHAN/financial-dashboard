import { Currency } from '../types/index.js';

// Application Constants
export const APP_NAME = 'Finance App';
export const APP_VERSION = '1.0.0';

// Navigation Menu Items
export const MENU_ITEMS = [
    { text: 'Dashboard', icon: 'Dashboard', path: '/' },
    { text: 'Setup', icon: 'BuildCircle', path: '/setup' },
    { text: 'Transactions', icon: 'Receipt', path: '/transactions' },
    { text: 'Investments', icon: 'TrendingUp', path: '/investments' },
    { text: 'Settings', icon: 'Settings', path: '/settings' },
] as const;

// Initial Setup Steps
export const INITIAL_SETUP_STEPS = [
    'Banking Accounts',
    'Debts & Loans',
    'Investments',
    'Review & Complete',
] as const;

// Account Types
export const ACCOUNT_TYPES = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
    { value: 'brokerage', label: 'Brokerage Account' },
    { value: 'retirement', label: 'Retirement Account' },
    { value: 'crypto', label: 'Crypto Exchange' },
];

// Debt Types
export const DEBT_TYPES = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'car_loan', label: 'Car Loan' },
    { value: 'other', label: 'Other' },
];

// Investment Account Types
export const INVESTMENT_ACCOUNT_TYPES = [
    { value: 'investment', label: 'Investment Account' },
    { value: 'retirement', label: 'Retirement Account' },
    { value: 'brokerage', label: 'Brokerage Account' },
    { value: 'mutual_fund', label: 'Mutual Fund Account' },
    { value: 'other', label: 'Other' },
];

// Period Filter Options
export const PERIOD_FILTER_OPTIONS = [
    { value: 'all', label: 'All Time' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
] as const;

// Table Configuration
export const TABLE_CONFIG = {
    TRANSACTIONS: {
        fixedWidth: '100%',
        minWidth: 800,
    },
    INVESTMENTS: {
        fixedWidth: '100%',
        minWidth: 800,
    },
} as const;

// Chart Configuration
export const CHART_CONFIG = {
    COLORS: {
        primary: '#9c27b0',
        secondary: '#673ab7',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
    },
    HEIGHTS: {
        default: 300,
        large: 400,
    },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    TRANSACTIONS: 'Im-broke-transactions',
    INVESTMENTS: 'Im-broke-investments',
    ACCOUNTS: 'Im-broke-accounts',
    CURRENCY: 'currency-storage',
    THEME: 'theme-storage',
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
    REQUIRED_FIELDS: {
        accountName: 'Account name is required',
        debtName: 'Debt name is required',
        investmentName: 'Investment name is required',
        transactionDescription: 'Description is required',
    },
    MIN_VALUES: {
        amount: 0,
        balance: 0,
    },
} as const;

// Default Form Values
export const DEFAULT_FORM_VALUES = {
    TRANSACTION: {
        type: 'expense',
        amount: 0,
        currency: 'USD',
        description: '',
        category: 'other',
        date: new Date(),
        account: 'checking',
    },
    INVESTMENT: {
        name: '',
        type: 'investment',
        balance: 0,
        currency: 'HKD',
    },
    ACCOUNT: {
        name: '',
        type: 'checking',
        balance: 0,
        currency: 'USD',
    },
    DEBT: {
        name: '',
        type: 'credit_card',
        balance: 0,
        minimumPayment: 0,
        dueDate: new Date(),
        currency: 'USD',
    },
} as const;

// Mock Data Templates - Using environment variables for sensitive data
export const MOCK_DATA_TEMPLATES = {
    ACCOUNTS: [
        {
            name: 'BOC',
            type: 'savings',
            balance: parseFloat(import.meta.env.VITE_BOC_BALANCE || '0'),
            currency: (import.meta.env.VITE_BANKING_CURRENCY as Currency) || Currency.USD
        },
        {
            name: 'Mox',
            type: 'savings',
            balance: parseFloat(import.meta.env.VITE_MOX_BALANCE || '0'),
            currency: (import.meta.env.VITE_BANKING_CURRENCY as Currency) || Currency.USD
        },
    ],
    DEBTS: [
        {
            name: 'Mox',
            type: 'credit_card',
            balance: parseFloat(import.meta.env.VITE_MOX_DEBT || '0'),
            minimumPayment: 0,
            dueDate: new Date(),
            currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
        },
        {
            name: 'MPower',
            type: 'credit_card',
            balance: parseFloat(import.meta.env.VITE_MPOWER_DEBT || '0'),
            minimumPayment: 0,
            dueDate: new Date(),
            currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
        },
        {
            name: 'Travel +',
            type: 'credit_card',
            balance: parseFloat(import.meta.env.VITE_TRAVEL_PLUS_DEBT || '0'),
            minimumPayment: 0,
            dueDate: new Date(),
            currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
        },
        {
            name: 'Uni loan',
            type: 'credit_card',
            balance: parseFloat(import.meta.env.VITE_UNI_LOAN_DEBT || '0'),
            minimumPayment: 0,
            dueDate: new Date(),
            currency: (import.meta.env.VITE_DEBT_CURRENCY as Currency) || Currency.USD,
        },
    ],
    INVESTMENTS: [
        {
            name: 'Binance',
            type: 'investment',
            balance: parseFloat(import.meta.env.VITE_BINANCE_INVESTMENT || '0'),
            currency: (import.meta.env.VITE_INVESTMENT_CURRENCY_USD as Currency) || Currency.USD
        },
        {
            name: 'Futu',
            type: 'investment',
            balance: parseFloat(import.meta.env.VITE_FUTU_INVESTMENT || '0'),
            currency: (import.meta.env.VITE_INVESTMENT_CURRENCY_HKD as Currency) || Currency.HKD
        },
    ],
};
