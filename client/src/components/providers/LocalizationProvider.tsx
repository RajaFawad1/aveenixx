import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface Language {
  code: string;
  name: string;
  flag?: string;
  nativeName?: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface LocalizationContextType {
  selectedCountry: Country;
  selectedLanguage: Language;
  selectedCurrency: Currency;
  setSelectedCountry: (country: Country) => void;
  setSelectedLanguage: (language: Language) => void;
  setSelectedCurrency: (currency: Currency) => void;
  countries: Country[];
  languages: Language[];
  currencies: Currency[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Data arrays
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' }
];

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  // Load user preferences when they login
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (isLoggedIn && user) {
        // Get user preferences from backend
        try {
          const response = await fetch('/api/user/preferences', {
            headers: {
              'user-id': user.id.toString()
            }
          });
          
          if (response.ok) {
            const preferences = await response.json();
            setSelectedCountry(preferences.country);
            setSelectedLanguage(preferences.language);
            setSelectedCurrency(preferences.currency);
          } else {
            // Auto-detect for new user
            await autoDetectPreferences();
          }
        } catch (error) {
          console.error('Error loading user preferences:', error);
          await autoDetectPreferences();
        }
      } else {
        // Guest user - use auto-detection
        await autoDetectPreferences();
      }
    };

    const autoDetectPreferences = async () => {
      try {
        // Auto-detect location from backend
        const response = await fetch('/api/user/auto-detect-location', {
          method: 'POST'
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedCountry(data.detected.country);
          setSelectedLanguage(data.detected.language);
          setSelectedCurrency(data.detected.currency);
        } else {
          // Fallback to browser language detection
          const browserLang = navigator.language.split('-')[0];
          const userLanguage = languages.find(l => l.code === browserLang) || languages[0];
          
          setSelectedCountry(countries[0]); // US
          setSelectedLanguage(userLanguage);
          setSelectedCurrency(currencies[0]); // USD
        }
      } catch (error) {
        console.error('Error auto-detecting preferences:', error);
        // Final fallback
        const browserLang = navigator.language.split('-')[0];
        const userLanguage = languages.find(l => l.code === browserLang) || languages[0];
        
        setSelectedCountry(countries[0]); // US
        setSelectedLanguage(userLanguage);
        setSelectedCurrency(currencies[0]); // USD
      }
    };

    loadUserPreferences();
  }, [isLoggedIn, user]);

  // Save preferences to backend when user makes changes
  const saveUserPreferences = async (preferences: any) => {
    if (isLoggedIn && user) {
      try {
        await fetch('/api/user/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'user-id': user.id.toString()
          },
          body: JSON.stringify(preferences)
        });
      } catch (error) {
        console.error('Error saving user preferences:', error);
      }
    }
  };

  // Enhanced selection functions that save to backend
  const selectCountry = async (country: Country) => {
    setSelectedCountry(country);
    await saveUserPreferences({ preferredCountry: country.code });
  };

  const selectLanguage = async (language: Language) => {
    setSelectedLanguage(language);
    await saveUserPreferences({ preferredLanguage: language.code });
  };

  const selectCurrency = async (currency: Currency) => {
    setSelectedCurrency(currency);
    await saveUserPreferences({ preferredCurrency: currency.code });
  };

  const value = {
    selectedCountry,
    selectedLanguage,
    selectedCurrency,
    setSelectedCountry: selectCountry,
    setSelectedLanguage: selectLanguage,
    setSelectedCurrency: selectCurrency,
    countries,
    languages,
    currencies
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};