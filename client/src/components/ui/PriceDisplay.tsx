import { useState, useEffect } from 'react';
import { useLocalization } from '../providers/LocalizationProvider';

interface PriceDisplayProps {
  price: number | string;
  originalPrice?: number | string;
  className?: string;
  showOriginalPrice?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function PriceDisplay({ 
  price, 
  originalPrice, 
  className = '', 
  showOriginalPrice = true,
  size = 'md'
}: PriceDisplayProps) {
  const { selectedCurrency } = useLocalization();
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const [formattedOriginalPrice, setFormattedOriginalPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simple currency formatting without async conversion for now
    const formatPrice = (value: number | string, currency: any) => {
      const priceNum = typeof value === 'string' ? parseFloat(value) : value;
      
      // Simple conversion rates (basic approximation)
      const rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        CAD: 1.35,
        JPY: 150,
        AUD: 1.50,
        CHF: 0.88,
        INR: 83
      };
      
      const rate = rates[currency.code as keyof typeof rates] || 1;
      const convertedPrice = priceNum * rate;
      
      // Format based on currency
      if (currency.code === 'JPY') {
        return `${currency.symbol}${Math.round(convertedPrice)}`;
      } else {
        return `${currency.symbol}${convertedPrice.toFixed(2)}`;
      }
    };

    try {
      const mainPrice = formatPrice(price, selectedCurrency);
      setFormattedPrice(mainPrice);

      if (originalPrice && showOriginalPrice) {
        const origPrice = formatPrice(originalPrice, selectedCurrency);
        setFormattedOriginalPrice(origPrice);
      }
    } catch (error) {
      console.warn('Price formatting failed:', error);
      // Ultimate fallback
      const priceNum = typeof price === 'string' ? parseFloat(price) : price;
      setFormattedPrice(`$${priceNum.toFixed(2)}`);
      
      if (originalPrice) {
        const origPriceNum = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
        setFormattedOriginalPrice(`$${origPriceNum.toFixed(2)}`);
      }
    }
  }, [price, originalPrice, selectedCurrency.code, selectedCurrency.symbol, showOriginalPrice]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <span className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded px-2 py-1">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <span className="font-semibold text-gray-900 dark:text-white">
        {formattedPrice}
      </span>
      {originalPrice && formattedOriginalPrice && showOriginalPrice && (
        <span className="ml-2 text-gray-500 dark:text-gray-400 line-through text-sm">
          {formattedOriginalPrice}
        </span>
      )}
    </div>
  );
}