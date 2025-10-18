import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { formatCurrency, getCategoryColor } from '../../utils';

interface CategoryBreakdownProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  title?: string;
  height?: number;
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownProps> = ({
  data,
  title = 'Category Breakdown',
  height = 300,
}) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box
            sx={{
              width: '100%',
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No Data Available
            </Typography>
            <Typography variant="body2">
              No data to display for this category breakdown
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const COLORS = data.map((_, index) => getCategoryColor('', index));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
            {data.name}
          </Typography>
          <Typography variant="body2">
            Amount: {formatCurrency(data.value)}
          </Typography>
          <Typography variant="body2">
            Percentage: {data.payload.percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {payload.map((entry: any, index: number) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 2,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                mr: 1,
                borderRadius: '50%',
              }}
            />
            <Typography variant="body2">
              {entry.value} ({formatCurrency(entry.payload.amount)})
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
