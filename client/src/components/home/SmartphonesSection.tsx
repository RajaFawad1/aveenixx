import { useIsMobile } from "@/hooks/use-mobile";
import { Heart, Eye, Scale } from "lucide-react";

export default function SmartphonesSection() {
  const isMobile = useIsMobile();
  const smartphones = [
    {
      id: 1,
      name: "Samsung Galaxy S23 Ultra",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$1299.99",
      salePrice: "$1199.00",
      rating: 4.8,
      reviews: 256,
      discount: "-8%",
      brand: "Samsung",
      storage: "256GB"
    },
    {
      id: 2,
      name: "iPhone 14 Pro 128GB",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$999.99",
      salePrice: "$799.00",
      rating: 4.9,
      reviews: 512,
      discount: "-20%",
      brand: "Apple",
      storage: "128GB"
    },
    {
      id: 3,
      name: "OnePlus 11 5G 256GB",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$799.99",
      salePrice: "$699.00",
      rating: 4.7,
      reviews: 189,
      discount: "-13%",
      brand: "OnePlus",
      storage: "256GB"
    },
    {
      id: 4,
      name: "Xiaomi 13 Pro 512GB",
      image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$1199.99",
      salePrice: "$1019.00",
      rating: 4.6,
      reviews: 134,
      discount: "-15%",
      brand: "Xiaomi",
      storage: "512GB"
    },
    {
      id: 5,
      name: "Google Pixel 7 Pro 128GB",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$899.99",
      salePrice: "$749.00",
      rating: 4.7,
      reviews: 298,
      discount: "-17%",
      brand: "Google",
      storage: "128GB"
    },
    {
      id: 6,
      name: "iPhone 15 Pro Max 256GB",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$1299.99",
      salePrice: "$1149.00",
      rating: 4.9,
      reviews: 412,
      discount: "-12%",
      brand: "Apple",
      storage: "256GB"
    },
    {
      id: 7,
      name: "Samsung Galaxy Z Fold5 512GB",
      image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$1899.99",
      salePrice: "$1599.00",
      rating: 4.8,
      reviews: 187,
      discount: "-16%",
      brand: "Samsung",
      storage: "512GB"
    },
    {
      id: 8,
      name: "Nothing Phone (2) 256GB",
      image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$699.99",
      salePrice: "$579.00",
      rating: 4.5,
      reviews: 156,
      discount: "-17%",
      brand: "Nothing",
      storage: "256GB"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className="fas fa-star text-yellow-400"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-yellow-400"></i>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>
      );
    }

    return stars;
  };

  return (
    <div>
      {/* Section Header with Yellow Underline */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-3">Smartphones</h2>
          <div className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            <button className="text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: 'var(--primary-color)' }}>
              Featured Phones
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 whitespace-nowrap">
              Accessories
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 whitespace-nowrap hidden sm:block">
              Cases
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 whitespace-nowrap hidden sm:block">
              All in One
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 whitespace-nowrap hidden md:block">
              Audio Speakers
            </button>
          </div>
          <a href="/categories/electronics" className="hover-color-text text-sm font-medium whitespace-nowrap">
            View All →
          </a>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {smartphones.slice(0, isMobile ? 4 : 5).map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group transform hover:-translate-y-1">
            {/* Discount Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                {product.discount}
              </span>
            </div>
            
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              
              {/* All Icons in Vertical Stack */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex flex-col gap-1">
                  <button className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Add to Wishlist">
                    <Heart className="w-3.5 h-3.5 theme-color" />
                  </button>
                  <button className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Quick View">
                    <Eye className="w-3.5 h-3.5 theme-color" />
                  </button>
                  <button className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Compare">
                    <Scale className="w-3.5 h-3.5 theme-color" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="p-4">
              {/* Brand & Storage */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {product.brand} • {product.storage}
                </span>
              </div>
              
              {/* Product Name */}
              <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white line-clamp-2">
                {product.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(product.rating)}
                <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
              </div>
              
              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-color)' }}>{product.salePrice}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <button className="w-full mt-2 py-1.5 rounded text-sm font-semibold transition-colors text-white hover-color-bg" style={{ backgroundColor: 'var(--primary-color)' }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}