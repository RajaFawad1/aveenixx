import { useEffect, useRef, useState } from "react";
import { X, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getIconByName } from '@/utils/iconMapping';
import React from 'react';
import { useLocation } from "wouter";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export default function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  
  // Fetch categories from API
  const { data: categories = [] } = useQuery({ queryKey: ['/api/categories'] });

  // Handle category selection
  const handleCategoryClick = (categoryId: number) => {
    onClose();
    setLocation(`/categories?category=${categoryId}`);
  };

  // Handle subcategory selection  
  const handleSubcategoryClick = (categoryId: number, subcategoryName: string) => {
    onClose();
    setLocation(`/categories?category=${categoryId}&subcategory=${encodeURIComponent(subcategoryName)}`);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle click outside to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Modal content that fills exact space between header and footer */}
      <div className="fixed top-16 left-0 right-0 bottom-16 flex flex-col bg-white dark:bg-gray-800 border-t-2 border-b-2 border-white dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Categories Header */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {(categories as any[])
              .filter((category: any) => category.name?.toLowerCase() !== 'uncategorized')
              .map((category: any) => (
              <div key={category.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Main Category */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div 
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      {React.createElement(getIconByName(category.icon), { 
                        className: "w-5 h-5", 
                        style: { color: 'var(--primary-color)' } 
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.productCount || 0} products
                      </p>
                    </div>
                  </div>
                  
                  {/* Expand/Collapse button for subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryExpansion(category.id);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full transition-colors"
                    >
                      {expandedCategories.includes(category.id) ? 
                        <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  )}
                  
                  {(!category.subcategories || category.subcategories.length === 0) && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && expandedCategories.includes(category.id) && (
                  <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-25 dark:bg-gray-750">
                    {category.subcategories.map((subcategory: any) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center space-x-3 p-3 pl-12 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-650 last:border-b-0"
                        onClick={() => handleSubcategoryClick(category.id, subcategory.name)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {React.createElement(getIconByName(subcategory.icon), { 
                            className: "w-4 h-4 text-gray-500" 
                          })}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{subcategory.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {subcategory.productCount || 0} products
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Browse our complete selection of products across all categories
          </p>
        </div>
      </div>
    </div>
  );
}