// Shared utility functions for Aveenix E-commerce Platform

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// UI utility for combining classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with proper locale
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `AVX-${timestamp}-${random}`.toUpperCase();
}

// Calculate discount amount
export function calculateDiscount(price: number, discountPercentage: number): number {
  return price * (discountPercentage / 100);
}

// Calculate final price after discount
export function calculateFinalPrice(price: number, discountPercentage: number): number {
  return price - calculateDiscount(price, discountPercentage);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate product slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Calculate shipping cost based on order value
export function calculateShipping(orderValue: number, shippingType: 'standard' | 'express' | 'overnight'): number {
  if (orderValue >= 50) return 0; // Free shipping over $50
  
  switch (shippingType) {
    case 'standard':
      return 0;
    case 'express':
      return 9.99;
    case 'overnight':
      return 19.99;
    default:
      return 0;
  }
}

// Calculate tax amount
export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return subtotal * taxRate;
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate rating stars
export function generateRatingStars(rating: number): string[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  if (hasHalfStar) {
    stars.push('half');
  }
  
  while (stars.length < 5) {
    stars.push('empty');
  }
  
  return stars;
}

// Validate promo code format
export function validatePromoCode(code: string): boolean {
  const promoRegex = /^[A-Z0-9]{4,20}$/;
  return promoRegex.test(code);
}

// Calculate order total
export function calculateOrderTotal(
  subtotal: number,
  discount: number = 0,
  shipping: number = 0,
  tax: number = 0
): number {
  return subtotal - discount + shipping + tax;
}

// Format file size
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Generate random color
export function generateRandomColor(): string {
  const colors = [
    '#FACC15', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#84CC16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Check if user is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle quota exceeded error
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle error
    }
  }
};