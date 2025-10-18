import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { formatCurrency } from '../../utils';

interface TrendChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  title?: string;
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title = 'Monthly Trends',
  height = 300,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={value => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#2e7d32"
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#d32f2f"
                strokeWidth={2}
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#1976d2"
                strokeWidth={2}
                name="Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
