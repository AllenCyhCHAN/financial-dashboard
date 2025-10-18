import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LocalStorageService } from '../services/mockData';
import { useCurrencyStore } from '../store';
import { Currency } from '../types/index.js';

export const Settings: React.FC = () => {
  const { defaultCurrency, setDefaultCurrency } = useCurrencyStore();

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      LocalStorageService.clearAllData();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const transactions = LocalStorageService.getTransactions();
    const investments = LocalStorageService.getInvestments();
    const accounts = LocalStorageService.getAccounts();

    const data = {
      transactions,
      investments,
      accounts,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Im-broke-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Currency Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currency Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Default Currency</InputLabel>
                  <Select
                    value={defaultCurrency}
                    label="Default Currency"
                    onChange={e =>
                      setDefaultCurrency(e.target.value as Currency)
                    }
                  >
                    <MenuItem value={Currency.USD}>USD - US Dollar</MenuItem>
                    <MenuItem value={Currency.HKD}>
                      HKD - Hong Kong Dollar
                    </MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="textSecondary">
                  This currency will be used for all charts, analytics, and as
                  the default for new transactions.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Management
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" onClick={handleExportData} fullWidth>
                  Export Data
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearData}
                  fullWidth
                >
                  Clear All Data
                </Button>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Export your data for backup or clear all stored information
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* App Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Im broke v1.0.0
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                A modern financial tracking application built with React,
                TypeScript, and Material-UI. Track your income, expenses,
                investments, and analyze your financial trends.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Features:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 0.5 }}
                >
                  Dashboard with financial overview
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 0.5 }}
                >
                  Transaction management
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 0.5 }}
                >
                  Investment tracking
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 0.5 }}
                >
                  Analytics and insights
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 0.5 }}
                >
                  Dark purple theme
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
