export enum Currency {
  USD = 'USD',
  HKD = 'HKD',
}

export interface CurrencyRate {
  from: Currency;
  to: Currency;
  rate: number;
  timestamp: number;
}

export interface CurrencyConversion {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  convertedAmount: number;
  rate: number;
  timestamp: number;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  INVESTMENT = 'investment',
  TRANSFER = 'transfer',
  ASSET = 'asset',
  LIABILITY = 'liability',
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  UTILITIES = 'utilities',
  OTHER = 'other',
}

export enum IncomeCategory {
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT_RETURN = 'investment_return',
  BUSINESS = 'business',
  OTHER = 'other',
}

export enum InvestmentType {
  STOCKS = 'stocks',
  BONDS = 'bonds',
  CRYPTO = 'crypto',
  REAL_ESTATE = 'real_estate',
  MUTUAL_FUNDS = 'mutual_funds',
  OTHER = 'other',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  category: ExpenseCategory | IncomeCategory | InvestmentType;
  date: Date;
  account?: string;
  tags?: string[];
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  symbol?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  description?: string;
  currency: Currency;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'debit';
  balance: number;
  currency: Currency;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  type?: TransactionType;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}
