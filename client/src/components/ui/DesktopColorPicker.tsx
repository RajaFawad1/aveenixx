import { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const colorOptions = [
  // Popular Colors
  { value: 'yellow', name: 'Yellow', color: '#F59E0B' },
  { value: 'blue', name: 'Blue', color: '#3B82F6' },
  { value: 'green', name: 'Green', color: '#10B981' },
  { value: 'purple', name: 'Purple', color: '#8B5CF6' },
  { value: 'red', name: 'Red', color: '#EF4444' },
  { value: 'orange', name: 'Orange', color: '#F97316' },
  // Extended Colors
  { value: 'teal', name: 'Teal', color: '#14B8A6' },
  { value: 'indigo', name: 'Indigo', color: '#6366F1' },
  { value: 'pink', name: 'Pink', color: '#EC4899' },
  { value: 'lime', name: 'Lime', color: '#84CC16' },
  { value: 'cyan', name: 'Cyan', color: '#06B6D4' },
  { value: 'amber', name: 'Amber', color: '#F59E0B' },
  { value: 'emerald', name: 'Emerald', color: '#10B981' },
  { value: 'violet', name: 'Violet', color: '#8B5CF6' },
  { value: 'rose', name: 'Rose', color: '#F43F5E' },
  { value: 'sky', name: 'Sky', color: '#0EA5E9' },
  { value: 'fuchsia', name: 'Fuchsia', color: '#D946EF' },
  { value: 'slate', name: 'Slate', color: '#64748B' }
];

const popularColors = colorOptions.slice(0, 6);
const extendedColors = colorOptions.slice(6);

export default function DesktopColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { colorTheme, setColorTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position dropdown directly below the Color button
      setDropdownPosition({
        top: rect.bottom + 8, // 8px below the button
        left: rect.right - 256 // Align to the right of the button (256px = w-64)
      });
    }
  }, [isOpen]);

  const getCurrentColor = () => {
    return colorOptions.find(c => c.value === colorTheme) || colorOptions[0];
  };

  const handleColorChange = (colorValue: string) => {
    setColorTheme(colorValue as any);
    setIsOpen(false);
  };

  const currentColor = getCurrentColor();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center hover-color-text transition-colors px-2 py-1"
      >
        <Palette className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline text-xs">Color</span>
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="fixed w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Color Theme</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{currentColor.name}</span>
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Popular Colors */}
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Popular</h4>
              <div className="grid grid-cols-3 gap-2">
                {popularColors.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleColorChange(option.value)}
                    className={`group flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                      colorTheme === option.value ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-blue-400' : ''
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-md shadow-md group-hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                      style={{ backgroundColor: option.color }}
                    >
                      <Palette className="w-4 h-4 text-white opacity-90" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extended Colors */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Extended Palette</h4>
              <div className="grid grid-cols-3 gap-2">
                {extendedColors.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleColorChange(option.value)}
                    className={`group flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                      colorTheme === option.value ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-blue-400' : ''
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-md shadow-md group-hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                      style={{ backgroundColor: option.color }}
                    >
                      <Palette className="w-4 h-4 text-white opacity-90" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}