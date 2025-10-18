import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AccountBalance, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useTransactionStore,
  useInvestmentStore,
  useAccountStore,
} from '../store';
import { LocalStorageService } from '../services/mockData';
import { TransactionType, InvestmentType, Currency } from '../types/index.js';
import type { Transaction } from '../types/index.js';
import {
  INITIAL_SETUP_STEPS,
  ACCOUNT_TYPES,
  DEBT_TYPES,
  INVESTMENT_ACCOUNT_TYPES,
  MOCK_DATA_TEMPLATES,
  DEFAULT_FORM_VALUES,
} from '../constants';
import { SetupCard } from '../components/cards/SetupCard';
import {
  validateItems,
  validateAccount,
  validateDebt,
  validateInvestment,
} from '../utils/validation';

const steps = INITIAL_SETUP_STEPS;

export const InitialSetup: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactionStore();
  const { addInvestment } = useInvestmentStore();
  const { addAccount } = useAccountStore();

  const [activeStep, setActiveStep] = useState(0);
  const [accounts, setAccounts] = useState(
    MOCK_DATA_TEMPLATES.ACCOUNTS.map(acc => ({
      ...acc,
      currency: acc.currency as Currency,
    }))
  );
  const [debts, setDebts] = useState(
    MOCK_DATA_TEMPLATES.DEBTS.map(debt => ({
      ...debt,
      currency: debt.currency as Currency,
    }))
  );
  const [investments, setInvestments] = useState(
    MOCK_DATA_TEMPLATES.INVESTMENTS.map(inv => ({
      ...inv,
      currency: inv.currency as Currency,
    }))
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleAccountChange = (index: number, field: string, value: any) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    setAccounts(updatedAccounts);
  };

  const addAccountRow = () => {
    setAccounts([
      ...accounts,
      { ...DEFAULT_FORM_VALUES.ACCOUNT, currency: Currency.USD },
    ]);
  };

  const removeAccount = (index: number) => {
    if (accounts.length > 0) {
      setAccounts(accounts.filter((_, i) => i !== index));
    }
  };

  const handleInvestmentChange = (index: number, field: string, value: any) => {
    const updatedInvestments = [...investments];
    updatedInvestments[index] = {
      ...updatedInvestments[index],
      [field]: value,
    };
    setInvestments(updatedInvestments);
  };

  const addInvestmentRow = () => {
    setInvestments([
      ...investments,
      {
        name: '',
        type: 'investment',
        balance: 0,
        currency: Currency.HKD,
      },
    ]);
  };

  const removeInvestment = (index: number) => {
    if (investments.length > 0) {
      setInvestments(investments.filter((_, i) => i !== index));
    }
  };

  const handleDebtChange = (index: number, field: string, value: any) => {
    const updatedDebts = [...debts];
    updatedDebts[index] = { ...updatedDebts[index], [field]: value };
    setDebts(updatedDebts);
  };

  const addDebtRow = () => {
    setDebts([
      ...debts,
      { ...DEFAULT_FORM_VALUES.DEBT, currency: Currency.HKD },
    ]);
  };

  const removeDebt = (index: number) => {
    if (debts.length > 0) {
      setDebts(debts.filter((_, i) => i !== index));
    }
  };

  const validateStep = (step: number): boolean => {
    let result: { isValid: boolean; errors: any[] } = {
      isValid: true,
      errors: [],
    };

    if (step === 0) {
      result = validateItems(accounts, validateAccount, 'Account');
    } else if (step === 1) {
      result = validateItems(debts, validateDebt, 'Debt');
    } else if (step === 2) {
      result = validateItems(investments, validateInvestment, 'Investment');
    }

    const errorMessages = result.errors.map(error => error.message);
    setErrors(errorMessages);
    return result.isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleComplete = () => {
    if (validateStep(activeStep)) {
      // Save accounts
      accounts.forEach(account => {
        addAccount({
          id: Date.now().toString() + Math.random(),
          name: account.name,
          type: account.type as any,
          balance: account.balance,
          currency: account.currency,
        });
      });

      // Save investments
      investments.forEach(investment => {
        if (investment.name && investment.balance > 0) {
          addInvestment({
            id: Date.now().toString() + Math.random(),
            name: investment.name,
            type: InvestmentType.OTHER,
            symbol: '',
            quantity: 1,
            purchasePrice: investment.balance,
            currentPrice: investment.balance,
            purchaseDate: new Date(),
            description: `Initial ${investment.name} investment account`,
            currency: investment.currency,
          });
        }
      });

      // Save initial balance transactions
      accounts.forEach(account => {
        if (account.balance > 0) {
          addTransaction({
            id: Date.now().toString() + Math.random(),
            type: TransactionType.ASSET,
            amount: account.balance,
            currency: account.currency,
            description: `Initial ${account.name} balance`,
            category: 'Initial Balance' as any,
            date: new Date(),
            account: account.type,
          });
        }
      });

      // Save investment transactions for analytics
      investments.forEach(investment => {
        if (investment.name && investment.balance > 0) {
          addTransaction({
            id: Date.now().toString() + Math.random(),
            type: TransactionType.ASSET,
            amount: investment.balance,
            currency: investment.currency,
            description: `Initial ${investment.name} investment`,
            category: InvestmentType.OTHER,
            date: new Date(),
            account: 'investment',
          });
        }
      });

      // Save debt transactions for analytics
      debts.forEach(debt => {
        if (debt.name && debt.balance > 0) {
          addTransaction({
            id: Date.now().toString() + Math.random(),
            type: TransactionType.LIABILITY,
            amount: debt.balance,
            currency: debt.currency,
            description: `Initial ${debt.name} debt`,
            category: 'Debt' as any,
            date: new Date(),
            account: debt.type,
          });
        }
      });

      // Save to localStorage
      LocalStorageService.saveAccounts(
        accounts.map(account => ({
          id: Date.now().toString() + Math.random(),
          name: account.name,
          type: account.type as any,
          balance: account.balance,
          currency: account.currency,
        }))
      );

      LocalStorageService.saveInvestments(
        investments
          .filter(inv => inv.name && inv.balance > 0)
          .map(investment => ({
            id: Date.now().toString() + Math.random(),
            name: investment.name,
            type: InvestmentType.OTHER,
            symbol: '',
            quantity: 1,
            purchasePrice: investment.balance,
            currentPrice: investment.balance,
            purchaseDate: new Date(),
            description: `Initial ${investment.name} investment account`,
            currency: investment.currency,
          }))
      );

      // Save all transactions to localStorage
      const allTransactions: Transaction[] = [];

      // Add account balance transactions
      accounts.forEach(account => {
        if (account.balance > 0) {
          allTransactions.push({
            id: Date.now().toString() + Math.random(),
            type: TransactionType.ASSET,
            amount: account.balance,
            currency: account.currency,
            description: `Initial ${account.name} balance`,
            category: 'Initial Balance' as any,
            date: new Date(),
            account: account.type,
          });
        }
      });

      // Add investment transactions
      investments.forEach(investment => {
        if (investment.name && investment.balance > 0) {
          allTransactions.push({
            id: Date.now().toString() + Math.random(),
            type: TransactionType.ASSET,
            amount: investment.balance,
            currency: investment.currency,
            description: `Initial ${investment.name} investment`,
            category: InvestmentType.OTHER,
            date: new Date(),
            account: 'investment',
          });
        }
      });

      // Add debt transactions
      debts.forEach(debt => {
        if (debt.name && debt.balance > 0) {
          allTransactions.push({
            id: Date.now().toString() + Math.random(),
            type: TransactionType.LIABILITY,
            amount: debt.balance,
            currency: debt.currency,
            description: `Initial ${debt.name} debt`,
            category: 'Debt' as any,
            date: new Date(),
            account: debt.type,
          });
        }
      });

      LocalStorageService.saveTransactions(allTransactions);

      // Refresh the transaction store
      const { setTransactions } = useTransactionStore.getState();
      setTransactions(allTransactions);

      navigate('/');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SetupCard
            title="Set up your banking accounts"
            description="Add all your banking accounts (checking, savings, debit cards, credit cards, etc.) that you want to track. You can add multiple accounts of each type."
            items={accounts}
            onAdd={addAccountRow}
            onRemove={removeAccount}
            onChange={handleAccountChange}
            fields={[
              {
                key: 'name',
                label: 'Account Name',
                type: 'text',
                placeholder: 'e.g., Chase Checking',
                xs: 12,
                sm: 4,
              },
              {
                key: 'type',
                label: 'Account Type',
                type: 'select',
                options: ACCOUNT_TYPES,
                xs: 12,
                sm: 3,
              },
              {
                key: 'balance',
                label: 'Current Balance',
                type: 'number',
                placeholder: '0.00',
                xs: 12,
                sm: 2,
              },
              {
                key: 'currency',
                label: 'Currency',
                type: 'currency',
                xs: 12,
                sm: 2,
              },
            ]}
            addButtonText="Add Another Banking Account"
            addButtonIcon={<AccountBalance />}
          />
        );

      case 1:
        return (
          <SetupCard
            title="Add your debts and loans"
            description="Add all your debts, loans, mortgages, and credit card balances that you want to track. You can add multiple debts."
            items={debts}
            onAdd={addDebtRow}
            onRemove={removeDebt}
            onChange={handleDebtChange}
            fields={[
              {
                key: 'name',
                label: 'Debt Name',
                type: 'text',
                placeholder: 'e.g., Chase Credit Card',
                xs: 12,
                sm: 3,
              },
              {
                key: 'type',
                label: 'Debt Type',
                type: 'select',
                options: DEBT_TYPES,
                xs: 12,
                sm: 2,
              },
              {
                key: 'balance',
                label: 'Balance',
                type: 'number',
                placeholder: '0.00',
                xs: 12,
                sm: 2,
              },
              {
                key: 'dueDate',
                label: 'Due Date',
                type: 'date',
                xs: 12,
                sm: 2,
              },
              {
                key: 'currency',
                label: 'Currency',
                type: 'currency',
                xs: 12,
                sm: 2,
              },
            ]}
            addButtonText="Add Another Debt"
            addButtonIcon={<AccountBalance />}
          />
        );

      case 2:
        return (
          <SetupCard
            title="Add your investment accounts"
            description="Add all your investment accounts (brokerage accounts, retirement accounts, etc.) with their current total balances. You can add multiple investment accounts."
            items={investments}
            onAdd={addInvestmentRow}
            onRemove={removeInvestment}
            onChange={handleInvestmentChange}
            fields={[
              {
                key: 'name',
                label: 'Account Name',
                type: 'text',
                placeholder: 'e.g., Fidelity 401k',
                xs: 12,
                sm: 4,
              },
              {
                key: 'type',
                label: 'Account Type',
                type: 'select',
                options: INVESTMENT_ACCOUNT_TYPES,
                xs: 12,
                sm: 3,
              },
              {
                key: 'balance',
                label: 'Current Balance',
                type: 'number',
                placeholder: '0.00',
                xs: 12,
                sm: 2,
              },
              {
                key: 'currency',
                label: 'Currency',
                type: 'currency',
                xs: 12,
                sm: 2,
              },
            ]}
            addButtonText="Add Another Investment Account"
            addButtonIcon={<TrendingUp />}
          />
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your setup
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Please review your information before completing the setup.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Accounts ({accounts.length})
                    </Typography>
                    {accounts.map((account, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {account.name} ({account.type}) - $
                          {account.balance.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <TrendingDown sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Debts ({debts.filter(d => d.name).length})
                    </Typography>
                    {debts
                      .filter(d => d.name)
                      .map((debt, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {debt.name} ({debt.type}) - $
                            {debt.balance.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Due: {debt.dueDate.toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Investments ({investments.filter(inv => inv.name).length})
                    </Typography>
                    {investments
                      .filter(inv => inv.name)
                      .map((investment, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {investment.name} ({investment.type}) - $
                            {investment.balance.toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom align="center">
            Welcome to Im broke
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            paragraph
          >
            Let&apos;s set up your financial tracking by adding your accounts
            and investments.
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Please fix the following errors:
              </Typography>
              {errors.map((error, index) => (
                <Typography key={index} variant="body2">
                  • {error}
                </Typography>
              ))}
            </Alert>
          )}

          <Card sx={{ width: '100%' }}>
            <CardContent>{renderStepContent(activeStep)}</CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleComplete}>
                Complete Setup
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};
