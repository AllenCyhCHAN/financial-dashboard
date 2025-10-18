import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Transaction,
  Investment,
  Account,
  DashboardSummary,
  ChartDataPoint,
  CategoryBreakdown,
  MonthlyTrend,
  FilterOptions,
} from '../types/index.js';
import { Currency } from '../types/index.js';

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: FilterOptions) => void;
  setPagination: (pagination: {
    page: number;
    limit: number;
    total: number;
  }) => void;
  clearFilters: () => void;
}

interface InvestmentStore {
  investments: Investment[];
  loading: boolean;
  error: string | null;
  // Actions
  setInvestments: (investments: Investment[]) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface AccountStore {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  // Actions
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface DashboardStore {
  summary: DashboardSummary | null;
  monthlyTrends: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
  chartData: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  // Actions
  setSummary: (summary: DashboardSummary) => void;
  setMonthlyTrends: (trends: MonthlyTrend[]) => void;
  setCategoryBreakdown: (breakdown: CategoryBreakdown[]) => void;
  setChartData: (data: ChartDataPoint[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface NotificationStore {
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  addNotification: (
    notification: Omit<NotificationStore['notifications'][0], 'id'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Transaction Store
export const useTransactionStore = create<TransactionStore>()(
  persist(
    set => ({
      transactions: [],
      loading: false,
      error: null,
      filters: {},
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      setTransactions: transactions => set({ transactions }),
      addTransaction: transaction =>
        set(state => ({
          transactions: [transaction, ...state.transactions],
        })),
      updateTransaction: (id, updatedTransaction) =>
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),
      deleteTransaction: id =>
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id),
        })),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
      setFilters: filters => set({ filters }),
      setPagination: pagination => set({ pagination }),
      clearFilters: () => set({ filters: {} }),
    }),
    {
      name: 'transaction-store',
      partialize: state => ({
        transactions: state.transactions,
        filters: state.filters,
      }),
    }
  )
);

// Investment Store
export const useInvestmentStore = create<InvestmentStore>()(
  persist(
    set => ({
      investments: [],
      loading: false,
      error: null,
      setInvestments: investments => set({ investments }),
      addInvestment: investment =>
        set(state => ({
          investments: [investment, ...state.investments],
        })),
      updateInvestment: (id, updatedInvestment) =>
        set(state => ({
          investments: state.investments.map(i =>
            i.id === id ? { ...i, ...updatedInvestment } : i
          ),
        })),
      deleteInvestment: id =>
        set(state => ({
          investments: state.investments.filter(i => i.id !== id),
        })),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
    }),
    {
      name: 'investment-store',
      partialize: state => ({
        investments: state.investments,
      }),
    }
  )
);

// Account Store
export const useAccountStore = create<AccountStore>()(
  persist(
    set => ({
      accounts: [],
      loading: false,
      error: null,
      setAccounts: accounts => set({ accounts }),
      addAccount: account =>
        set(state => ({
          accounts: [account, ...state.accounts],
        })),
      updateAccount: (id, updatedAccount) =>
        set(state => ({
          accounts: state.accounts.map(a =>
            a.id === id ? { ...a, ...updatedAccount } : a
          ),
        })),
      deleteAccount: id =>
        set(state => ({
          accounts: state.accounts.filter(a => a.id !== id),
        })),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
    }),
    {
      name: 'account-store',
      partialize: state => ({
        accounts: state.accounts,
      }),
    }
  )
);

// Dashboard Store
export const useDashboardStore = create<DashboardStore>(set => ({
  summary: null,
  monthlyTrends: [],
  categoryBreakdown: [],
  chartData: [],
  loading: false,
  error: null,
  setSummary: summary => set({ summary }),
  setMonthlyTrends: monthlyTrends => set({ monthlyTrends }),
  setCategoryBreakdown: categoryBreakdown => set({ categoryBreakdown }),
  setChartData: chartData => set({ chartData }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));

// Theme Store
export const useThemeStore = create<ThemeStore>()(
  persist(
    set => ({
      isDarkMode: false,
      toggleTheme: () => set(state => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-store',
    }
  )
);

// Notification Store
export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],
  addNotification: notification =>
    set(state => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Date.now().toString(),
        },
      ],
    })),
  removeNotification: id =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// Currency Store
interface CurrencyStore {
  defaultCurrency: Currency;
  setDefaultCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    set => ({
      defaultCurrency: Currency.USD,
      setDefaultCurrency: currency => set({ defaultCurrency: currency }),
    }),
    {
      name: 'currency-storage',
    }
  )
);
