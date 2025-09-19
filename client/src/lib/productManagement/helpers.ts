import { Laptop, Shirt, Home, Heart, Dumbbell, Car, Book, Gamepad2, Coffee, Building2, Palette, PawPrint, Baby, Gem, Wrench, HelpCircle, Smartphone, Headphones, Camera, Tv, Watch, MousePointer, Keyboard, Speaker, Filter } from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Laptop, Shirt, Home, Heart, Dumbbell, Car, Book, Gamepad2, Coffee,
    Building2, Palette, PawPrint, Baby, Gem, Wrench, HelpCircle,
    Smartphone, Headphones, Camera, Tv, Watch, MousePointer, Keyboard, Speaker, Filter
  };
  return iconMap[iconName] || HelpCircle;
};

export const getIntervalLabel = (minutes: string): string => {
  const min = parseInt(minutes);
  if (min === 1) return '1 Min';
  if (min === 2) return '2 Min';
  if (min === 3) return '3 Min';
  if (min < 60) return `${min} Min`;
  if (min === 60) return '1 Hr';
  if (min === 120) return '2 Hr';
  if (min === 180) return '3 Hr';
  if (min === 240) return '4 Hr';
  if (min === 360) return '6 Hr';
  if (min === 480) return '8 Hr';
  if (min === 720) return '12 Hr';
  if (min === 1440) return 'Daily';
  if (min === 2880) return '2 Days';
  if (min === 4320) return '3 Days';
  if (min === 10080) return 'Weekly';
  if (min >= 1440) return `${Math.round(min / 1440)} Days`;
  if (min >= 60) return `${Math.round(min / 60)} Hr`;
  return `${min} Min`;
};


