import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  activeFiltersCount: number;
}

export function MobileFilterDrawer({ isOpen, onClose, children, activeFiltersCount }: MobileFilterDrawerProps) {
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => {}}
          className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Filter className="h-6 w-6" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.5rem] h-6 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-sm bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
                <h2 className="font-semibold text-lg">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Badge 
                    className="bg-primary/10 text-primary border-primary/20"
                    style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}