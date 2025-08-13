'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Search,
  Eye,
  Edit,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string
    price: number
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: number
  shippingAmount: number
  shippingAddress: string
  billingAddress: string
  notes: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
}

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'REFUNDED', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
]

const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'REFUNDED', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: '',
    paymentStatus: '',
    notes: ''
  })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams()

      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
      if (paymentFilter && paymentFilter !== 'all') params.append('paymentStatus', paymentFilter)
      if (searchTerm.trim()) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || data) // Handle both paginated and direct response formats
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order)
    setUpdateForm({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes || ''
    })
    setShowUpdateModal(true)
  }

  const updateOrderStatus = async () => {
    if (!selectedOrder) return

    setUpdating(true)
    try {
      console.log('Updating order:', selectedOrder.id, 'with data:', updateForm)

      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      })

      console.log('Update response status:', response.status)

      if (response.ok) {
        const updatedOrder = await response.json()
        console.log('Order updated successfully:', updatedOrder)

        toast({
          title: "Success",
          description: "Order updated successfully",
        })
        setShowUpdateModal(false)
        fetchOrders()
      } else {
        const errorText = await response.text()
        console.error('Update error response:', errorText)

        let errorMessage = "Failed to update order"
        try {
          const error = JSON.parse(errorText)
          errorMessage = error.error || error.message || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Network or other error during update:', error)
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }

  const quickUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Order ${newStatus.toLowerCase()} successfully`,
        })
        fetchOrders()
      } else {
        toast({
          title: "Error",
          description: "Failed to update order",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      })
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order deleted successfully",
        })
        fetchOrders()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      })
    }
  }

  const exportOrders = () => {
    // Create CSV export
    const headers = ['Order Number', 'Customer', 'Email', 'Phone', 'Status', 'Payment Status', 'Total', 'Date']
    const csvData = orders.map(order => [
      order.orderNumber,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.status,
      order.paymentStatus,
      `৳${order.totalAmount}`,
      new Date(order.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string, type: 'order' | 'payment' = 'order') => {
    const statuses = type === 'order' ? ORDER_STATUSES : PAYMENT_STATUSES
    const statusConfig = statuses.find(s => s.value === status)
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  const getPendingOrdersCount = () => orders.filter(order => order.status === 'PENDING').length
  const getTotalRevenue = () => orders
    .filter(order => !['CANCELLED', 'REFUNDED'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0)
  const getActiveOrdersCount = () => orders.filter(order => !['CANCELLED', 'REFUNDED'].includes(order.status)).length
  const getThisMonthOrdersCount = () => orders.filter(order => 
    new Date(order.createdAt).getMonth() === new Date().getMonth() && 
    !['CANCELLED', 'REFUNDED'].includes(order.status)
  ).length

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, paymentFilter])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
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
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex gap-3">
          <Button onClick={fetchOrders} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportOrders} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{getActiveOrdersCount()}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{getPendingOrdersCount()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">৳{getTotalRevenue().toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{getThisMonthOrdersCount()}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Order number, customer name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="statusFilter">Order Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentFilter">Payment Status</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payments</SelectItem>
                  {PAYMENT_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setPaymentFilter('')
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const orderStatus = getStatusBadge(order.status, 'order')
                  const paymentStatus = getStatusBadge(order.paymentStatus, 'payment')

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={orderStatus.color}>
                          {orderStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatus.color}>
                          {paymentStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">৳{order.totalAmount.toFixed(0)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openOrderDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openUpdateModal(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {order.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => quickUpdateStatus(order.id, 'CONFIRMED')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => quickUpdateStatus(order.id, 'CANCELLED')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusBadge(selectedOrder.status, 'order').color}>
                        {getStatusBadge(selectedOrder.status, 'order').label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <Badge className={getStatusBadge(selectedOrder.paymentStatus, 'payment').color}>
                        {getStatusBadge(selectedOrder.paymentStatus, 'payment').label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span>{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    try {
                      const address = JSON.parse(selectedOrder.shippingAddress)
                      return (
                        <div>
                          <p>{address.address}</p>
                          <p>{address.city}, {address.postalCode}</p>
                          <p>{address.country}</p>
                        </div>
                      )
                    } catch {
                      return <p>{selectedOrder.shippingAddress}</p>
                    }
                  })()}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Image
                          src={item.product.image || '/placeholder.jpg'}
                          alt={item.product.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500">৳{item.price} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">৳{(item.price * item.quantity).toFixed(0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>৳{(selectedOrder.totalAmount - selectedOrder.shippingAmount).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>৳{selectedOrder.shippingAmount.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>৳{selectedOrder.totalAmount.toFixed(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Order Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Update the order status, payment status, and add internal notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="orderStatus">Order Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={updateForm.paymentStatus}
                onValueChange={(value) => setUpdateForm(prev => ({ ...prev, paymentStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={updateForm.notes}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add internal notes about this order..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button onClick={updateOrderStatus} disabled={updating}>
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
