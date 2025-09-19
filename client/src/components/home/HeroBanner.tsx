import React from 'react';
import { Link } from 'wouter';
import { ShoppingBag, TrendingUp, Star, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  reducedWidth?: boolean;
}

export function HeroBanner({ reducedWidth = false }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      {/* Content */}
      <div className={`relative px-6 py-12 md:py-16 lg:py-20 ${reducedWidth ? 'max-w-4xl' : 'max-w-7xl'} mx-auto`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-white space-y-6">
            <div className="flex items-center space-x-2 text-yellow-300">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Featured Deal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Amazing
              <span className="block text-yellow-300">Products Today</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-lg">
              Shop the latest trends and best deals across thousands of premium products. 
              Quality guaranteed with fast shipping.
            </p>
            
            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>50K+ Products</span>
              </div>
              <div className="text-green-300">
                <span>Free Shipping</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/deals"
                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                View Deals
              </Link>
            </div>
          </div>
          
          {/* Visual Content */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Shopping</h3>
                <p className="text-blue-100 text-sm">
                  Experience the best online shopping with curated products and exceptional service.
                </p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-4 md:h-6 text-gray-50 dark:text-gray-900" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
}