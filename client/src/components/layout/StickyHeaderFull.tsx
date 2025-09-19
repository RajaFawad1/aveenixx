import { useState } from 'react';
import HeaderUtility from './HeaderUtility';
import MainNavbar from './MainNavbar';
import SubNavbar from './SubNavbar';

interface StickyHeaderFullProps {
  showSearch?: boolean;
  showEcommerceActions?: boolean;
  showProductCategories?: boolean;
  subtitle?: string;
  customSubNavContent?: React.ReactNode;
}

export default function StickyHeaderFull({
  showSearch = true,
  showEcommerceActions = true,
  showProductCategories = true,
  subtitle = "Express",
  customSubNavContent
}: StickyHeaderFullProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 shadow overflow-visible">
      <HeaderUtility />
      <MainNavbar 
        showSearch={showSearch}
        showEcommerceActions={showEcommerceActions}
        subtitle={subtitle}
      />
      <SubNavbar 
        showProductCategories={showProductCategories}
        customContent={customSubNavContent}
        isCategoriesOpen={isCategoriesOpen}
        setIsCategoriesOpen={setIsCategoriesOpen}
      />
    </div>
  );
}