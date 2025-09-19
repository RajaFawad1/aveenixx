import { Clock, Eye, Scale, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DailyDealsSection() {
  const isMobile = useIsMobile();
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 56,
    seconds: 36
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dailyDeals = [
    {
      id: 1,
      name: "Gaming Headset Pro RGB",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$199.99",
      salePrice: "$149.99",
      rating: 4.5,
      reviews: 45,
      discount: "-25%"
    },
    {
      id: 2,
      name: "Wireless Gaming Mouse Pro",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$79.99",
      salePrice: "$59.99",
      rating: 4.8,
      reviews: 128,
      discount: "-25%"
    },
    {
      id: 3,
      name: "Mechanical Keyboard RGB",
      image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$159.99",
      salePrice: "$119.99",
      rating: 4.6,
      reviews: 89,
      discount: "-25%"
    },
    {
      id: 4,
      name: "4K Gaming Monitor 27inch",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$449.99",
      salePrice: "$349.99",
      rating: 4.7,
      reviews: 156,
      discount: "-22%"
    },
    {
      id: 5,
      name: "Wireless Bluetooth Speaker",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$89.99",
      salePrice: "$64.99",
      rating: 4.4,
      reviews: 73,
      discount: "-28%"
    },
    {
      id: 6,
      name: "Smart Fitness Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$299.99",
      salePrice: "$199.99",
      rating: 4.6,
      reviews: 234,
      discount: "-33%"
    },
    {
      id: 7,
      name: "Wireless Earbuds Pro",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop&crop=center",
      originalPrice: "$179.99",
      salePrice: "$129.99",
      rating: 4.7,
      reviews: 189,
      discount: "-28%"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => (
          <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? '' : 'opacity-30'}`}></i>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-3 leading-tight">Daily Deals</h2>
          <div className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-white px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">
              Ends In: {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <a href="/categories/electronics" className="hover-color-text text-sm font-medium">
            View All →
          </a>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {dailyDeals.slice(0, isMobile ? 4 : 5).map((product) => (
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