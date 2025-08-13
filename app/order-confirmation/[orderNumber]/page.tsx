'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface OrderConfirmationProps {
  params: {
    orderNumber: string
  }
}

interface OrderDetails {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  totalAmount: number
  shippingAmount: number
  paymentMethod: string
  shippingAddress: any
  billingAddress: any
  notes: string
  createdAt: string
  orderItems: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image: string
      price: number
    }
  }>
}

export default function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [params.orderNumber])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderNumber}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100'
      case 'PROCESSING': return 'text-purple-600 bg-purple-100'
      case 'SHIPPED': return 'text-indigo-600 bg-indigo-100'
      case 'DELIVERED': return 'text-green-600 bg-green-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Your order is pending approval from our team.'
      case 'CONFIRMED': return 'Your order has been confirmed and will be processed soon.'
      case 'PROCESSING': return 'Your order is being prepared for shipment.'
      case 'SHIPPED': return 'Your order has been shipped and is on its way.'
      case 'DELIVERED': return 'Your order has been successfully delivered.'
      case 'CANCELLED': return 'Your order has been cancelled.'
      default: return 'Order status updated.'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6EC1D1]"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    )
  }

  const shippingAddress = JSON.parse(order.shippingAddress)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
              <p className="text-green-700 mb-4">
                Thank you for your order. We've received your order and will process it soon.
              </p>
              <div className="bg-white rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{getStatusMessage(order.status)}</p>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Image
                          src={item.product.image || '/placeholder.jpg'}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Price: ৳{item.price.toFixed(0)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ৳{(item.price * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Delivery Address</p>
                        <p className="text-gray-700">
                          {shippingAddress.address}<br />
                          {shippingAddress.city}, {shippingAddress.postalCode}<br />
                          {shippingAddress.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-700">{order.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-700">{order.customerEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>৳{(order.totalAmount - order.shippingAmount).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{order.shippingAmount === 0 ? 'Free' : `৳${order.shippingAmount}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-[#6EC1D1]">৳{order.totalAmount.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Payment Method</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {order.paymentStatus}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t">
                    <Button 
                      onClick={() => window.print()} 
                      variant="outline" 
                      className="w-full"
                    >
                      Print Order
                    </Button>
                    <Button 
                      onClick={() => router.push('/')} 
                      className="w-full bg-[#6EC1D1] hover:bg-[#5AAFBF]"
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  {/* Contact Information */}
                  <div className="text-center text-sm text-gray-600 pt-4 border-t">
                    <p className="mb-2">Need help with your order?</p>
                    <Button variant="link" size="sm" onClick={() => router.push('/contact')}>
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
