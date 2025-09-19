interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

class CurrencyService {
  private rates: ExchangeRates = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    CAD: 1.35,
    JPY: 150.0,
    AUD: 1.50,
    CHF: 0.88,
    INR: 83.0
  };

  private lastUpdate: number = 0;
  private updateInterval = 1000 * 60 * 60; // 1 hour

  async getExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now();
    
    // Update rates every hour from a free API
    if (now - this.lastUpdate > this.updateInterval) {
      try {
        // Using a free exchange rate API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (response.ok) {
          const data = await response.json();
          this.rates = data.rates;
          this.lastUpdate = now;
        }
      } catch (error) {
        console.warn('Failed to update exchange rates, using cached rates');
      }
    }
    
    return this.rates;
  }

  async convertPrice(amount: number, fromCurrency: string = 'USD', toCurrency: string): Promise<number> {
    const rates = await this.getExchangeRates();
    
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    // Convert to USD first if needed
    let usdAmount = amount;
    if (fromCurrency !== 'USD') {
      usdAmount = amount / (rates[fromCurrency] || 1);
    }
    
    // Convert from USD to target currency
    const rate = rates[toCurrency] || 1;
    return usdAmount * rate;
  }

  formatPrice(amount: number, currency: { code: string; symbol: string; name: string }): string {
    const currencyFormatting: { [key: string]: Intl.NumberFormatOptions } = {
      USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      EUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
      GBP: { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 },
      CAD: { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 },
      JPY: { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 },
      AUD: { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 },
      CHF: { style: 'currency', currency: 'CHF', minimumFractionDigits: 2 },
      INR: { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }
    };

    const formatOptions = currencyFormatting[currency.code] || {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    try {
      if (formatOptions.style === 'currency') {
        return new Intl.NumberFormat('en-US', formatOptions).format(amount);
      } else {
        // Fallback for currencies without Intl support
        return `${currency.symbol}${amount.toFixed(2)}`;
      }
    } catch (error) {
      // Final fallback
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  }
}

export const currencyService = new CurrencyService();