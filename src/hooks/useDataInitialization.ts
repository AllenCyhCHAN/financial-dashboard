import { useEffect } from 'react';
import {
  useTransactionStore,
  useInvestmentStore,
  useAccountStore,
} from '../store';
import { LocalStorageService } from '../services/mockData';

export const useDataInitialization = () => {
  const { setTransactions } = useTransactionStore();
  const { setInvestments } = useInvestmentStore();
  const { setAccounts } = useAccountStore();

  useEffect(() => {
    // Load data from localStorage (will use your actual portfolio data as default)
    const transactions = LocalStorageService.getTransactions();
    const investments = LocalStorageService.getInvestments();
    const accounts = LocalStorageService.getAccounts();

    setTransactions(transactions);
    setInvestments(investments);
    setAccounts(accounts);
  }, [setTransactions, setInvestments, setAccounts]);
};
