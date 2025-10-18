import {
  Transaction,
  Investment,
  Account,
  DashboardSummary,
  ChartDataPoint,
  CategoryBreakdown,
  MonthlyTrend,
  FilterOptions,
  ApiResponse,
  PaginatedResponse,
} from '../types';

// Base API configuration
const API_BASE_URL =
  process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Transaction endpoints
  async getTransactions(
    filters?: FilterOptions,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.dateRange && {
        startDate: filters.dateRange.start.toISOString(),
        endDate: filters.dateRange.end.toISOString(),
      }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.minAmount && { minAmount: filters.minAmount.toString() }),
      ...(filters?.maxAmount && { maxAmount: filters.maxAmount.toString() }),
      ...(filters?.search && { search: filters.search }),
    });

    return this.request<PaginatedResponse<Transaction>>(
      `/transactions?${params}`
    );
  }

  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/transactions/${id}`);
  }

  async createTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(
    id: string,
    transaction: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Investment endpoints
  async getInvestments(): Promise<ApiResponse<Investment[]>> {
    return this.request<Investment[]>('/investments');
  }

  async getInvestment(id: string): Promise<ApiResponse<Investment>> {
    return this.request<Investment>(`/investments/${id}`);
  }

  async createInvestment(
    investment: Omit<Investment, 'id'>
  ): Promise<ApiResponse<Investment>> {
    return this.request<Investment>('/investments', {
      method: 'POST',
      body: JSON.stringify(investment),
    });
  }

  async updateInvestment(
    id: string,
    investment: Partial<Investment>
  ): Promise<ApiResponse<Investment>> {
    return this.request<Investment>(`/investments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(investment),
    });
  }

  async deleteInvestment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/investments/${id}`, {
      method: 'DELETE',
    });
  }

  // Account endpoints
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    return this.request<Account[]>('/accounts');
  }

  async createAccount(
    account: Omit<Account, 'id'>
  ): Promise<ApiResponse<Account>> {
    return this.request<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  async updateAccount(
    id: string,
    account: Partial<Account>
  ): Promise<ApiResponse<Account>> {
    return this.request<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    });
  }

  async deleteAccount(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    return this.request<DashboardSummary>('/dashboard/summary');
  }

  async getMonthlyTrends(
    months: number = 12
  ): Promise<ApiResponse<MonthlyTrend[]>> {
    return this.request<MonthlyTrend[]>(`/dashboard/trends?months=${months}`);
  }

  async getCategoryBreakdown(
    type: 'income' | 'expense'
  ): Promise<ApiResponse<CategoryBreakdown[]>> {
    return this.request<CategoryBreakdown[]>(
      `/dashboard/categories?type=${type}`
    );
  }

  async getChartData(
    chartType: string,
    period: string
  ): Promise<ApiResponse<ChartDataPoint[]>> {
    return this.request<ChartDataPoint[]>(
      `/dashboard/charts/${chartType}?period=${period}`
    );
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for testing or custom configurations
export { ApiClient };
