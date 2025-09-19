// Icon mapping utility for converting backend icon names to Lucide React components
import {
  Zap, Shirt, Home, Dumbbell, Car, BookOpen, Heart, Baby,
  Crown, Briefcase, Palette, Utensils, Wrench, Luggage,
  Camera, Headphones, Laptop, Smartphone, Scale,
  ShoppingCart, Gift, Sparkles, User, Settings,
  Star, Clock, MapPin, Phone, Mail, Shield, 
  Factory, Gem, Music, PartyPopper, Church, Gamepad2, Layers, Trophy,
  Coffee, PawPrint, Tent, SprayCan, Bike, Flower, Flag, Crosshair, 
  Scissors, Wifi, Droplet, Presentation, Puzzle, Radio, Package, 
  Hammer, PenTool, Activity, Tv, Film, Tablet, Watch, Mouse, Keyboard,
  Footprints, Sun, Armchair, Bed, Droplets, Lightbulb, Leaf, Circle,
  Book, GraduationCap, Newspaper, Download, Dice6, Spade, Target,
  Mountain, Waves, Snowflake, Pill, Blocks
} from 'lucide-react';

// Map of icon names to Lucide React components
export const iconMapping: { [key: string]: any } = {
  // Technology & Electronics
  'zap': Zap,
  'laptop': Laptop,
  'smartphone': Smartphone,
  'camera': Camera,
  'headphones': Headphones,
  
  // Fashion & Apparel
  'shirt': Shirt,
  
  // Home & Garden
  'home': Home,
  
  // Sports & Fitness
  'dumbbell': Dumbbell,
  
  // Automotive
  'car': Car,
  
  // Books & Media (using BookOpen for book icon)
  'book-open': BookOpen,
  
  // Health & Beauty & Pet Supplies
  'heart': Heart,
  'paw-print': PawPrint,
  
  // Baby & Kids
  'baby': Baby,
  
  // Jewelry & Accessories
  'trophy': Trophy,
  'gem': Gem,
  
  // Office & Business
  'briefcase': Briefcase,
  
  // Arts & Crafts
  'flame': Palette, // Changed from Flame to more appropriate Palette
  'palette': Palette,
  
  // Food & Beverages
  'utensils': Utensils,
  'coffee': Coffee,
  
  // Tools & Hardware
  'layers': Layers,
  'wrench': Wrench,
  
  // Travel & Luggage
  'backpack': Luggage, // Changed from Backpack to more appropriate Luggage
  'luggage': Luggage,
  'tent': Tent,
  
  // Additional category icons
  'crown': Crown,
  'factory': Factory,
  'music': Music,
  'party-popper': PartyPopper,
  'church': Church,
  'gamepad-2': Gamepad2,
  'gamepad2': Gamepad2, // Handle both naming conventions
  
  // General purpose icons
  'scale': Scale,
  'shopping-cart': ShoppingCart,
  'gift': Gift,
  'sparkles': Sparkles,
  'user': User,
  'settings': Settings,
  'star': Star,
  'clock': Clock,
  'map-pin': MapPin,
  'phone': Phone,
  'mail': Mail,
  'shield': Shield,
  
  // Additional subcategory icons
  'spray-can': SprayCan,
  'bike': Bike,
  'flower': Flower,
  'flag': Flag,
  'crosshair': Crosshair,
  'scissors': Scissors,
  'wifi': Wifi,
  'droplet': Droplet,
  'droplets': Droplets,
  'presentation': Presentation,
  'puzzle': Puzzle,
  'radio': Radio,
  'package': Package,
  'hammer': Hammer,
  'pen-tool': PenTool,
  'activity': Activity,
  'tv': Tv,
  'film': Film,
  'tablet': Tablet,
  'watch': Watch,
  'mouse': Mouse,
  'keyboard': Keyboard,
  'footprints': Footprints,
  'sun': Sun,
  'armchair': Armchair,
  'bed': Bed,
  'lightbulb': Lightbulb,
  'leaf': Leaf,
  'circle': Circle,
  'graduation-cap': GraduationCap,
  'newspaper': Newspaper,
  'download': Download,
  'dice-6': Dice6,
  'spade': Spade,
  'target': Target,
  'mountain': Mountain,
  'waves': Waves,
  'snowflake': Snowflake,
  'pill': Pill,
  'blocks': Blocks,
};

