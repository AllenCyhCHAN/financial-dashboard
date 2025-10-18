import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTransactionStore } from '../store';
import { TrendChart } from '../components/charts/TrendChart';
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart';
import { MonthlyComparisonChart } from '../components/charts/MonthlyComparisonChart';
import {
  formatCurrency,
  generateMonthlyTrends,
  groupTransactionsByCategory,
} from '../utils';
import { TransactionType } from '../types/index.js';

export const Analytics: React.FC = () => {
  const { transactions } = useTransactionStore();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6');

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
        <Typography>Loading analytics...</Typography>
      </Container>
    );
  }

  // Generate analytics data
  const monthlyTrends = generateMonthlyTrends(
    transactions,
    parseInt(timeRange)
  );
  const expenseBreakdown = groupTransactionsByCategory(
    transactions,
    TransactionType.EXPENSE
  );
  const incomeBreakdown = groupTransactionsByCategory(
    transactions,
    TransactionType.INCOME
  );

  // Calculate totals for percentages
  const totalExpenses = expenseBreakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalIncome = incomeBreakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Add percentages to breakdown data
  const expenseBreakdownWithPercentages = expenseBreakdown.map(item => ({
    ...item,
    percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0,
  }));

  const incomeBreakdownWithPercentages = incomeBreakdown.map(item => ({
    ...item,
    percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0,
  }));

  // Generate comparison data (current vs previous month)
  const currentMonth = monthlyTrends[monthlyTrends.length - 1];
  const previousMonth = monthlyTrends[monthlyTrends.length - 2];

  const comparisonData = [
    {
      month: 'Income',
      current: currentMonth?.income || 0,
      previous: previousMonth?.income || 0,
    },
    {
      month: 'Expenses',
      current: currentMonth?.expenses || 0,
      previous: previousMonth?.expenses || 0,
    },
    {
      month: 'Savings',
      current: currentMonth?.savings || 0,
      previous: previousMonth?.savings || 0,
    },
  ];

  // Calculate key metrics
  const averageMonthlyIncome = totalIncome / parseInt(timeRange);
  const averageMonthlyExpenses = totalExpenses / parseInt(timeRange);
  const averageMonthlySavings = averageMonthlyIncome - averageMonthlyExpenses;
  const savingsRate =
    averageMonthlyIncome > 0
      ? (averageMonthlySavings / averageMonthlyIncome) * 100
      : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Analytics</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={e => setTimeRange(e.target.value)}
          >
            <MenuItem value="3">3 Months</MenuItem>
            <MenuItem value="6">6 Months</MenuItem>
            <MenuItem value="12">12 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Monthly Income
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatCurrency(averageMonthlyIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Monthly Expenses
              </Typography>
              <Typography variant="h5" color="error.main">
                {formatCurrency(averageMonthlyExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Monthly Savings
              </Typography>
              <Typography variant="h5" color="info.main">
                {formatCurrency(averageMonthlySavings)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Savings Rate
              </Typography>
              <Typography variant="h5" color="primary.main">
                {savingsRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <TrendChart
            data={monthlyTrends}
            title={`Monthly Trends (${timeRange} months)`}
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
          <MonthlyComparisonChart
            data={comparisonData}
            title="Current vs Previous Month"
            height={300}
            currentLabel="Current Month"
            previousLabel="Previous Month"
          />
        </Grid>
      </Grid>

      {/* Additional Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Spending Insights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  • Highest spending category:{' '}
                  {expenseBreakdown[0]?.category || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  • Total transactions: {transactions.length}
                </Typography>
                <Typography variant="body2">
                  • Average transaction:{' '}
                  {formatCurrency(
                    totalExpenses /
                      transactions.filter(
                        t => t.type === TransactionType.EXPENSE
                      ).length
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income Insights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  • Primary income source:{' '}
                  {incomeBreakdown[0]?.category || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  • Income diversity: {incomeBreakdown.length} sources
                </Typography>
                <Typography variant="body2">
                  • Monthly consistency:{' '}
                  {monthlyTrends.length > 0 ? 'Good' : 'Needs improvement'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
