import { Request } from 'express';

interface GeolocationResponse {
  country_code2: string;
  country_name: string;
  city: string;
  state_prov: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  languages: string;
  calling_code: string;
  time_zone: {
    name: string;
    offset: number;
  };
}

interface UserLocationData {
  countryCode: string;
  countryName: string;
  city: string;
  state: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  languageCode: string;
  timezone: string;
}

export class GeolocationService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.IPGEOLOCATION_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('IPGEOLOCATION_API_KEY environment variable is required');
    }
  }

  /**
   * Get user's IP address from request
   */
  private getUserIP(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const remoteAddr = req.connection.remoteAddress;
    const xRealIP = req.headers['x-real-ip'];

    if (xForwardedFor) {
      return Array.isArray(xForwardedFor) 
        ? xForwardedFor[0].split(',')[0].trim()
        : xForwardedFor.split(',')[0].trim();
    }

    if (xRealIP) {
      return Array.isArray(xRealIP) ? xRealIP[0] : xRealIP;
    }

    return remoteAddr || '127.0.0.1';
  }

  /**
   * Auto-detect user location and preferences based on IP
   */
  async autoDetectUserLocation(req: Request): Promise<UserLocationData> {
    try {
      const userIP = this.getUserIP(req);
      
      // Skip detection for localhost/development
      if (userIP === '127.0.0.1' || userIP === '::1' || userIP.startsWith('192.168.')) {
        return this.getDefaultLocation();
      }

      const response = await fetch(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}&ip=${userIP}&fields=country_code2,country_name,city,state_prov,currency,languages,calling_code,time_zone`
      );

      if (!response.ok) {
        console.warn('Geolocation API error:', response.status);
        return this.getDefaultLocation();
      }

      const data: GeolocationResponse = await response.json();
      
      return {
        countryCode: data.country_code2,
        countryName: data.country_name,
        city: data.city,
        state: data.state_prov,
        currencyCode: data.currency.code,
        currencyName: data.currency.name,
        currencySymbol: data.currency.symbol,
        languageCode: this.extractPrimaryLanguage(data.languages),
        timezone: data.time_zone.name
      };
    } catch (error) {
      console.error('Error detecting user location:', error);
      return this.getDefaultLocation();
    }
  }

  /**
   * Extract primary language from languages string
   */
  private extractPrimaryLanguage(languages: string): string {
    if (!languages) return 'en';
    
    // Languages come as "en,es,fr" format
    const primaryLang = languages.split(',')[0].trim().toLowerCase();
    
    // Map common language codes
    const languageMap: { [key: string]: string } = {
      'en': 'en',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'ja': 'ja',
      'zh': 'zh',
      'pt': 'pt',
      'it': 'it',
      'ru': 'ru',
      'ko': 'ko',
      'ar': 'ar',
      'hi': 'hi'
    };

    return languageMap[primaryLang] || 'en';
  }

  /**
   * Get default location for development/localhost
   */
  private getDefaultLocation(): UserLocationData {
    return {
      countryCode: 'US',
      countryName: 'United States',
      city: 'New York',
      state: 'New York',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      languageCode: 'en',
      timezone: 'America/New_York'
    };
  }

  /**
   * Get country suggestions based on detected location
   */
  getCountryMapping(countryCode: string): { code: string; name: string; flag: string } {
    const countryMap: { [key: string]: { code: string; name: string; flag: string } } = {
      'US': { code: 'US', name: 'United States', flag: '🇺🇸' },
      'CA': { code: 'CA', name: 'Canada', flag: '🇨🇦' },
      'GB': { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      'DE': { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      'FR': { code: 'FR', name: 'France', flag: '🇫🇷' },
      'JP': { code: 'JP', name: 'Japan', flag: '🇯🇵' },
      'AU': { code: 'AU', name: 'Australia', flag: '🇦🇺' },
      'IN': { code: 'IN', name: 'India', flag: '🇮🇳' },
      'ES': { code: 'ES', name: 'Spain', flag: '🇪🇸' },
      'IT': { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      'BR': { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
      'MX': { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
      'CN': { code: 'CN', name: 'China', flag: '🇨🇳' },
      'KR': { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
      'RU': { code: 'RU', name: 'Russia', flag: '🇷🇺' }
    };

    return countryMap[countryCode] || countryMap['US'];
  }

  /**
   * Get currency mapping based on detected currency
   */
  getCurrencyMapping(currencyCode: string, currencySymbol: string): { code: string; name: string; symbol: string } {
    const currencyMap: { [key: string]: { code: string; name: string; symbol: string } } = {
      'USD': { code: 'USD', name: 'US Dollar', symbol: '$' },
      'EUR': { code: 'EUR', name: 'Euro', symbol: '€' },
      'GBP': { code: 'GBP', name: 'British Pound', symbol: '£' },
      'CAD': { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
      'JPY': { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      'AUD': { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      'CHF': { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
      'INR': { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      'BRL': { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
      'MXN': { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
      'CNY': { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      'KRW': { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
      'RUB': { code: 'RUB', name: 'Russian Ruble', symbol: '₽' }
    };

    return currencyMap[currencyCode] || { code: currencyCode, name: currencyCode, symbol: currencySymbol };
  }

  /**
   * Get language mapping based on detected language
   */
  getLanguageMapping(languageCode: string): { code: string; name: string; flag: string; nativeName: string } {
    const languageMap: { [key: string]: { code: string; name: string; flag: string; nativeName: string } } = {
      'en': { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
      'es': { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
      'fr': { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
      'de': { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
      'ja': { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
      'zh': { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
      'pt': { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
      'it': { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
      'ru': { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
      'ko': { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
      'ar': { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
      'hi': { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' }
    };

    return languageMap[languageCode] || languageMap['en'];
  }
}

export const geolocationService = new GeolocationService();