import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Savings,
} from '@mui/icons-material';
import { StatCard } from '../components/StatCard';
import { TrendChart } from '../components/charts/TrendChart';
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart';
import { useTransactionStore, useCurrencyStore } from '../store';
import { LocalStorageService } from '../services/mockData';
import {
  formatCurrency,
  calculateTotalByType,
  generateMonthlyTrends,
  groupTransactionsByCategory,
} from '../utils';
import { TransactionType } from '../types/index.js';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { transactions, setTransactions } = useTransactionStore();
  const { defaultCurrency } = useCurrencyStore();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'yearly' | 'monthly' | 'weekly'>(
    'monthly'
  );

  useEffect(() => {
    // Load data from localStorage
    const storedTransactions = LocalStorageService.getTransactions();
    setTransactions(storedTransactions);
    setLoading(false);
  }, [setTransactions]);

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);

      switch (period) {
        case 'all':
          return true;
        case 'yearly':
          return transactionDate.getFullYear() === now.getFullYear();
        case 'monthly':
          return (
            transactionDate.getFullYear() === now.getFullYear() &&
            transactionDate.getMonth() === now.getMonth()
          );
        case 'weekly': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        }
        default:
          return true;
      }
    });
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

  // Calculate summary data
  const totalIncome = calculateTotalByType(
    filteredTransactions,
    TransactionType.INCOME
  );
  const totalExpenses = calculateTotalByType(
    filteredTransactions,
    TransactionType.EXPENSE
  );
  const totalAssets = calculateTotalByType(
    filteredTransactions,
    TransactionType.ASSET
  );
  const totalLiabilities = calculateTotalByType(
    filteredTransactions,
    TransactionType.LIABILITY
  );
  const netWorth = totalAssets - totalLiabilities;

  // Calculate month-to-month trends
  const calculateMonthlyTrend = (
    transactionType: TransactionType
  ): { value: number; isPositive: boolean } => {
    const currentMonth = new Date();
    const previousMonth = subMonths(currentMonth, 1);

    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);
    const previousMonthStart = startOfMonth(previousMonth);
    const previousMonthEnd = endOfMonth(previousMonth);

    const currentMonthTransactions = transactions.filter(
      t =>
        t.type === transactionType &&
        t.date >= currentMonthStart &&
        t.date <= currentMonthEnd
    );

    const previousMonthTransactions = transactions.filter(
      t =>
        t.type === transactionType &&
        t.date >= previousMonthStart &&
        t.date <= previousMonthEnd
    );

    const currentAmount = currentMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const previousAmount = previousMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    if (previousAmount === 0) {
      return { value: 0, isPositive: currentAmount >= 0 };
    }

    const percentageChange =
      ((currentAmount - previousAmount) / previousAmount) * 100;
    return {
      value: Math.abs(percentageChange),
      isPositive: percentageChange >= 0,
    };
  };

  const incomeTrend = calculateMonthlyTrend(TransactionType.INCOME);
  const expenseTrend = calculateMonthlyTrend(TransactionType.EXPENSE);
  const assetTrend = calculateMonthlyTrend(TransactionType.ASSET);

  // Calculate net worth trend (assets - liabilities)
  const calculateNetWorthTrend = (): { value: number; isPositive: boolean } => {
    const currentMonth = new Date();
    const previousMonth = subMonths(currentMonth, 1);

    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);
    const previousMonthStart = startOfMonth(previousMonth);
    const previousMonthEnd = endOfMonth(previousMonth);

    const currentMonthTransactions = transactions.filter(
      t => t.date >= currentMonthStart && t.date <= currentMonthEnd
    );

    const previousMonthTransactions = transactions.filter(
      t => t.date >= previousMonthStart && t.date <= previousMonthEnd
    );

    const currentNetWorth = currentMonthTransactions.reduce((sum, t) => {
      if (t.type === TransactionType.ASSET) {
        return sum + t.amount;
      } else if (t.type === TransactionType.LIABILITY) {
        return sum - t.amount;
      }
      return sum;
    }, 0);

    const previousNetWorth = previousMonthTransactions.reduce((sum, t) => {
      if (t.type === TransactionType.ASSET) {
        return sum + t.amount;
      } else if (t.type === TransactionType.LIABILITY) {
        return sum - t.amount;
      }
      return sum;
    }, 0);

    if (previousNetWorth === 0) {
      return { value: 0, isPositive: currentNetWorth >= 0 };
    }

    const percentageChange =
      ((currentNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100;
    return {
      value: Math.abs(percentageChange),
      isPositive: percentageChange >= 0,
    };
  };

  const netWorthTrend = calculateNetWorthTrend();

  // Generate chart data
  const monthlyTrends = generateMonthlyTrends(transactions, 6);
  const expenseBreakdown = groupTransactionsByCategory(
    transactions,
    TransactionType.EXPENSE
  );
  const incomeBreakdown = groupTransactionsByCategory(
    transactions,
    TransactionType.INCOME
  );

  // Calculate percentages for pie charts
  const expenseBreakdownWithPercentages = expenseBreakdown.map(item => ({
    ...item,
    percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0,
  }));

  const incomeBreakdownWithPercentages = incomeBreakdown.map(item => ({
    ...item,
    percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0,
  }));

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Dashboard Overview</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={e => setPeriod(e.target.value as any)}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Income"
            value={formatCurrency(totalIncome, defaultCurrency)}
            icon={<TrendingUp />}
            color="success"
            trend={{
              value: incomeTrend.value,
              isPositive: incomeTrend.isPositive,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Expenses"
            value={formatCurrency(totalExpenses, defaultCurrency)}
            icon={<TrendingDown />}
            color="error"
            trend={{
              value: expenseTrend.value,
              isPositive: expenseTrend.isPositive,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Assets"
            value={formatCurrency(totalAssets, defaultCurrency)}
            icon={<Savings />}
            color="info"
            trend={{
              value: assetTrend.value,
              isPositive: assetTrend.isPositive,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Liabilities"
            value={formatCurrency(totalLiabilities, defaultCurrency)}
            icon={<TrendingDown />}
            color="warning"
            trend={{ value: 0, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Net Worth"
            value={formatCurrency(netWorth, defaultCurrency)}
            icon={<AccountBalance />}
            color="primary"
            trend={{
              value: netWorthTrend.value,
              isPositive: netWorthTrend.isPositive,
            }}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <TrendChart
            data={monthlyTrends}
            title="Monthly Trends"
            height={400}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <CategoryBreakdownChart
            data={expenseBreakdownWithPercentages}
            title="Expense Breakdown"
            height={400}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CategoryBreakdownChart
            data={incomeBreakdownWithPercentages}
            title="Income Breakdown"
            height={300}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Average Monthly Income
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(totalIncome / 6, defaultCurrency)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Average Monthly Expenses
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(totalExpenses / 6, defaultCurrency)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Savings Rate
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {totalIncome > 0
                      ? ((netWorth / totalIncome) * 100).toFixed(1)
                      : '0.0'}
                    %
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
