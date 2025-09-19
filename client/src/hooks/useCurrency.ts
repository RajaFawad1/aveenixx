import { useState, useEffect } from 'react';
import { useLocalization } from '../components/providers/LocalizationProvider';
import { currencyService } from '../lib/currency-service';

export const useCurrency = () => {
  const { selectedCurrency } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);

  const convertAndFormat = async (usdPrice: number | string): Promise<string> => {
    setIsLoading(true);
    try {
      const price = typeof usdPrice === 'string' ? parseFloat(usdPrice) : usdPrice;
      
      if (isNaN(price)) {
        return currencyService.formatPrice(0, selectedCurrency);
      }

      const convertedPrice = await currencyService.convertPrice(price, 'USD', selectedCurrency.code);
      return currencyService.formatPrice(convertedPrice, selectedCurrency);
    } catch (error) {
      console.error('Currency conversion error:', error);
      return currencyService.formatPrice(typeof usdPrice === 'string' ? parseFloat(usdPrice) : usdPrice, selectedCurrency);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return currencyService.formatPrice(price, selectedCurrency);
  };

  return {
    selectedCurrency,
    convertAndFormat,
    formatPrice,
    isLoading
  };
};