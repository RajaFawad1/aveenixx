import { mockCategories, bestSellerProducts, featuredProducts, hotProducts, flashSaleProducts } from "@/lib/products";
import { Menu, Zap, ShirtIcon as Shirt, Mountain, User, Crown, Flame, Waves, Briefcase, Circle, ShoppingBag, TrendingUp, ShoppingCart, Eye, Star, Award, Sparkles } from "lucide-react";

export default function SidebarCategories() {
  // Map category names to Lucide icons
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      "Athletic Shoes": Zap,
      "Leather Shoes": Shirt,
      "Boots": Mountain,
      "Loafers": User,
      "High Heels": Crown,
      "Sneakers": Flame,
      "Sandals": Waves,
      "Backpacks": Briefcase,
      "Belts": Circle,
      "Handbags": ShoppingBag,
    };
    return iconMap[categoryName] || ShoppingBag;
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 text-xs">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(5 - Math.ceil(ratingNum))].map((_, i) => (
          <i key={i + fullStars} className="far fa-star"></i>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full lg:w-64 mb-6 lg:mb-0 lg:block hidden">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4 border-b-2 pb-3" style={{ borderColor: 'var(--primary-color)' }}>
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center leading-tight">
            <Menu className="w-5 h-5 mr-2" />
            All Categories
          </h3>
          <a 
            href="/categories" 
            className="text-xs px-3 py-1 rounded-full border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
          >
            View All
          </a>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-2">
          {mockCategories.slice(0, 10).map((category) => (
            <li key={category.id}>
              <a 
                href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover-color-text hover:underline transition-colors py-1 font-medium ${
                  category.isHot ? 'bg-red-100 dark:bg-red-900 px-2 rounded' : ''
                }`}
              >
                {(() => {
                  const IconComponent = getCategoryIcon(category.name);
                  return <IconComponent className="w-4 h-4 mr-2" />;
                })()}
                {category.name}
                {category.isHot && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded">Hot</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Best Sellers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        {/* Gradient Banner Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center">
              🏆 Best Sellers
            </h3>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
          </div>
          <p className="text-sm opacity-90">Top-rated customer favorites!</p>
        </div>
        
        {/* Product Content */}
        <div className="p-4">
        <div className="space-y-3">
          {bestSellerProducts.slice(0, 5).map((product, index) => (
            <div key={product.id} className="group relative flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              {/* Product Image */}
              <div className="relative flex-shrink-0">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" 
                />
                {/* Best Seller Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Flame className="w-2.5 h-2.5 text-white" />
                </div>
                {/* Rank Badge */}
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">#{index + 1}</span>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {product.name}
                </h4>
                <div className="flex items-center mt-1">
                  {renderStars(product.rating || "0")}
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary-color)' }}>${product.price}</p>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-gray-500">In Stock</span>
                  </div>
                  <span className="text-orange-600 font-medium">Only {Math.floor(Math.random() * 5) + 1} left!</span>
                </div>
                
                {/* Sales Badge */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    <span className="text-green-600 font-medium">{Math.floor(Math.random() * 100) + 50} sold today</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    <span className="text-gray-500">Best Seller</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col space-y-1">
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Quick View">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Add to Cart">
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm font-medium py-2 px-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md transform hover:scale-105" 
                  style={{ 
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}>
            View All Best Sellers →
          </button>
        </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        {/* Gradient Banner Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center">
              ⭐ Featured Products
            </h3>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Curated
            </div>
          </div>
          <p className="text-sm opacity-90">Hand-picked by our experts!</p>
        </div>
        
        {/* Product Content */}
        <div className="p-4">
        <div className="space-y-3">
          {featuredProducts.slice(0, 5).map((product, index) => (
            <div key={product.id} className="group relative flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:shadow-md">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" 
                />
                {/* Featured Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-2 h-2 text-white" />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center mt-1">
                  {renderStars(product.rating || "0")}
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary-color)' }}>${product.price}</p>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center mt-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-gray-500">In Stock</span>
                  <span className="ml-auto text-blue-600 font-medium">Editor's Choice</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col space-y-1">
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Quick View">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Add to Cart">
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm font-medium py-2 px-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md transform hover:scale-105" 
                  style={{ 
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}>
            View All Featured Products →
          </button>
        </div>
        </div>
      </div>

      {/* Hot Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        {/* Gradient Banner Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-t-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center">
              🔥 Hot Products
            </h3>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              Trending
            </div>
          </div>
          <p className="text-sm opacity-90">Most popular items right now!</p>
        </div>
        
        {/* Product Content */}
        <div className="p-4">
        <div className="space-y-3">
          {hotProducts.slice(0, 5).map((product, index) => (
            <div key={product.id} className="group relative flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:shadow-md">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" 
                />
                {/* Hot Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <Flame className="w-2 h-2 text-white" />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center mt-1">
                  {renderStars(product.rating || "0")}
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary-color)' }}>${product.price}</p>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center mt-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-gray-500">In Stock</span>
                  <span className="ml-auto text-orange-600 font-medium">🔥 Hot Deal!</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col space-y-1">
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Quick View">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Add to Cart">
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm font-medium py-2 px-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md transform hover:scale-105" 
                  style={{ 
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}>
            View All Hot Products →
          </button>
        </div>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        {/* Gradient Banner Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center">
              ⚡ Flash Sale
            </h3>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-mono">
              23:45:12
            </div>
          </div>
          <p className="text-sm opacity-90">Limited time offers - Don't miss out!</p>
        </div>
        
        {/* Product Content */}
        <div className="p-4">
        <div className="space-y-3">
          {flashSaleProducts.slice(0, 5).map((product, index) => (
            <div key={product.id} className="group relative flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:shadow-md">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" 
                />
                {/* Flash Sale Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center mt-1">
                  {renderStars(product.rating || "0")}
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary-color)' }}>${product.price}</p>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center mt-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-gray-500">In Stock</span>
                  <span className="ml-auto text-red-600 font-medium">⚡ Flash Price!</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col space-y-1">
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Quick View">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110" style={{ color: 'var(--primary-color)' }} title="Add to Cart">
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm font-medium py-2 px-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md transform hover:scale-105" 
                  style={{ 
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}>
            View All Flash Sale →
          </button>
        </div>
        </div>
      </div>

      {/* Advertisement Section */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-lg shadow-lg p-0 mb-5 mt-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-white font-bold text-lg">
              Flash Sale
            </h3>
          </div>
          
          <p className="text-white/95 text-sm mb-4 leading-relaxed">
            <span className="font-semibold">70% OFF</span> Electronics & Gaming
          </p>
          
          {/* Product Preview with Image */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <p className="font-semibold text-sm">Gaming Accessories</p>
                <p className="text-xs text-white/80">From $19.99</p>
              </div>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="flex space-x-2 text-white">
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="text-xs font-bold">12</span>
                </div>
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="text-xs font-bold">34</span>
                </div>
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="text-xs font-bold">56</span>
                </div>
              </div>
              <p className="text-xs text-white/80 mt-1">Hours Left</p>
            </div>
          </div>
          
          {/* Call to Action */}
          <button className="w-full bg-white text-orange-600 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 text-sm shadow-lg">
            Shop Flash Sale
          </button>
        </div>
      </div>
    </div>
  );
}
