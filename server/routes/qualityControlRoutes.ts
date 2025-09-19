import { Router } from 'express';
import { db } from '../db';
import { qualityControlSettings, type InsertQualityControlSettings } from '@shared/schema';
import { eq, isNull } from 'drizzle-orm';
import { QualityControlOrchestrator } from '../services/qualityControl/qualityControlOrchestrator';

const router = Router();
const qualityControl = new QualityControlOrchestrator();

// Default quality control settings
const DEFAULT_SETTINGS = {
  enableValidation: true,
  requireTitle: true,
  requireDescription: true,
  requireImages: true,
  requirePrice: true,
  minDescriptionLength: 50,
  minPriceValue: 0.01,
  maxPriceValue: 50000,
  
  enableContentFiltering: true,
  blockedKeywords: [
    'adult', 'xxx', 'weapon', 'drug', 'cannabis', 'get rich quick', 
    'make money fast', 'limited time only', 'cure cancer', 'lose weight fast'
  ],
  blockedBrands: ['supreme', 'gucci', 'louis vuitton', 'chanel', 'nike', 'apple'],
  allowedBrands: [],
  strictMode: false,
  
  enableDuplicateDetection: true,
  titleSimilarityThreshold: 85,
  imageSimilarityLevel: 'medium',
  priceDifferenceTolerance: 10,
  autoActionForDuplicates: 'flag',
  
  enablePerformanceTracking: true,
  minimumQualityScore: 60,
  historicalPerformanceWeight: 30
};

/**
 * GET /api/quality-control/settings - Get current quality control settings
 */
router.get('/settings', async (req, res) => {
  try {
    // Get all global settings (categoryId is null)
    const settings = await db
      .select()
      .from(qualityControlSettings)
      .where(isNull(qualityControlSettings.categoryId));

    // Convert database settings to frontend format
    const formattedSettings = { ...DEFAULT_SETTINGS };
    
    settings.forEach(setting => {
      const key = setting.settingKey as keyof typeof DEFAULT_SETTINGS;
      let value: any = setting.settingValue;
      
      // Parse JSON values
      try {
        value = JSON.parse(setting.settingValue);
      } catch {
        // If not JSON, use as string or convert based on type
        if (key.includes('enable') || key.includes('require') || key === 'strictMode') {
          value = setting.settingValue === 'true';
        } else if (key.includes('Threshold') || key.includes('Length') || key.includes('Value') || key.includes('Weight') || key.includes('Score')) {
          value = parseFloat(setting.settingValue);
        }
      }
      
      formattedSettings[key] = value;
    });

    res.json(formattedSettings);
  } catch (error) {
    console.error('Error fetching quality control settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * POST /api/quality-control/settings - Save quality control settings
 */
router.post('/settings', async (req, res) => {
  try {
    const newSettings = req.body;

    // Save each setting to database
    for (const [key, value] of Object.entries(newSettings)) {
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      const settingData: InsertQualityControlSettings = {
        settingKey: key,
        settingValue,
        categoryId: null, // Global setting
        isActive: true
      };

      // Upsert setting - first try to update, then insert if not exists
      const existingSetting = await db
        .select()
        .from(qualityControlSettings)
        .where(eq(qualityControlSettings.settingKey, key))
        .limit(1);

      if (existingSetting.length > 0) {
        await db
          .update(qualityControlSettings)
          .set({
            settingValue: settingData.settingValue,
            updatedAt: new Date()
          })
          .where(eq(qualityControlSettings.settingKey, key));
      } else {
        await db.insert(qualityControlSettings).values(settingData);
      }
    }

    console.log('✓ Quality control settings saved successfully');
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving quality control settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

/**
 * POST /api/quality-control/settings/reset - Reset settings to defaults
 */
router.post('/settings/reset', async (req, res) => {
  try {
    // Delete all existing settings
    await db.delete(qualityControlSettings).where(isNull(qualityControlSettings.categoryId));

    // Insert default settings
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      await db.insert(qualityControlSettings).values({
        settingKey: key,
        settingValue,
        categoryId: null,
        isActive: true
      });
    }

    console.log('✓ Quality control settings reset to defaults');
    res.json({ success: true, message: 'Settings reset to defaults' });
  } catch (error) {
    console.error('Error resetting quality control settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

/**
 * GET /api/quality-control/dashboard - Get quality control dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await qualityControl.getQualityDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching quality dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

/**
 * POST /api/quality-control/test-product - Test quality control on a sample product
 */
router.post('/test-product', async (req, res) => {
  try {
    const testProduct = req.body;
    const result = await qualityControl.processProduct(testProduct);
    
    res.json({
      success: true,
      result: {
        shouldReject: result.shouldReject,
        rejectionReason: result.rejectionReason,
        qualityScore: result.qualityScore,
        overallAssessment: result.overallAssessment,
        details: {
          validationScore: result.validationResult.score,
          validationIssues: result.validationResult.issues,
          contentScore: result.contentFilterResult.score,
          contentFlags: result.contentFilterResult.flags,
          duplicateRisk: result.duplicateRisk
        }
      }
    });
  } catch (error) {
    console.error('Error testing product quality:', error);
    res.status(500).json({ error: 'Failed to test product quality' });
  }
});

export default router;