import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export function SEO({ title, description, keywords, canonicalUrl, ogImage }: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Update meta tags
    const updateOrCreateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      
      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', property);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateOrCreateMetaTag('description', description);
    if (keywords) {
      updateOrCreateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateOrCreateMetaTag('', title, 'og:title');
    updateOrCreateMetaTag('', description, 'og:description');
    updateOrCreateMetaTag('', 'website', 'og:type');
    if (canonicalUrl) {
      updateOrCreateMetaTag('', canonicalUrl, 'og:url');
    }
    if (ogImage) {
      updateOrCreateMetaTag('', ogImage, 'og:image');
    }

    // Twitter Card tags
    updateOrCreateMetaTag('twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('twitter:title', title);
    updateOrCreateMetaTag('twitter:description', description);
    if (ogImage) {
      updateOrCreateMetaTag('twitter:image', ogImage);
    }

    // Canonical URL
    if (canonicalUrl) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    }
  }, [title, description, keywords, canonicalUrl, ogImage]);

  return null;
}