// Function to get icon component by name with fallback
export function getIconByName(iconName: string | null | undefined) {
  if (!iconName || typeof iconName !== 'string') {
    return Layers; // Default fallback icon
  }
  
  // Normalize icon name (lowercase, handle variations)
  const normalizedName = iconName.toLowerCase().trim();
  
  // Direct lookup
  if (iconMapping[normalizedName]) {
    return iconMapping[normalizedName];
  }
  
  // Handle common variations and aliases
  const aliases: { [key: string]: string } = {
    // Main categories
    'electronics': 'zap',
    'technology': 'zap',
    'tech': 'zap',
    'fashion': 'shirt',
    'apparel': 'shirt',
    'clothing': 'shirt',
    'garden': 'home',
    'house': 'home',
    'sports': 'dumbbell',
    'fitness': 'dumbbell',
    'exercise': 'dumbbell',
    'automotive': 'car',
    'auto': 'car',
    'vehicle': 'car',
    'books': 'book-open',
    'media': 'book-open',
    'reading': 'book-open',
    'health': 'heart',
    'beauty': 'heart',
    'wellness': 'heart',
    'kids': 'baby',
    'children': 'baby',
    'toys': 'baby',
    'jewelry': 'trophy',
    'accessories': 'trophy',
    'office': 'briefcase',
    'business': 'briefcase',
    'work': 'briefcase',
    'arts': 'palette',
    'crafts': 'palette',
    'creative': 'palette',
    'food': 'utensils',
    'beverages': 'utensils',
    'drinks': 'utensils',
    'tools': 'layers',
    'hardware': 'layers',
    'equipment': 'layers',
    'travel': 'backpack',
    'luggage': 'backpack',
    
    // Electronics & Technology subcategories
    'smartphones': 'smartphone',
    'phone': 'smartphone',
    'mobile': 'smartphone',
    'laptops': 'laptop',
    'computers': 'laptop',
    'desktop': 'laptop',
    'headphones': 'headphones',
    'audio': 'headphones',
    'earbuds': 'headphones',
    'cameras': 'camera',
    'photography': 'camera',
    'video': 'camera',
    'smart tv': 'tv',
    'television': 'tv',
    'displays': 'tv',
    'monitors': 'tv',
    'wearables': 'watch',
    'smartwatches': 'watch',
    'fitness trackers': 'watch',
    'gaming': 'gamepad2',
    'consoles': 'gamepad2',
    'gaming consoles': 'gamepad2',
    'tablets': 'tablet',
    'ipad': 'tablet',
    'e-readers': 'tablet',
    'smart home': 'home',
    'iot': 'home',
    'automation': 'home',
    'smart home devices': 'home',
    'computer accessories': 'mouse',
    'peripherals': 'mouse',
    'keyboard': 'keyboard',
    'mobile accessories': 'smartphone',
    'networking': 'wifi',
    'wifi': 'wifi',
    'router': 'wifi',
    
    // Fashion & Apparel subcategories
    'mens clothing': 'shirt',
    'mens': 'shirt',
    'womens clothing': 'shirt',
    'womens': 'shirt',
    'shoes': 'footprints',
    'footwear': 'footprints',
    'sneakers': 'footprints',
    'bags': 'briefcase',
    'handbags': 'briefcase',
    'purses': 'briefcase',
    'watches': 'watch',
    'timepieces': 'watch',
    'sunglasses': 'sun',
    'eyewear': 'sun',
    
    // Home & Garden subcategories
    'furniture': 'armchair',
    'seating': 'armchair',
    'chairs': 'armchair',
    'kitchen': 'utensils',
    'cookware': 'utensils',
    'appliances': 'utensils',
    'decor': 'palette',
    'decoration': 'palette',
    'art': 'palette',
    'bedding': 'bed',
    'bedroom': 'bed',
    'mattress': 'bed',
    'bathroom': 'droplets',
    'bath': 'droplets',
    'shower': 'droplets',
    'lighting': 'lightbulb',
    'lamps': 'lightbulb',
    'led': 'lightbulb',
    'gardening': 'leaf',
    'plants': 'leaf',
    'outdoor': 'leaf',
    'storage': 'package',
    'organization': 'package',
    'containers': 'package',
    
    // Health & Beauty subcategories
    'skincare': 'sparkles',
    'cosmetics': 'sparkles',
    'makeup': 'sparkles',
    'haircare': 'scissors',
    'hair': 'scissors',
    'shampoo': 'scissors',
    'vitamins': 'pill',
    'supplements': 'pill',
    'personal care': 'user',
    'hygiene': 'user',
    'oral care': 'user',
    'fragrance': 'flower',
    'perfume': 'flower',
    'cologne': 'flower',
    
    // Sports & Outdoors subcategories
    'fitness equipment': 'dumbbell',
    'gym': 'dumbbell',
    'outdoor recreation': 'mountain',
    'camping': 'mountain',
    'hiking': 'mountain',
    'sports gear': 'target',
    'balls': 'target',
    'athletic wear': 'shirt',
    'sportswear': 'shirt',
    'activewear': 'shirt',
    'water sports': 'waves',
    'swimming': 'waves',
    'surfing': 'waves',
    'winter sports': 'snowflake',
    'skiing': 'snowflake',
    'snowboard': 'snowflake',
    
    // Automotive subcategories
    'car parts': 'wrench',
    'auto parts': 'wrench',
    'maintenance': 'wrench',
    'car accessories': 'car',
    'interior': 'car',
    'exterior': 'car',
    'automotive tools': 'wrench',
    'car care': 'spray-can',
    'cleaning': 'spray-can',
    'detailing': 'spray-can',
    'tires': 'circle',
    'wheels': 'circle',
    'rims': 'circle',
    
    // Books & Media subcategories
    'fiction': 'book-open',
    'novels': 'book-open',
    'non-fiction': 'book-open',
    'textbooks': 'graduation-cap',
    'educational': 'graduation-cap',
    'academic': 'graduation-cap',
    'children books': 'baby',
    'kids books': 'baby',
    'comics': 'zap',
    'graphic novels': 'zap',
    'magazines': 'newspaper',
    'periodicals': 'newspaper',
    'audiobooks': 'headphones',
    'digital': 'download',
    'ebooks': 'download',
    
    // Toys & Games subcategories
    'action figures': 'user',
    'collectibles': 'trophy',
    'dolls': 'baby',
    'stuffed animals': 'baby',
    'board games': 'dice-6',
    'puzzles': 'puzzle',
    'card games': 'spade',
    'educational toys': 'graduation-cap',
    'learning': 'graduation-cap',
    'outdoor toys': 'sun',
    'playground': 'sun',
    'electronic toys': 'zap',
    'remote control': 'zap',
    'building toys': 'blocks',
    'lego': 'blocks',
    'construction': 'blocks'
  };
  
  // Check aliases
  if (aliases[normalizedName]) {
    return iconMapping[aliases[normalizedName]] || Layers;
  }
  
  // Fallback to default icon
  return Layers;
}