import { mockCategories } from "@/lib/products";
import { 
  Zap, 
  ShoppingBag, 
  TrendingUp, 
  User, 
  Crown, 
  Flame,
  Backpack,
  Briefcase
} from "lucide-react";

export default function CategoryHighlightTiles() {
  const featuredCategories = mockCategories.slice(0, 8);
  
  // Map category names to Lucide icons
  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      "Athletic Shoes": Zap,
      "Leather Shoes": ShoppingBag,
      "Boots": TrendingUp,
      "Loafers": User,
      "High Heels": Crown,
      "Sneakers": Flame,
      "Sandals": Backpack,
      "Backpacks": Briefcase,
    };
    return iconMap[categoryName] || ShoppingBag;
  };

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
        {featuredCategories.map((category) => (
          <a 
            key={category.id}
            href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 text-center hover:shadow-md transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 block"
          >
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                {(() => {
                  const IconComponent = getIconForCategory(category.name);
                  return <IconComponent className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-[var(--hover-color)] transition-colors" />;
                })()}
              </div>
              {category.isHot && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Hot
                </span>
              )}
            </div>
            <h3 className="font-medium text-xs text-gray-900 dark:text-white group-hover:text-[var(--hover-color)] transition-colors">
              {category.name}
            </h3>
          </a>
        ))}
      </div>
    </div>
  );
}