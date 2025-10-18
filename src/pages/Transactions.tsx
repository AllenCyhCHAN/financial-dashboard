import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTransactionStore } from '../store';
import { LocalStorageService } from '../services/mockData';
import { formatCurrency, formatDate, getCategoryLabel } from '../utils';
import type { Transaction } from '../types/index.js';
import {
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  Currency,
} from '../types/index.js';

export const Transactions: React.FC = () => {
  const {
    transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactionStore();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    const storedTransactions = LocalStorageService.getTransactions();
    setTransactions(storedTransactions);
    setLoading(false);
  }, [setTransactions]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setOpenDialog(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setOpenDialog(true);
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    LocalStorageService.saveTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSaveTransaction = (transactionData: Partial<Transaction>) => {
    if (editingTransaction) {
      const updatedTransaction = { ...editingTransaction, ...transactionData };
      updateTransaction(editingTransaction.id, transactionData);
      const updatedTransactions = transactions.map(t =>
        t.id === editingTransaction.id ? updatedTransaction : t
      );
      LocalStorageService.saveTransactions(updatedTransactions);
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: transactionData.type as TransactionType,
        amount: transactionData.amount || 0,
        currency: transactionData.currency || Currency.USD,
        description: transactionData.description || '',
        category: transactionData.category as any,
        date: transactionData.date || new Date(),
        account: transactionData.account || 'checking',
        ...transactionData,
      };
      addTransaction(newTransaction);
      LocalStorageService.saveTransactions([newTransaction, ...transactions]);
    }
    setOpenDialog(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesCategory =
      !filters.category || transaction.category === filters.category;
    const matchesSearch =
      !filters.search ||
      transaction.description
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return 'success';
      case TransactionType.EXPENSE:
        return 'error';
      case TransactionType.INVESTMENT:
        return 'info';
      case TransactionType.TRANSFER:
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
        <Typography>Loading transactions...</Typography>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Transactions</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={e =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                    <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
                    <MenuItem value={TransactionType.INVESTMENT}>
                      Investment
                    </MenuItem>
                    <MenuItem value={TransactionType.TRANSFER}>
                      Transfer
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search"
                  value={filters.search}
                  onChange={e =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() =>
                    setFilters({ type: '', category: '', search: '' })
                  }
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <TableContainer
          component={Paper}
          sx={{ width: '100%', minWidth: 1200 }}
        >
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type}
                      color={getTransactionTypeColor(transaction.type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getCategoryLabel(transaction.category)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={
                        transaction.type === TransactionType.INCOME ||
                        transaction.type === TransactionType.INVESTMENT
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      {transaction.type === TransactionType.EXPENSE ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Transaction Dialog */}
        <TransactionDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveTransaction}
          transaction={editingTransaction}
        />
      </Container>
    </LocalizationProvider>
  );
};

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction | null;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  onSave,
  transaction,
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: TransactionType.EXPENSE,
    amount: 0,
    currency: Currency.USD,
    description: '',
    category: ExpenseCategory.OTHER,
    date: new Date(),
    account: 'checking',
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    } else {
      setFormData({
        type: TransactionType.EXPENSE,
        amount: 0,
        currency: Currency.USD,
        description: '',
        category: ExpenseCategory.OTHER,
        date: new Date(),
        account: 'checking',
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getCategoryOptions = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EXPENSE:
        return Object.values(ExpenseCategory);
      case TransactionType.INCOME:
        return Object.values(IncomeCategory);
      default:
        return [ExpenseCategory.OTHER];
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {transaction ? 'Edit Transaction' : 'Add Transaction'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      type: e.target.value as TransactionType,
                    })
                  }
                >
                  <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                  <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
                  <MenuItem value={TransactionType.INVESTMENT}>
                    Investment
                  </MenuItem>
                  <MenuItem value={TransactionType.TRANSFER}>Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={e =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency || Currency.USD}
                  label="Currency"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      currency: e.target.value as Currency,
                    })
                  }
                >
                  <MenuItem value={Currency.USD}>USD</MenuItem>
                  <MenuItem value={Currency.HKD}>HKD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                >
                  {getCategoryOptions(
                    formData.type || TransactionType.EXPENSE
                  ).map(category => (
                    <MenuItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={date =>
                  setFormData({ ...formData, date: date || new Date() })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account</InputLabel>
                <Select
                  value={formData.account}
                  label="Account"
                  onChange={e =>
                    setFormData({ ...formData, account: e.target.value })
                  }
                >
                  <MenuItem value="checking">Checking</MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                  <MenuItem value="debit">Debit Card</MenuItem>
                  <MenuItem value="credit">Credit Card</MenuItem>
                  <MenuItem value="investment">Investment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {transaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
