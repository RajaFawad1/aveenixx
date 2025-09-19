import { Router } from 'express';
import { z } from 'zod';
import { geolocationService } from './geolocation-service';
import { storage } from './storage';

const router = Router();

// Schema for user preference updates
const userPreferencesSchema = z.object({
  preferredCountry: z.string().optional(),
  preferredLanguage: z.string().optional(),
  preferredCurrency: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.string().optional(),
  colorTheme: z.string().optional(),
});

/**
 * Auto-detect user location and preferences
 */
router.post('/api/user/auto-detect-location', async (req, res) => {
  try {
    const locationData = await geolocationService.autoDetectUserLocation(req);
    
    const response = {
      detected: {
        country: geolocationService.getCountryMapping(locationData.countryCode),
        language: geolocationService.getLanguageMapping(locationData.languageCode),
        currency: geolocationService.getCurrencyMapping(locationData.currencyCode, locationData.currencySymbol),
        timezone: locationData.timezone,
        location: {
          city: locationData.city,
          state: locationData.state,
          country: locationData.countryName
        }
      },
      suggestions: {
        message: `We detected you're in ${locationData.city}, ${locationData.state}, ${locationData.countryName}. Would you like to use these settings?`,
        recommendedSettings: {
          country: locationData.countryCode,
          language: locationData.languageCode,
          currency: locationData.currencyCode
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error auto-detecting location:', error);
    res.status(500).json({ 
      error: 'Failed to auto-detect location',
      fallback: {
        country: { code: 'US', name: 'United States', flag: '🇺🇸' },
        language: { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
        currency: { code: 'USD', name: 'US Dollar', symbol: '$' }
      }
    });
  }
});

/**
 * Get user preferences (for logged-in users)
 */
router.get('/api/user/preferences', async (req, res) => {
  try {
    // Mock authentication check - replace with actual auth middleware
    const userId = req.headers['user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await storage.getUser(parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = {
      country: geolocationService.getCountryMapping(user.preferredCountry || 'US'),
      language: geolocationService.getLanguageMapping(user.preferredLanguage || 'en'),
      currency: geolocationService.getCurrencyMapping(user.preferredCurrency || 'USD', '$'),
      timezone: user.timezone || 'America/New_York',
      theme: user.theme || 'light',
      colorTheme: user.colorTheme || 'yellow'
    };

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

/**
 * Update user preferences
 */
router.put('/api/user/preferences', async (req, res) => {
  try {
    // Mock authentication check - replace with actual auth middleware
    const userId = req.headers['user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const validatedData = userPreferencesSchema.parse(req.body);
    
    const updatedUser = await storage.updateUserPreferences(parseInt(userId), validatedData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = {
      country: geolocationService.getCountryMapping(updatedUser.preferredCountry || 'US'),
      language: geolocationService.getLanguageMapping(updatedUser.preferredLanguage || 'en'),
      currency: geolocationService.getCurrencyMapping(updatedUser.preferredCurrency || 'USD', '$'),
      timezone: updatedUser.timezone || 'America/New_York'
    };

    res.json({
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

/**
 * Auto-set preferences for logged-in user based on detection
 */
router.post('/api/user/auto-set-preferences', async (req, res) => {
  try {
    // Mock authentication check - replace with actual auth middleware
    const userId = req.headers['user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const locationData = await geolocationService.autoDetectUserLocation(req);
    
    const preferences = {
      preferredCountry: locationData.countryCode,
      preferredLanguage: locationData.languageCode,
      preferredCurrency: locationData.currencyCode,
      timezone: locationData.timezone
    };

    const updatedUser = await storage.updateUserPreferences(parseInt(userId), preferences);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      message: 'Preferences automatically set based on your location',
      preferences: {
        country: geolocationService.getCountryMapping(locationData.countryCode),
        language: geolocationService.getLanguageMapping(locationData.languageCode),
        currency: geolocationService.getCurrencyMapping(locationData.currencyCode, locationData.currencySymbol),
        timezone: locationData.timezone
      },
      detectedLocation: {
        city: locationData.city,
        state: locationData.state,
        country: locationData.countryName
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error auto-setting preferences:', error);
    res.status(500).json({ error: 'Failed to auto-set preferences' });
  }
});

/**
 * Auto-detect user location (no authentication required - for guest users)
 */
router.post('/api/user/auto-detect-location', async (req, res) => {
  try {
    const locationData = await geolocationService.autoDetectUserLocation(req);
    
    const response = {
      detected: {
        country: geolocationService.getCountryMapping(locationData.countryCode),
        language: geolocationService.getLanguageMapping(locationData.languageCode),
        currency: geolocationService.getCurrencyMapping(locationData.currencyCode, locationData.currencySymbol),
        timezone: locationData.timezone
      },
      location: {
        city: locationData.city,
        state: locationData.state,
        country: locationData.countryName
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error auto-detecting location:', error);
    res.status(500).json({ error: 'Failed to auto-detect location' });
  }
});

export default router;