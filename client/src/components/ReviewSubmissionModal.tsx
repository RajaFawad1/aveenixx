import React, { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ReviewSubmissionModalProps {
  productId: string;
  productName: string;
  children: React.ReactNode;
}

export function ReviewSubmissionModal({ productId, productName, children }: ReviewSubmissionModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating for your review.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters for your review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual review submission API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Review Submitted!",
        description: "Thank you for your review. It will appear after moderation.",
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setOpen(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Write a Review for {productName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Overall Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review-comment" className="text-sm font-medium">
              Your Review
            </Label>
            <Textarea
              id="review-comment"
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum 10 characters ({comment.length}/10)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}