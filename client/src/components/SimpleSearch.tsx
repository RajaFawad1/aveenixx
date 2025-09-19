import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLocalization } from '@/components/providers/LocalizationProvider';

interface Product {
  id: string;
  name: string;
  price?: number;
  image?: string;
}

interface SimpleSearchProps {
  className?: string;
  placeholder?: string;
}

export default function SimpleSearch({ 
  className = "w-full max-w-md", 
  placeholder = "Search products..."
}: SimpleSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [, navigate] = useLocation();
  const { selectedCurrency } = useLocalization();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch products from API
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate autocomplete suggestions from product names
  const generateAutocompleteSuggestions = (searchQuery: string, productList: Product[]) => {
    if (!searchQuery.trim() || !productList.length) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    productList.forEach((product: Product) => {
      const words = product.name.toLowerCase().split(' ');
      
      // Find words that start with the query
      words.forEach(word => {
        if (word.startsWith(query) && word.length > query.length) {
          // Complete the word
          suggestions.add(query + word.slice(query.length));
        }
      });
      
      // Find phrases that contain the query
      const name = product.name.toLowerCase();
      if (name.includes(query)) {
        // Extract meaningful phrases
        const startIndex = name.indexOf(query);
        const beforeQuery = name.substring(0, startIndex).trim();
        const afterQuery = name.substring(startIndex + query.length).trim();
        
        if (afterQuery) {
          const nextWords = afterQuery.split(' ').slice(0, 2).join(' ');
          if (nextWords) {
            suggestions.add(query + ' ' + nextWords);
          }
        }
      }
    });
    
    return Array.from(suggestions).slice(0, 3);
  };

  // Search suggestions with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() && products.length > 0) {
        // First filter products that match the query
        const filtered = products
          .filter((product: Product) => 
            product.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 4); // Limit to 4 product suggestions
        
        // Only generate autocomplete from products that actually match the search
        const autocomplete = generateAutocompleteSuggestions(query, filtered);
        
        setSuggestions(filtered);
        setAutocompleteSuggestions(autocomplete);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setAutocompleteSuggestions([]);
        setIsOpen(false);
      }
    }, 150); // Small debounce

    return () => clearTimeout(timeoutId);
  }, [query, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const selectSuggestion = (product: Product) => {
    navigate(`/products/${product.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const selectAutocompleteSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    // Don't close dropdown, let user see updated results
  };

  const formatPrice = (price?: number | string) => {
    if (!price) return '';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '';
    
    // Currency conversion rates (basic approximation like PriceDisplay)
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
    
    const rate = rates[selectedCurrency.code as keyof typeof rates] || 1;
    const convertedPrice = numPrice * rate;
    
    // Format based on currency
    if (selectedCurrency.code === 'JPY') {
      return `${selectedCurrency.symbol}${Math.round(convertedPrice)}`;
    } else {
      return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-10 pr-12 h-10 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Button */}
      <Button
        onClick={() => handleSearch()}
        className="ml-2 h-10 px-4 bg-orange-400 hover:bg-orange-500 text-white rounded-md"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Suggestions Dropdown */}
      {isOpen && (autocompleteSuggestions.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Autocomplete Suggestions */}
          {autocompleteSuggestions.map((suggestion, index) => (
            <div
              key={`autocomplete-${index}`}
              onClick={() => selectAutocompleteSuggestion(suggestion)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b flex items-center space-x-3"
            >
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{query}</span>
                  <span className="text-gray-500">{suggestion.slice(query.length)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Product Suggestions */}
          {suggestions.map((product) => (
            <div
              key={product.id}
              onClick={() => selectSuggestion(product)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center space-x-3"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </div>
                {product.price && (
                  <div className="text-sm text-orange-600 font-semibold">
                    {formatPrice(product.price)}
                  </div>
                )}
              </div>
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}