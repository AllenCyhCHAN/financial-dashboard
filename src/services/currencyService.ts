import { Currency } from '../types/index.js';
import type { CurrencyRate, CurrencyConversion } from '../types/index.js';

// Mock exchange rates (in a real app, you'd fetch these from an API)
const MOCK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    HKD: 7.8,
  },
  HKD: {
    USD: 0.128,
  },
};

export class CurrencyService {
  private static instance: CurrencyService;
  private rates: Map<string, CurrencyRate> = new Map();

  private constructor() {
    this.initializeRates();
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private initializeRates(): void {
    // Initialize with mock rates
    Object.entries(MOCK_EXCHANGE_RATES).forEach(([from, toRates]) => {
      Object.entries(toRates).forEach(([to, rate]) => {
        const key = `${from}-${to}`;
        this.rates.set(key, {
          from: from as Currency,
          to: to as Currency,
          rate,
          timestamp: Date.now(),
        });
      });
    });
  }

  public async getExchangeRate(from: Currency, to: Currency): Promise<number> {
    if (from === to) return 1;

    // Check if we have a direct rate
    const directKey = `${from}-${to}`;
    if (this.rates.has(directKey)) {
      return this.rates.get(directKey)!.rate;
    }

    // Check if we have a reverse rate
    const reverseKey = `${to}-${from}`;
    if (this.rates.has(reverseKey)) {
      return 1 / this.rates.get(reverseKey)!.rate;
    }

    // Try USD as intermediate currency
    const usdFromKey = `USD-${from}`;
    const usdToKey = `USD-${to}`;

    if (this.rates.has(usdFromKey) && this.rates.has(usdToKey)) {
      const fromUsdRate = this.rates.get(usdFromKey)!.rate;
      const toUsdRate = this.rates.get(usdToKey)!.rate;
      return toUsdRate / fromUsdRate;
    }

    // Fallback to 1 if no rate found
    console.warn(`No exchange rate found for ${from} to ${to}`);
    return 1;
  }

  public async convertCurrency(
    amount: number,
    from: Currency,
    to: Currency
  ): Promise<CurrencyConversion> {
    const rate = await this.getExchangeRate(from, to);
    const convertedAmount = amount * rate;

    return {
      amount,
      fromCurrency: from,
      toCurrency: to,
      convertedAmount,
      rate,
      timestamp: Date.now(),
    };
  }

  public formatCurrency(amount: number, currency: Currency): string {
    const formatters: Record<Currency, Intl.NumberFormat> = {
      [Currency.USD]: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      [Currency.HKD]: new Intl.NumberFormat('en-HK', {
        style: 'currency',
        currency: 'HKD',
      }),
    };

    const formatter = formatters[currency];
    if (formatter) {
      return formatter.format(amount);
    }

    // Fallback formatting
    return `${currency} ${amount.toFixed(2)}`;
  }

  public getSupportedCurrencies(): Currency[] {
    return Object.values(Currency);
  }

  public getCurrencySymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
      [Currency.USD]: '$',
      [Currency.HKD]: 'HK$',
    };

    return symbols[currency] || currency;
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance();
