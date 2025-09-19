import React, { useState, useMemo } from 'react';
import { Star, User, CheckCircle, Camera, Filter, Search, SortAsc, Image, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Review } from '@shared/schema';

interface ReviewsListProps {
  productId: string;
  reviews?: Review[];
}

export function ReviewsList({ productId, reviews = [] }: ReviewsListProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // If no reviews exist, show clean empty state
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No reviews yet for this product
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to write a review!
        </p>
      </div>
    );
  }

  // Enhanced filtering and sorting with useMemo for performance
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(review => 
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filters
    if (filterBy === 'verified') {
      result = result.filter(review => review.isVerifiedPurchase);
    } else if (filterBy === 'photos') {
      result = result.filter(review => review.platformSpecificData?.hasPhotos);
    } else if (filterBy === 'positive') {
      result = result.filter(review => review.rating >= 4);
    } else if (filterBy === 'critical') {
      result = result.filter(review => review.rating <= 2);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, searchTerm, filterBy, sortBy]);

  return (
    <div className="space-y-6">
      {/* Enhanced Filter and Sort Controls */}
      <Card className="border-2 border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-200 dark:border-gray-700 focus:border-yellow-400 dark:focus:border-yellow-500"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] border-2 border-gray-200 dark:border-gray-700 focus:border-yellow-400">
                    <SortAsc className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>

                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[160px] border-2 border-gray-200 dark:border-gray-700 focus:border-yellow-400">
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Show All</SelectItem>
                    <SelectItem value="verified">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                        Verified Only
                      </div>
                    </SelectItem>
                    <SelectItem value="photos">
                      <div className="flex items-center">
                        <Image className="w-4 h-4 mr-2 text-green-500" />
                        With Photos
                      </div>
                    </SelectItem>
                    <SelectItem value="positive">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        Positive (4-5⭐)
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center">
                        <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
                        Critical (1-2⭐)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results Counter */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <User className="w-4 h-4" />
              <span>{filteredAndSortedReviews.length} of {reviews.length} reviews</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <Card 
            key={review.id} 
            className="border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-all duration-200 hover:shadow-md"
          >
            <CardContent className="p-4">
              {/* Compact Review Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Top Row: Name, Badges, Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {review.reviewerName || 'Anonymous'}
                      </span>
                      {review.isVerifiedPurchase && (
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {review.platformSpecificData?.hasPhotos && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                          <Camera className="w-3 h-3 mr-1" />
                          Photos
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {review.reviewDate && !isNaN(new Date(review.reviewDate).getTime()) 
                        ? new Date(review.reviewDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Recent'
                      }
                    </span>
                  </div>
                  
                  {/* Rating Row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="ml-13">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {review.content || 'This customer left a rating without written feedback.'}
                </p>
                
                {/* Show more for long reviews */}
                {review.content && review.content.length > 200 && (
                  <button className="text-yellow-600 hover:text-yellow-700 text-xs mt-2 font-medium">
                    Read more
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Reviews */}
      {filteredAndSortedReviews.length < reviews.length && (
        <div className="text-center pt-6">
          <Button variant="outline" className="px-6 py-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20">
            Load More Reviews ({reviews.length - filteredAndSortedReviews.length} remaining)
          </Button>
        </div>
      )}
      
      {/* No Results Message */}
      {filteredAndSortedReviews.length === 0 && reviews.length > 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reviews match your filters
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filter criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
}