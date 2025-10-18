import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { formatCurrency } from '../../utils';

interface MonthlyComparisonProps {
  data: Array<{
    month: string;
    current: number;
    previous: number;
  }>;
  title?: string;
  height?: number;
  currentLabel?: string;
  previousLabel?: string;
}

export const MonthlyComparisonChart: React.FC<MonthlyComparisonProps> = ({
  data,
  title = 'Monthly Comparison',
  height = 300,
  currentLabel = 'Current Month',
  previousLabel = 'Previous Month',
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={value => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="current"
                fill="#1976d2"
                name={currentLabel}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="previous"
                fill="#dc004e"
                name={previousLabel}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
