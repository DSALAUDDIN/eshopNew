'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Star, Eye, Check, X, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  customerName: string
  customerEmail: string
  isApproved: boolean
  createdAt: string
  product: {
    name: string
    id: string
  }
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchReviews()
  }, [activeTab])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')

      console.log('Fetching reviews with token:', token ? 'Token exists' : 'No token found')
      console.log('Fetching from URL:', `/api/admin/reviews?status=${activeTab}`)

      const response = await fetch(`/api/admin/reviews?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('Reviews data received:', data)
        setReviews(data.reviews)
      } else {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        toast({
          title: "Error",
          description: `Failed to fetch reviews: ${response.status}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string) => {
    setProcessingId(reviewId)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: true })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review approved successfully"
        })
        fetchReviews()
      } else {
        toast({
          title: "Error",
          description: "Failed to approve review",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (reviewId: string) => {
    setProcessingId(reviewId)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: false })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review rejected successfully"
        })
        fetchReviews()
      } else {
        toast({
          title: "Error",
          description: "Failed to reject review",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    setProcessingId(reviewId)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review deleted successfully"
        })
        fetchReviews()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete review",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  const viewReview = (review: Review) => {
    setSelectedReview(review)
    setShowViewModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800">Approved</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    )
  }

  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Review Management</h1>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Review Management</h1>
        <Button onClick={fetchReviews} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="approved">Approved Reviews</TabsTrigger>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'pending' && 'Pending Reviews'}
                {activeTab === 'approved' && 'Approved Reviews'}
                {activeTab === 'all' && 'All Reviews'}
                <span className="ml-2 text-sm text-gray-500">({reviews.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="font-medium">{review.product.name}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{review.customerName}</div>
                              <div className="text-sm text-gray-500">{review.customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StarDisplay rating={review.rating} />
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              {review.title && (
                                <div className="font-medium mb-1">{review.title}</div>
                              )}
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {review.comment}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(review.isApproved)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(review.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewReview(review)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {!review.isApproved && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(review.id)}
                                  disabled={processingId === review.id}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}

                              {review.isApproved && (
                                <Button
                                  size="sm"
                                  onClick={() => handleReject(review.id)}
                                  disabled={processingId === review.id}
                                  variant="outline"
                                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(review.id)}
                                disabled={processingId === review.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Review Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedReview.product.name}</h3>
                <p className="text-gray-600">Product Review</p>
              </div>

              <div className="flex items-center gap-4">
                <StarDisplay rating={selectedReview.rating} />
                <span className="text-sm text-gray-600">
                  {selectedReview.rating} out of 5 stars
                </span>
                {getStatusBadge(selectedReview.isApproved)}
              </div>

              {selectedReview.title && (
                <div>
                  <h4 className="font-medium mb-1">Title:</h4>
                  <p>{selectedReview.title}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-1">Review:</h4>
                <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium mb-1">Customer:</h4>
                  <p>{selectedReview.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedReview.customerEmail}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Date:</h4>
                  <p>{formatDate(selectedReview.createdAt)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
            {selectedReview && !selectedReview.isApproved && (
              <Button
                onClick={() => {
                  handleApprove(selectedReview.id)
                  setShowViewModal(false)
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
