import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, Filter, X, ArrowRight, Star, Mic, MicOff, Camera, QrCode, Brain, BarChart3, Sparkles, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UniversalSearchService, SearchResult, searchCategories } from '@/lib/universalSearch';
import { useLocation } from 'wouter';

interface UniversalSearchProps {
  className?: string;
  placeholder?: string;
}

export default function UniversalSearch({ 
  className = "w-full max-w-md", 
  placeholder = "Search products, orders, pages..."
}: UniversalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<any>(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [contextualRecommendations, setContextualRecommendations] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [searchFacets, setSearchFacets] = useState<any>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; right: number }>({ top: 0, left: 0, right: 0 });
  const [, navigate] = useLocation();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const searchService = UniversalSearchService.getInstance();

  useEffect(() => {
    // Load recent searches, popular searches, and analytics on component mount
    searchService.loadRecentSearches();
    setRecentSearches(searchService.getRecentSearches());
    setPopularSearches(searchService.getPopularSearches());
    setSearchAnalytics(searchService.getSearchAnalytics());
    
    // Refresh product data to ensure latest products are available
    searchService.refreshProductData();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        updateDropdownPosition();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    // Real-time search and autocomplete
    const searchTimeout = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);
        
        // Advanced search with filters and facets
        const searchResults = searchService.searchAdvanced(query, {
          categories: activeFilters.length > 0 ? activeFilters : undefined,
          ...advancedFilters
        }, { limit: 20, realTime: true });
        
        setResults(searchResults.results);
        setSearchFacets(searchResults.facets);
        setSuggestions(searchResults.suggestions);
        
        // Real-time autocomplete
        setAutocompleteSuggestions(searchService.getAutocomplete(query));
        
        // Enhanced AI contextual recommendations
        setContextualRecommendations(searchService.getContextualRecommendations(query, {
          recentSearches: searchService.getRecentSearches(),
          timeOfDay: getCurrentTimeOfDay(),
          location: 'Auckland' // In production, this would come from user location
        }));
        
        setAiSuggestions(searchService.getAISuggestions(query));
        setIsLoading(false);
      } else {
        setResults([]);
        setSuggestions(searchService.getPopularSearches());
        setAutocompleteSuggestions([]);
        setContextualRecommendations([]);
        setAiSuggestions([]);
        setSearchFacets(null);
      }
    }, 200); // 200ms debounce for real-time feel
    
    return () => clearTimeout(searchTimeout);
  }, [query, activeFilters, advancedFilters]);

  // Helper function to detect if query is a question
  const isQuestionLike = (text: string): boolean => {
    const questionWords = ['how', 'what', 'when', 'where', 'why', 'who', 'which', 'can', 'should', 'would', 'could', 'is', 'are', 'do', 'does', 'will'];
    const questionPunctuation = ['?'];
    const lowerText = text.toLowerCase().trim();
    
    // Check for question words at the start
    const startsWithQuestion = questionWords.some(word => lowerText.startsWith(word + ' '));
    
    // Check for question punctuation
    const hasQuestionMark = questionPunctuation.some(punct => text.includes(punct));
    
    // Check for help-seeking phrases
    const helpPhrases = ['help me', 'i need', 'problem with', 'issue with', 'trouble with', 'how to'];
    const hasHelpPhrase = helpPhrases.some(phrase => lowerText.includes(phrase));
    
    return startsWithQuestion || hasQuestionMark || hasHelpPhrase;
  };

  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px gap
        left: rect.left,
        right: rect.right
      });
    }
  };

  const handleInputFocus = () => {
    updateDropdownPosition();
    setIsOpen(true);
    if (!query.trim()) {
      setSuggestions(searchService.getRecentSearches());
    }
  };

  const handleResultClick = (result: SearchResult) => {
    searchService.trackSearchClick(query, result.id, results.indexOf(result));
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const toggleFilter = (filterType: string) => {
    setActiveFilters(prev => 
      prev.includes(filterType) 
        ? prev.filter(f => f !== filterType)
        : [...prev, filterType]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Advanced Feature Handlers
  const handleVoiceSearch = async () => {
    if (!navigator.mediaDevices) {
      alert('Voice search not supported in this browser');
      return;
    }

    try {
      if (isVoiceRecording) {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsVoiceRecording(false);
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const audioChunks: Blob[] = [];
        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const transcription = await searchService.processVoiceSearch(audioBlob);
          setQuery(transcription);
          stream.getTracks().forEach(track => track.stop());
        });
        
        mediaRecorder.start();
        setIsVoiceRecording(true);
      }
    } catch (error) {
      console.error('Voice search error:', error);
      alert('Unable to access microphone');
    }
  };

  const handleImageSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    try {
      const results = await searchService.processImageSearch(file);
      setResults(results);
      setQuery('Image search results');
      setIsOpen(true);
    } catch (error) {
      console.error('Image search error:', error);
    }
    setIsLoading(false);
  };

  const handleBarcodeSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    try {
      const results = await searchService.processBarcodeSearch(file);
      setResults(results);
      setQuery('Barcode search results');
      setIsOpen(true);
    } catch (error) {
      console.error('Barcode search error:', error);
    }
    setIsLoading(false);
  };

  const groupedResults = results.reduce((groups, result) => {
    const category = searchCategories.find(cat => 
      cat.id === result.type || 
      (result.type === 'faq' && cat.id === 'content') ||
      (result.type === 'vendor' && cat.id === 'vendors') ||
      (result.type === 'product' && cat.id === 'products') ||
      (result.type === 'order' && cat.id === 'orders') ||
      (result.type === 'page' && cat.id === 'pages')
    );
    
    const categoryName = category?.name || 'Other';
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Unified Search Bar Design */}
      <div className="relative w-full">
        {/* Single Unified Pill-Shaped Container */}
        <div 
          className="relative flex items-center shadow-lg transition-all duration-300 hover:shadow-xl w-full h-10 bg-white dark:bg-gray-800"
          style={{
            borderRadius: '20px', // Reduced pill shape to match circle
            border: `2px solid var(--primary-color)`,
            boxShadow: isOpen 
              ? `0 0 0 3px color-mix(in srgb, var(--primary-color) 25%, transparent), 0 10px 30px -5px rgba(0,0,0,0.15)` 
              : `0 6px 20px -5px color-mix(in srgb, var(--primary-color) 40%, rgba(0,0,0,0.2))`
          }}
        >
          {/* Left Content Area - White Background */}
          <div className="flex items-center flex-1 pl-4 h-full">
            {/* Input Field - Clean minimal design */}
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="flex-1 h-6 text-sm font-medium bg-transparent border-0 focus:ring-0 focus:border-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-700 dark:text-gray-200 px-0"
              style={{ 
                boxShadow: 'none',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Action Buttons Area - Still on white background */}
          <div className="flex items-center pr-8 mr-3 space-x-1 h-full">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center justify-center w-5 h-5">
                <div 
                  className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: 'var(--primary-color)', borderTopColor: 'transparent' }}
                ></div>
              </div>
            )}
            
            {/* Advanced Search Features */}
            <div className="flex items-center space-x-0.5">
              {/* Voice Search */}
              <button
                onClick={handleVoiceSearch}
                className={`p-1 rounded-full transition-all duration-200 ${
                  isVoiceRecording 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
                title={isVoiceRecording ? 'Stop recording' : 'Voice search'}
              >
                {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Barcode Scanner */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
                title="Scan barcode"
              >
                <QrCode className="w-4 h-4" />
              </button>

              {/* Advanced Options */}
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className={`p-1 rounded-full transition-colors ${
                  showAdvancedOptions
                    ? 'text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
                style={{
                  backgroundColor: showAdvancedOptions ? 'var(--primary-color)' : 'transparent'
                }}
                title="Advanced options"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Clear Button */}
              {query && (
                <button
                  onClick={clearQuery}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                </button>
              )}
            </div>
          </div>
          
          {/* Yellow Search Circle - Seamless Integration */}
          <div 
            className="absolute -right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all duration-200 hover:scale-95"
            style={{ 
              backgroundColor: 'var(--primary-color)',
              borderRadius: '50%'
            }}
          >
            <button 
              className="flex items-center justify-center w-full h-full transition-all duration-200"
              onClick={() => inputRef.current?.focus()}
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search Dropdown */}
      {isOpen && (
        <Card 
          className="fixed z-[999999] max-h-80 shadow-2xl border backdrop-blur-sm rounded-xl bg-white dark:bg-gray-900"
          style={{ 
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.right - dropdownPosition.left}px`,
            borderColor: 'color-mix(in srgb, var(--primary-color) 20%, color-mix(in srgb, currentColor 20%, transparent))',
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12), 0 0 0 1px color-mix(in srgb, var(--primary-color) 8%, transparent)'
          }}>
          {/* Close Button - Top Right */}
          <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
              title="Close search (Esc)"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Close</span>
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
            </button>
          </div>
          
          <CardContent className="p-0 max-h-80 overflow-y-auto custom-scrollbar">
            {/* Advanced Multi-Criteria Filtering */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced Filters</span>
                </div>
                {activeFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs h-6 px-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {searchCategories.map((category) => {
                  const isActive = activeFilters.includes(category.id);
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(category.id)}
                      className={`h-7 text-xs transition-all duration-200 ${
                        isActive 
                          ? 'text-white shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                      style={isActive ? { 
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)'
                      } : {
                        borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent)'
                      }}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
              
              {/* Results Analytics - Simplified */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>{results.length} results</span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" style={{ color: 'var(--primary-color)' }} />
                  <span>Real-time</span>
                </div>
              </div>
            </div>

            {/* Real-Time Autocomplete */}
            {query.trim() && autocompleteSuggestions.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Real-time Suggestions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {autocompleteSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(suggestion);
                        setIsOpen(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart AI Suggestions - Hybrid Section */}
            {(contextualRecommendations.length > 0 || aiSuggestions.length > 0) && query.trim() && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Smart Suggestions</span>
                </div>
                
                {/* Enhanced Search Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={`enhanced-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 border"
                        style={{
                          color: 'var(--primary-color)',
                          borderColor: 'color-mix(in srgb, var(--primary-color) 20%, transparent)',
                          backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary-color) 10%, transparent)';
                          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary-color) 40%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary-color) 5%, transparent)';
                          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary-color) 20%, transparent)';
                        }}
                      >
                        <Sparkles className="w-3 h-3 inline mr-2" style={{ color: 'var(--primary-color)' }} />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Related Topics */}
                {contextualRecommendations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {contextualRecommendations.slice(0, 4).map((recommendation, index) => (
                      <button
                        key={`context-${index}`}
                        onClick={() => {
                          setQuery(recommendation);
                          setIsOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-full text-xs border transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-white"
                        style={{
                          borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary-color) 30%, transparent)';
                        }}
                      >
                        {recommendation}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <div 
                  className="animate-spin w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"
                  style={{ borderTopColor: 'var(--primary-color)' }}
                ></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
              </div>
            )}

              {/* Advanced Options Panel */}
              {showAdvancedOptions && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced Search</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Image Search */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200"
                    >
                      <Camera className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                      <span>Image Search</span>
                    </button>
                    
                    {/* Barcode Search */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200"
                    >
                      <QrCode className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                      <span>Barcode Scan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Search Analytics */}
              {searchAnalytics && !query.trim() && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Trends</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchAnalytics.searchTrends.slice(0, 3).map((trend, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(trend.term)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-3 h-3" style={{ color: 'var(--primary-color)' }} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{trend.term}</span>
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          trend.change > 0 
                            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Suggestions - When no query */}
              {!query.trim() && !isLoading && (
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Suggestions</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      "Best deals on wireless headphones",
                      "Top rated running shoes for beginners", 
                      "Affordable gaming laptops under $1000",
                      "Smart home devices for energy saving",
                      "Premium skincare products for dry skin"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 border"
                        style={{
                          color: 'var(--primary-color)',
                          borderColor: 'color-mix(in srgb, var(--primary-color) 20%, transparent)',
                          backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary-color) 10%, transparent)';
                          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary-color) 40%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary-color) 5%, transparent)';
                          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary-color) 20%, transparent)';
                        }}
                      >
                        <Sparkles className="w-3 h-3 inline mr-2" style={{ color: 'var(--primary-color)' }} />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ask Jarvis AI Option - Appears for question-like queries */}
              {query.trim() && isQuestionLike(query) && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AI</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Ask Jarvis AI - Private</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Your question looks like something Jarvis AI can help with privately. Get instant, confidential assistance.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <div>✓ Completely private conversation</div>
                      <div>✓ Instant AI-powered responses</div>
                      <div>✓ Business intelligence & analysis</div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                      onClick={() => {
                        console.log('Dispatching openJarvisChat event with query:', query);
                        setIsOpen(false);
                        window.dispatchEvent(new CustomEvent('openJarvisChat', { 
                          detail: { question: query } 
                        }));
                      }}
                    >
                      Ask Jarvis: "{query.length > 30 ? query.substring(0, 30) + '...' : query}"
                    </Button>
                  </div>
                </div>
              )}



              {/* Search Results */}
              {query.trim() && !isLoading && (
                <>
                  {results.length > 0 ? (
                    <div className="p-2">
                      {Object.entries(groupedResults).map(([categoryName, categoryResults]) => (
                        <div key={categoryName} className="mb-4">
                          <div className="px-2 py-1 mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              {categoryName} ({categoryResults.length})
                            </h3>
                          </div>
                          <div className="space-y-1">
                            {categoryResults.map((result) => {
                              const IconComponent = result.icon;
                              return (
                                <button
                                  key={result.id}
                                  onClick={() => handleResultClick(result)}
                                  className="w-full text-left p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                      <IconComponent className="w-5 h-5 mt-0.5 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {result.title}
                                        </h4>
                                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {result.description}
                                      </p>
                                      
                                      {/* Metadata */}
                                      <div className="flex items-center space-x-3 mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {result.category}
                                        </Badge>
                                        
                                        {result.metadata?.price && (
                                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                            {result.metadata.price}
                                          </span>
                                        )}
                                        
                                        {result.metadata?.rating && (
                                          <div className="flex items-center space-x-1">
                                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                              {result.metadata.rating}
                                            </span>
                                          </div>
                                        )}
                                        
                                        {result.metadata?.status && (
                                          <Badge 
                                            variant={result.metadata.status === 'Delivered' ? 'default' : 'secondary'}
                                            className="text-xs"
                                          >
                                            {result.metadata.status}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">No results found for "{query}"</p>
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuery('')}
                          className="text-xs"
                        >
                          Clear search
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Quick Actions & Help */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-2.5 bg-gray-50/80 dark:bg-gray-800/80">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" style={{ color: 'var(--primary-color)' }} />
                      <span className="hidden sm:inline">Press Ctrl+K to focus</span>
                      <span className="sm:hidden">Ctrl+K</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <X className="w-3 h-3" />
                      <span className="hidden sm:inline">Press Esc to close</span>
                      <span className="sm:hidden">Esc</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{results.length}</span>
                    <span className="hidden sm:inline">results</span>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSearch}
      />
    </div>
  );
}