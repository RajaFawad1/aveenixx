import React from 'react';
import { X, Grid3x3, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  subcategories?: Array<{ id: string; name: string; }>;
}

interface MobileCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
}

export function MobileCategoryModal({ 
  isOpen, 
  onClose, 
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect
}: MobileCategoryModalProps) {
  if (!isOpen) return null;

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Categories</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id}>
                <button
                  onClick={() => {
                    onCategorySelect(category.id);
                    if (!category.subcategories?.length) {
                      onClose();
                    }
                  }}
                  className={`w-full text-left px-3 py-3 text-sm border rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    {category.subcategories?.length && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Subcategories */}
                {selectedCategory === category.id && category.subcategories?.length && (
                  <div className="ml-4 mt-2 space-y-1">
                    <button
                      onClick={() => {
                        onSubcategorySelect('');
                        onClose();
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm border rounded ${
                        selectedSubcategory === ''
                          ? 'bg-[var(--primary-color-light)] text-[var(--primary-color)] border-[var(--primary-color)]'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All {category.name}
                    </button>
                    {category.subcategories.map(subcategory => (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          onSubcategorySelect(subcategory.id);
                          onClose();
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm border rounded ${
                          selectedSubcategory === subcategory.id
                            ? 'bg-[var(--primary-color-light)] text-[var(--primary-color)] border-[var(--primary-color)]'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}