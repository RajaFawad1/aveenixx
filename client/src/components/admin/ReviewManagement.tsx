import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, CheckCircle, XCircle, Clock, Eye, Search, Filter, RefreshCw, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Review {
  id: number;
  productId: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  title?: string;
  content: string;
  reviewDate: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  sourcePlatform: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderatedBy?: number;
  moderatedAt?: string;
  moderationReason?: string;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function ReviewManagement() {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<number>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch review statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/reviews/stats'],
    queryFn: () => apiRequest('/api/admin/reviews/stats'),
  });

  // Fetch reviews based on filter
  const { data: reviews = [], isLoading: reviewsLoading, refetch } = useQuery({
    queryKey: ['/api/admin/reviews', statusFilter, searchTerm],
    queryFn: () => apiRequest(`/api/admin/reviews?status=${statusFilter}&limit=50&offset=0`),
  });

  // Moderate single review
  const moderateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, action, reason }: { reviewId: number; action: 'approve' | 'reject'; reason?: string }) => {
      return apiRequest(`/api/admin/reviews/${reviewId}/moderate`, {
        method: 'PUT',
        body: JSON.stringify({ action, reason, moderatorId: 1 }), // TODO: Get real moderator ID
      });
    },
    onSuccess: () => {
      toast({
        title: 'Review Moderated',
        description: 'Review status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews/stats'] });
      setIsModalOpen(false);
      setSelectedReview(null);
      setModerationReason('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to moderate review.',
        variant: 'destructive',
      });
    },
  });

  const handleModerateReview = (review: Review, action: 'approve' | 'reject') => {
    if (action === 'reject' && !moderationReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for rejecting this review.',
        variant: 'destructive',
      });
      return;
    }

    moderateReviewMutation.mutate({
      reviewId: review.id,
      action,
      reason: action === 'reject' ? moderationReason : undefined,
    });
  };

  const handleBulkModeration = (action: 'approve' | 'reject') => {
    if (bulkSelected.size === 0) {
      toast({
        title: 'No Reviews Selected',
        description: 'Please select reviews to moderate.',
        variant: 'destructive',
      });
      return;
    }

    // Process each selected review
    bulkSelected.forEach(reviewId => {
      const review = reviews.find((r: Review) => r.id === reviewId);
      if (review) {
        moderateReviewMutation.mutate({
          reviewId,
          action,
          reason: action === 'reject' ? 'Bulk moderation' : undefined,
        });
      }
    });

    setBulkSelected(new Set());
  };

  const toggleBulkSelection = (reviewId: number) => {
    const newSelected = new Set(bulkSelected);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setBulkSelected(newSelected);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };

    const Icon = icons[status as keyof typeof icons] || Clock;

    return (
      <Badge className={`flex items-center space-x-1 ${variants[status as keyof typeof variants]}`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const filteredReviews = reviews.filter((review: Review) =>
    review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.productId.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {statsLoading ? '...' : stats?.pending || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved Reviews</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {statsLoading ? '...' : stats?.approved || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Reviews</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {statsLoading ? '...' : stats?.rejected || 0}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {statsLoading ? '...' : stats?.total || 0}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Review Management</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                disabled={reviewsLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews by reviewer, content, or product ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {bulkSelected.size > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {bulkSelected.size} review(s) selected
              </span>
              <Button
                size="sm"
                onClick={() => handleBulkModeration('approve')}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve All
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkModeration('reject')}
              >
                Reject All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkSelected(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Loading reviews...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No reviews found</p>
              </div>
            ) : (
              filteredReviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={bulkSelected.has(review.id)}
                        onChange={() => toggleBulkSelection(review.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-medium">{review.reviewerName}</span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                          {getStatusBadge(review.moderationStatus)}
                        </div>
                        
                        {review.title && (
                          <h4 className="font-semibold mb-1">{review.title}</h4>
                        )}
                        
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                          {review.content}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Product: {review.productId}</span>
                          <span>Date: {new Date(review.reviewDate).toLocaleDateString()}</span>
                          <span>Helpful: {review.helpfulCount}</span>
                          <span>Source: {review.sourcePlatform}</span>
                        </div>
                        
                        {review.moderationReason && (
                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-300">
                            <strong>Rejection Reason:</strong> {review.moderationReason}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {review.moderationStatus === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleModerateReview(review, 'approve')}
                            disabled={moderateReviewMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedReview(review);
                              setIsModalOpen(true);
                            }}
                            disabled={moderateReviewMutation.isPending}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReview(review);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Detail/Moderation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Reviewer:</strong> {selectedReview.reviewerName}
                </div>
                <div>
                  <strong>Rating:</strong> 
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <div>
                  <strong>Product ID:</strong> {selectedReview.productId}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(selectedReview.reviewDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Status:</strong> {getStatusBadge(selectedReview.moderationStatus)}
                </div>
                <div>
                  <strong>Source:</strong> {selectedReview.sourcePlatform}
                </div>
              </div>
              
              {selectedReview.title && (
                <div>
                  <strong>Title:</strong>
                  <p className="mt-1">{selectedReview.title}</p>
                </div>
              )}
              
              <div>
                <strong>Review Content:</strong>
                <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {selectedReview.content}
                </p>
              </div>
              
              {selectedReview.moderationStatus === 'pending' && (
                <div className="space-y-3">
                  <div>
                    <strong>Moderation Reason (for rejection):</strong>
                    <Textarea
                      value={moderationReason}
                      onChange={(e) => setModerationReason(e.target.value)}
                      placeholder="Enter reason for rejection (optional for approval)"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => handleModerateReview(selectedReview, 'approve')}
                      disabled={moderateReviewMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve Review
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleModerateReview(selectedReview, 'reject')}
                      disabled={moderateReviewMutation.isPending}
                    >
                      Reject Review
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}