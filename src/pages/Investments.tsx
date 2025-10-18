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
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useInvestmentStore } from '../store';
import { LocalStorageService } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils';
import type { Investment } from '../types/index.js';
import { InvestmentType, Currency } from '../types/index.js';

export const Investments: React.FC = () => {
  const {
    investments,
    setInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  } = useInvestmentStore();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );

  useEffect(() => {
    const storedInvestments = LocalStorageService.getInvestments();
    setInvestments(storedInvestments);
    setLoading(false);
  }, [setInvestments]);

  const handleAddInvestment = () => {
    setEditingInvestment(null);
    setOpenDialog(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setOpenDialog(true);
  };

  const handleDeleteInvestment = (id: string) => {
    deleteInvestment(id);
    LocalStorageService.saveInvestments(investments.filter(i => i.id !== id));
  };

  const handleSaveInvestment = (investmentData: Partial<Investment>) => {
    if (editingInvestment) {
      const updatedInvestment = { ...editingInvestment, ...investmentData };
      updateInvestment(editingInvestment.id, investmentData);
      const updatedInvestments = investments.map(i =>
        i.id === editingInvestment.id ? updatedInvestment : i
      );
      LocalStorageService.saveInvestments(updatedInvestments);
    } else {
      const newInvestment: Investment = {
        id: Date.now().toString(),
        name: investmentData.name || '',
        type: investmentData.type || InvestmentType.STOCKS,
        symbol: investmentData.symbol || '',
        quantity: investmentData.quantity || 0,
        purchasePrice: investmentData.purchasePrice || 0,
        currentPrice: investmentData.currentPrice || 0,
        purchaseDate: investmentData.purchaseDate || new Date(),
        description: investmentData.description || '',
        ...investmentData,
      };
      addInvestment(newInvestment);
      LocalStorageService.saveInvestments([newInvestment, ...investments]);
    }
    setOpenDialog(false);
  };

  const calculateTotalValue = () => {
    return investments.reduce((total, investment) => {
      return total + investment.quantity * investment.currentPrice;
    }, 0);
  };

  const calculateTotalCost = () => {
    return investments.reduce((total, investment) => {
      return total + investment.quantity * investment.purchasePrice;
    }, 0);
  };

  const calculateTotalGainLoss = () => {
    return calculateTotalValue() - calculateTotalCost();
  };

  const getInvestmentTypeColor = (type: InvestmentType) => {
    switch (type) {
      case InvestmentType.STOCKS:
        return 'primary';
      case InvestmentType.BONDS:
        return 'success';
      case InvestmentType.CRYPTO:
        return 'warning';
      case InvestmentType.REAL_ESTATE:
        return 'info';
      case InvestmentType.MUTUAL_FUNDS:
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
        <Typography>Loading investments...</Typography>
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
          <Typography variant="h4">Investments</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddInvestment}
          >
            Add Investment
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(calculateTotalValue())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Cost
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(calculateTotalCost())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Gain/Loss
                </Typography>
                <Typography
                  variant="h5"
                  color={
                    calculateTotalGainLoss() >= 0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  {calculateTotalGainLoss() >= 0 ? '+' : ''}
                  {formatCurrency(calculateTotalGainLoss())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Investments Table */}
        <TableContainer
          component={Paper}
          sx={{ width: '100%', minWidth: 1200 }}
        >
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Purchase Price</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Gain/Loss</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.map(investment => {
                const gainLoss =
                  (investment.currentPrice - investment.purchasePrice) *
                  investment.quantity;
                const gainLossPercentage =
                  ((investment.currentPrice - investment.purchasePrice) /
                    investment.purchasePrice) *
                  100;

                return (
                  <TableRow key={investment.id}>
                    <TableCell>{investment.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={investment.type}
                        color={getInvestmentTypeColor(investment.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{investment.symbol}</TableCell>
                    <TableCell>{investment.quantity}</TableCell>
                    <TableCell>
                      {formatCurrency(investment.purchasePrice)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(investment.currentPrice)}
                    </TableCell>
                    <TableCell>{formatDate(investment.purchaseDate)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {gainLoss >= 0 ? (
                          <TrendingUp color="success" />
                        ) : (
                          <TrendingDown color="error" />
                        )}
                        <Typography
                          color={gainLoss >= 0 ? 'success.main' : 'error.main'}
                          sx={{ ml: 1 }}
                        >
                          {gainLoss >= 0 ? '+' : ''}
                          {formatCurrency(gainLoss)}(
                          {gainLossPercentage >= 0 ? '+' : ''}
                          {gainLossPercentage.toFixed(2)}%)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditInvestment(investment)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteInvestment(investment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Investment Dialog */}
        <InvestmentDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveInvestment}
          investment={editingInvestment}
        />
      </Container>
    </LocalizationProvider>
  );
};

interface InvestmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (investment: Partial<Investment>) => void;
  investment?: Investment | null;
}

const InvestmentDialog: React.FC<InvestmentDialogProps> = ({
  open,
  onClose,
  onSave,
  investment,
}) => {
  const [formData, setFormData] = useState<Partial<Investment>>({
    name: '',
    type: InvestmentType.STOCKS,
    symbol: '',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    purchaseDate: new Date(),
    description: '',
  });

  useEffect(() => {
    if (investment) {
      setFormData(investment);
    } else {
      setFormData({
        name: '',
        type: InvestmentType.STOCKS,
        symbol: '',
        quantity: 0,
        purchasePrice: 0,
        currentPrice: 0,
        purchaseDate: new Date(),
        description: '',
      });
    }
  }, [investment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {investment ? 'Edit Investment' : 'Add Investment'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      type: e.target.value as InvestmentType,
                    })
                  }
                >
                  <MenuItem value={InvestmentType.STOCKS}>Stocks</MenuItem>
                  <MenuItem value={InvestmentType.BONDS}>Bonds</MenuItem>
                  <MenuItem value={InvestmentType.CRYPTO}>Crypto</MenuItem>
                  <MenuItem value={InvestmentType.REAL_ESTATE}>
                    Real Estate
                  </MenuItem>
                  <MenuItem value={InvestmentType.MUTUAL_FUNDS}>
                    Mutual Funds
                  </MenuItem>
                  <MenuItem value={InvestmentType.OTHER}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                value={formData.symbol}
                onChange={e =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={e =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(e.target.value),
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                value={formData.purchasePrice}
                onChange={e =>
                  setFormData({
                    ...formData,
                    purchasePrice: parseFloat(e.target.value),
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Price"
                type="number"
                value={formData.currentPrice}
                onChange={e =>
                  setFormData({
                    ...formData,
                    currentPrice: parseFloat(e.target.value),
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
              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={date =>
                  setFormData({ ...formData, purchaseDate: date || new Date() })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {investment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
