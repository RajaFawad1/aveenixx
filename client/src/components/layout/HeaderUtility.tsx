import { useState, useEffect, useRef } from "react";
import { User, ChevronDown, Moon, Sun, Palette, Phone, Bell } from "lucide-react";
import { useAuth } from '../providers/AuthProvider';
import { useLocalization } from '../providers/LocalizationProvider';
import { useTheme } from '../providers/ThemeProvider';
import WeatherWidget from '../ui/WeatherWidget';
import { useLocation, Link } from 'wouter';
import LoginModal from '../auth/LoginModal';
import DesktopColorPicker from '../ui/DesktopColorPicker';
import { useQuery } from '@tanstack/react-query';



export default function HeaderUtility() {
  const { user, isLoggedIn } = useAuth();
  const { selectedCountry, selectedLanguage, selectedCurrency, setSelectedCountry, setSelectedLanguage, setSelectedCurrency, countries, languages, currencies } = useLocalization();
  const { theme, setTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const [notificationsCount, setNotificationsCount] = useState(0);


  
  // Separate effect for event listeners
  useEffect(() => {
    const updateFromStorage = () => {
      const savedNotifications = JSON.parse(localStorage.getItem('priceNotifications') || '[]');
      setNotificationsCount(savedNotifications.length);
    };
    
    // Listen for storage changes
    window.addEventListener('storage', updateFromStorage);
    window.addEventListener('notificationsUpdated', updateFromStorage);
    window.addEventListener('updateHeaderCounts', updateFromStorage);
    
    return () => {
      window.removeEventListener('storage', updateFromStorage);
      window.removeEventListener('notificationsUpdated', updateFromStorage);
      window.removeEventListener('updateHeaderCounts', updateFromStorage);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const selectCountry = async (country: any) => {
    await setSelectedCountry(country);
    setOpenDropdown(null);
  };

  const selectLanguage = async (language: any) => {
    await setSelectedLanguage(language);
    setOpenDropdown(null);
  };

  const selectCurrency = async (currency: any) => {
    await setSelectedCurrency(currency);
    setOpenDropdown(null);
  };

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-xs py-3 border-b border-gray-200 dark:border-gray-700 hidden md:block relative w-full">
      <div className="mx-auto flex justify-between items-center max-w-[1500px] px-4">
        <div className="flex space-x-3 text-gray-600 dark:text-gray-300">
          <div ref={dropdownRef} className="flex items-center space-x-2 relative">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('country')}
                className="flex items-center space-x-1 hover-color-text transition-colors text-xs"
              >
                <span className="text-xs">{selectedCountry.flag}</span>
                <span className="text-xs font-medium">{selectedCountry.code}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {openDropdown === 'country' && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-[99999] min-w-48">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => selectCountry(country)}
                      className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left text-xs"
                    >
                      <span className="text-xs">{country.flag}</span>
                      <span className="text-xs">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <span className="text-gray-400 mx-1">|</span>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('language')}
                className="flex items-center space-x-1 hover-color-text transition-colors text-xs"
              >
                <span className="text-xs font-medium">{selectedLanguage.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {openDropdown === 'language' && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-[99999] min-w-48">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => selectLanguage(language)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left text-xs"
                    >
                      <span className="text-xs">{language.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{language.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <span className="text-gray-400 mx-1">|</span>
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('currency')}
                className="flex items-center space-x-1 hover-color-text transition-colors text-xs"
              >
                <span className="text-xs font-medium">{selectedCurrency.symbol}</span>
                <span className="text-xs font-medium">{selectedCurrency.code}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {openDropdown === 'currency' && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-[99999] min-w-48">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => selectCurrency(currency)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left text-xs"
                    >
                      <span className="text-xs">{currency.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{currency.symbol} {currency.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center">
          <WeatherWidget />
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-xs font-normal">
          <button 
            onClick={() => isLoggedIn ? setLocation('/account') : setIsLoginOpen(true)}
            className="flex items-center hover-color-text transition-colors px-2 py-1"
            title={isLoggedIn ? 'Access Account Dashboard' : 'Login to Account'}
          >
            <User className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline text-xs">My Account</span>
          </button>
          
          <span className="text-gray-400 hidden sm:inline text-xs mx-1">|</span>
          <button 
            onClick={() => setLocation('/contact')}
            className="flex items-center hover-color-text transition-colors px-2 py-1"
            title="Contact Customer Support"
          >
            <Phone className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline text-xs">Contact</span>
          </button>
          
          <span className="text-gray-400 hidden sm:inline text-xs mx-1">|</span>
          <Link 
            href="/notifications"
            className="flex items-center hover-color-text transition-colors px-2 py-1 relative"
            title="Price Alerts"
          >
            <Bell className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline text-xs">Notifications</span>
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </Link>
          
          <span className="text-gray-400 hidden sm:inline text-xs mx-1">|</span>
          <DesktopColorPicker />
          <button 
            onClick={toggleDarkMode}
            className="flex items-center hover-color-text transition-colors px-2 py-1"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline text-xs">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
