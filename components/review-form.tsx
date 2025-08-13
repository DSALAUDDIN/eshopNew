'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'
import { useStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface ReviewFormProps {
  productId: string
  productName: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const { user } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    customerName: user?.name || '',
    customerEmail: user?.email || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive"
      })
      return
    }

    if (!formData.comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment about the product.",
        variant: "destructive"
      })
      return
    }

    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      toast({
        title: "Contact Information Required",
        description: "Please provide your name and email address.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          userId: user?.id
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Review Submitted!",
          description: "Thank you for your review! It will be visible after admin approval.",
        })

        // Reset form
        setFormData({
          rating: 0,
          title: '',
          comment: '',
          customerName: user?.name || '',
          customerEmail: user?.email || ''
        })

        onSuccess?.()
      } else {
        toast({
          title: "Submission Failed",
          description: data.error || "Failed to submit review. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const StarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className="transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= formData.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Select rating'}
        </span>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Write a Review for {productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium">Rating *</Label>
            <div className="mt-2">
              <StarRating />
            </div>
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Great product!"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              placeholder="Tell others about your experience with this product..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="mt-1"
              required
            />
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter your name"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Your Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="Enter your email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting Review...
              </div>
            ) : (
              'Submit Review'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your review will be visible after admin approval. Please allow 1-2 business days for review.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
