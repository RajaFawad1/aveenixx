import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  activeFiltersCount: number;
  onClearAll: () => void;
}

export function MobileFilterModal({ 
  isOpen, 
  onClose, 
  children, 
  activeFiltersCount,
  onClearAll 
}: MobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop - only covers content area below header */}
      <div 
        className="absolute top-16 bottom-0 left-0 right-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal - full screen below header */}
      <div className="absolute top-16 bottom-0 left-0 right-0 bg-white dark:bg-gray-900 overflow-y-auto z-10">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <Button 
              variant="outline" 
              onClick={onClearAll}
              className="w-full text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}