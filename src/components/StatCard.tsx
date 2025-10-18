import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'primary',
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.isPositive ? (
      <TrendingUp color="success" />
    ) : (
      <TrendingDown color="error" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return 'default';
    return trend.isPositive ? 'success' : 'error';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {getTrendIcon()}
                <Chip
                  label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
                  size="small"
                  color={getTrendColor()}
                  sx={{ ml: 1 }}
                />
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}.light`,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

interface LoadingCardProps {
  height?: number;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ height = 200 }) => (
  <Card sx={{ height }}>
    <CardContent
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Typography>Loading...</Typography>
    </CardContent>
  </Card>
);

interface ErrorCardProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onRetry }) => (
  <Card>
    <CardContent>
      <Typography color="error" variant="h6" gutterBottom>
        Error
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {error}
      </Typography>
      {onRetry && (
        <Tooltip title="Retry">
          <IconButton onClick={onRetry} color="primary">
            <TrendingUp />
          </IconButton>
        </Tooltip>
      )}
    </CardContent>
  </Card>
);

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => (
  <Card>
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 4,
      }}
    >
      {icon && <Box sx={{ mb: 2, color: 'text.secondary' }}>{icon}</Box>}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {description}
      </Typography>
      {action}
    </CardContent>
  </Card>
);
