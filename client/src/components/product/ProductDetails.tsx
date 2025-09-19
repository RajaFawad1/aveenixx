import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
// Format currency utility function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  rating: string;
  reviewCount: number;
  category: string;
  brand: string;
  isNew: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  discountPercentage: number;
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl]; // Mock multiple images

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {productImages.length > 1 && (
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-yellow-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.isNew && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">NEW</span>
              )}
              {product.isBestseller && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">BESTSELLER</span>
              )}
              {product.isOnSale && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  SALE {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(parseFloat(product.rating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(parseFloat(product.price))}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatCurrency(parseFloat(product.originalPrice))}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category */}
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Category: <span className="font-medium">{product.category}</span>
            </span>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>• Free shipping on orders over $50</p>
            <p>• 30-day return policy</p>
            <p>• 1-year warranty</p>
          </div>
        </div>
      </div>
    </div>
  );
}