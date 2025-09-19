import { useEffect, useRef } from "react";
import { X, Heart, ShoppingCart, Trash2, Eye, Star } from "lucide-react";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const wishlistItems = [
  {
    id: 'w1',
    name: 'iPhone 15 Pro Max',
    price: 1199.99,
    originalPrice: 1299.99,
    image: '/api/placeholder/80/80',
    rating: 4.8,
    reviewCount: 2547,
    inStock: true,
    discount: 8
  },
  {
    id: 'w2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 999.99,
    originalPrice: 1099.99,
    image: '/api/placeholder/80/80',
    rating: 4.7,
    reviewCount: 1832,
    inStock: true,
    discount: 9
  },
  {
    id: 'w3',
    name: 'MacBook Pro 16"',
    price: 2499.99,
    originalPrice: 2699.99,
    image: '/api/placeholder/80/80',
    rating: 4.9,
    reviewCount: 945,
    inStock: false,
    discount: 7
  },
  {
    id: 'w4',
    name: 'AirPods Pro 2',
    price: 249.99,
    originalPrice: 279.99,
    image: '/api/placeholder/80/80',
    rating: 4.6,
    reviewCount: 3421,
    inStock: true,
    discount: 11
  },
  {
    id: 'w5',
    name: 'iPad Air 5th Gen',
    price: 599.99,
    originalPrice: 649.99,
    image: '/api/placeholder/80/80',
    rating: 4.5,
    reviewCount: 1267,
    inStock: true,
    discount: 8
  }
];

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const addToCart = (itemId: string) => {
    const item = wishlistItems.find(item => item.id === itemId);
    if (item) {
      console.log('Adding to cart:', item);
      // In a real app, this would add to cart
    }
  };

  const removeFromWishlist = (itemId: string) => {
    console.log('Removing from wishlist:', itemId);
    // In a real app, this would remove from wishlist
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
    >
      {/* Modal content that fills exact space between header and footer */}
      <div className="fixed top-20 left-0 right-0 bottom-20 flex flex-col bg-white dark:bg-gray-800 border-t-2 border-b-2 border-white dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
        {/* Wishlist Header */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Wishlist</h2>
              <span className="bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100 px-2 py-1 rounded-full text-xs font-medium">
                {wishlistItems.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Save items you love for later!</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-200 dark:bg-gray-600"
                      />
                      {item.discount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          -{item.discount}%
                        </span>
                      )}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.rating} ({item.reviewCount} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {item.inStock ? (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={!item.inStock}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            item.inStock
                              ? 'bg-pink-600 text-white hover:bg-pink-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>
                        
                        <button
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Quick View</span>
                        </button>
                        
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{wishlistItems.length}</span> items saved
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  // Add all available items to cart
                  wishlistItems.filter(item => item.inStock).forEach(item => addToCart(item.id));
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}