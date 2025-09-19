import { useState } from "react";
import { Star, Heart, Eye, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import PriceDisplay from "./ui/PriceDisplay";

interface EnhancedProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    salePrice?: string;
    image?: string;
    imageUrl?: string;
    rating?: number;
    reviewCount?: number;
    brand?: string;
    category?: string;
    stockQuantity?: number;
    inStock?: boolean;
    isNew?: boolean;
    discount?: number;
  };
}

export default function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  const price = parseFloat(product.price) || 0;
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const discountPercent = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  
  // For imported products that don't manage stock inventory, default to in stock
  // Only show out of stock if explicitly set to false
  const isInStock = product.inStock !== false;
  
  // Use the correct image field
  const productImage = product.imageUrl || product.image;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: salePrice || price,
        image: productImage || '',
        sku: product.id,
        brand: product.brand || 'Brand'
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
    
    // Save to localStorage for persistence
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (isInWishlist) {
      const updatedWishlist = savedWishlist.filter((id: string) => id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      const updatedWishlist = [...savedWishlist, product.id];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view:', product.id);
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
            {productImage ? (
              <img
                src={productImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {/* Loading skeleton */}
            {!imageLoaded && productImage && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {salePrice && (
                <Badge variant="destructive" className="text-xs font-bold animate-pulse">
                  -{discountPercent}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-green-500 text-white text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
              {!isInStock && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Hover Actions */}
            <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Add to Cart - Bottom Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}>
              <Button
                size="sm"
                className="w-full bg-white text-black hover:bg-gray-100"
                onClick={handleAddToCart}
                disabled={!isInStock || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-4 space-y-2">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= (product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                )}
              </div>
            )}

            {/* Price */}
            <PriceDisplay 
              price={salePrice || price}
              originalPrice={salePrice ? price : undefined}
              size="sm"
              className="font-bold"
            />
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}