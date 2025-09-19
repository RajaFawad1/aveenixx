import { useState, useRef, useEffect } from "react";
import { X, Search, Clock, TrendingUp, Filter, Mic, Camera, ScanLine, Zap, Trash2 } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : ['iPhone 15', 'Samsung Galaxy', 'MacBook Pro', 'AirPods Pro'];
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock trending searches
  const trendingSearches = [
    'iPhone 15 Pro Max',
    'Samsung Galaxy S24',
    'MacBook Pro M3',
    'AirPods Pro 2nd Gen',
    'Apple Watch Ultra',
    'Gaming Laptop',
    'Wireless Earbuds',
    'Smart TV 4K'
  ];

  // Mock search suggestions based on query
  const getSearchSuggestions = (query: string) => {
    const suggestions = [
      'iPhone 15 Pro Max 256GB',
      'iPhone 15 cases',
      'iPhone 15 accessories',
      'Samsung Galaxy S24 Ultra',
      'Samsung Galaxy earbuds',
      'MacBook Pro M3 16 inch',
      'MacBook Air M3',
      'AirPods Pro 2nd generation',
      'Apple Watch Series 9',
      'Gaming laptop RTX 4070'
    ];
    
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      // Perform search - would integrate with actual search functionality
      console.log('Searching for:', query);
      onClose();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const filteredTrending = trendingSearches.filter(item => 
    searchQuery ? item.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const filteredRecent = recentSearches.filter(item => 
    searchQuery ? item.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const searchSuggestions = searchQuery ? getSearchSuggestions(searchQuery) : [];

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Modal content that fills exact space between header and footer */}
      <div className="fixed top-16 left-0 right-0 bottom-16 flex flex-col bg-white dark:bg-gray-800 border-t-2 border-b-2 border-white dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="w-full pl-10 pr-24 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white dark:focus:bg-gray-600 border border-transparent focus:border-yellow-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {/* Advanced Search Action Buttons - Cleaner Layout */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-0.5">
                {/* Voice Search */}
                <button
                  onClick={() => setIsVoiceSearchActive(!isVoiceSearchActive)}
                  className={`p-1.5 rounded-md transition-all ${
                    isVoiceSearchActive 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                
                {/* Barcode Scanner */}
                <button
                  onClick={() => alert('Barcode scanner would open camera for product scanning')}
                  className="p-1.5 rounded-md bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 transition-colors"
                  title="Scan Barcode"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                </button>
                
                {/* Quick Actions */}
                <button
                  onClick={() => alert('Quick actions: Swipe gestures and shortcuts')}
                  className="p-1.5 rounded-md bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 transition-colors"
                  title="Quick Actions"
                >
                  <Zap className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filters (when expanded) */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-2">
              {['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'].map((category) => (
                <button
                  key={category}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-yellow-400 hover:text-white transition-colors border border-gray-200 dark:border-gray-600"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice Search Status */}
        {isVoiceSearchActive && (
          <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">🎤 Listening... Speak now</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 overflow-y-auto">
          {/* Search Suggestions (when typing) */}
          {searchQuery && searchSuggestions.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Search className="w-4 h-4 mr-2 text-gray-500" />
                Search Suggestions
              </h3>
              <div className="space-y-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {(!searchQuery || filteredRecent.length > 0) && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredRecent.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(search)}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-color hover:text-white transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Trending Searches */}
          {!searchQuery || filteredTrending.length > 0 ? (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                Trending Searches
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredTrending.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(search)}
                    className="text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}