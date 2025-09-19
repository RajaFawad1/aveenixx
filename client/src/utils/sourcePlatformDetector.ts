/**
 * Frontend Source Platform Detection Utility
 * Detects the original source platform from affiliate/external URLs
 */

export interface SourcePlatform {
  id: string;
  name: string;
  displayName: string;
  domain: string;
  icon: string;
}

export const SUPPORTED_PLATFORMS: SourcePlatform[] = [
  {
    id: 'amazon',
    name: 'amazon',
    displayName: 'Amazon',
    domain: 'amazon.com',
    icon: '🛒'
  },
  {
    id: 'aliexpress',
    name: 'aliexpress',
    displayName: 'AliExpress',
    domain: 'aliexpress.com',
    icon: '🏪'
  },
  {
    id: 'walmart',
    name: 'walmart',
    displayName: 'Walmart',
    domain: 'walmart.com',
    icon: '🏬'
  },
  {
    id: 'ebay',
    name: 'ebay',
    displayName: 'eBay',
    domain: 'ebay.com',
    icon: '🏷️'
  },
  {
    id: 'target',
    name: 'target',
    displayName: 'Target',
    domain: 'target.com',
    icon: '🎯'
  },
  {
    id: 'bestbuy',
    name: 'bestbuy',
    displayName: 'Best Buy',
    domain: 'bestbuy.com',
    icon: '💻'
  },
  {
    id: 'etsy',
    name: 'etsy',
    displayName: 'Etsy',
    domain: 'etsy.com',
    icon: '🎨'
  },
  {
    id: 'shopify',
    name: 'shopify',
    displayName: 'Shopify Store',
    domain: 'myshopify.com',
    icon: '🛍️'
  }
];

/**
 * Detects the source platform from an external/affiliate URL
 * @param externalUrl - The affiliate or external URL
 * @returns The detected source platform or default fallback
 */
export function detectSourcePlatform(externalUrl?: string): SourcePlatform {
  if (!externalUrl) {
    return {
      id: 'unknown',
      name: 'unknown',
      displayName: 'Unknown Source',
      domain: '',
      icon: '🔗'
    };
  }

  try {
    const url = new URL(externalUrl);
    const hostname = url.hostname.toLowerCase();

    // Check for direct domain matches
    for (const platform of SUPPORTED_PLATFORMS) {
      if (hostname.includes(platform.domain.toLowerCase())) {
        return platform;
      }
    }

    // Check for common affiliate redirects
    if (hostname.includes('amazon')) {
      return SUPPORTED_PLATFORMS.find(p => p.id === 'amazon')!;
    }
    if (hostname.includes('aliexpress')) {
      return SUPPORTED_PLATFORMS.find(p => p.id === 'aliexpress')!;
    }
    if (hostname.includes('walmart')) {
      return SUPPORTED_PLATFORMS.find(p => p.id === 'walmart')!;
    }
    if (hostname.includes('ebay')) {
      return SUPPORTED_PLATFORMS.find(p => p.id === 'ebay')!;
    }

    // Fallback to generic external source
    return {
      id: 'external',
      name: 'external',
      displayName: 'External Source',
      domain: hostname,
      icon: '🌐'
    };

  } catch (error) {
    console.error('Error parsing external URL:', externalUrl, error);
    return {
      id: 'unknown',
      name: 'unknown',
      displayName: 'Unknown Source',
      domain: '',
      icon: '🔗'
    };
  }
}

/**
 * Gets the authentication/verification message for a source platform
 * @param platform - The source platform
 * @returns Verification message
 */
export function getSourceVerificationMessage(platform: SourcePlatform): string {
  switch (platform.id) {
    case 'amazon':
      return 'Verified Product from authorized Amazon source';
    case 'aliexpress':
      return 'Verified Product from authorized AliExpress source';
    case 'walmart':
      return 'Verified Product from authorized Walmart source';
    case 'ebay':
      return 'Verified Product from authorized eBay source';
    case 'target':
      return 'Verified Product from authorized Target source';
    case 'bestbuy':
      return 'Verified Product from authorized Best Buy source';
    case 'etsy':
      return 'Verified Product from authorized Etsy source';
    case 'shopify':
      return 'Verified Product from authorized Shopify store';
    case 'external':
      return `Verified Product from authorized ${platform.displayName} source`;
    default:
      return 'Verified Product from authorized source';
  }
}