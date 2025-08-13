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
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Mail,
  Calendar,
  ShoppingBag
} from 'lucide-react'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [tradeFilter, setTradeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    role: 'USER',
    isTradeCustomer: false
  })

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchTerm, roleFilter, tradeFilter])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        role: roleFilter === 'all' ? '' : roleFilter,
        isTradeCustomer: tradeFilter === 'all' ? '' : tradeFilter
      })

      const response = await fetch(`/api/admin/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedCustomer(data)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
    }
  }

  const handleUpdateCustomer = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(customerForm)
      })

      if (response.ok) {
        setShowCustomerModal(false)
        setEditingCustomer(null)
        resetForm()
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/customers/${customerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          fetchCustomers()
        }
      } catch (error) {
        console.error('Error deleting customer:', error)
      }
    }
  }

  const resetForm = () => {
    setCustomerForm({
      name: '',
      email: '',
      role: 'USER',
      isTradeCustomer: false
    })
  }

  const openEditModal = (customer: any) => {
    setEditingCustomer(customer)
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      role: customer.role,
      isTradeCustomer: customer.isTradeCustomer
    })
    setShowCustomerModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800'
      case 'ADMIN': return 'bg-blue-100 text-blue-800'
      case 'USER': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers Management</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="true">Trade Customers</SelectItem>
                <SelectItem value="false">Regular Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer: any) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(customer.role)}>
                          {customer.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.isTradeCustomer ? (
                          <Badge variant="outline">Trade Customer</Badge>
                        ) : (
                          <Badge variant="secondary">Regular Customer</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{customer._count?.orders || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(customer.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchCustomerDetails(customer.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditModal(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">No customers found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm(prev => ({...prev, email: e.target.value}))}
                placeholder="Enter email address"
                disabled // Usually emails shouldn't be changed
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={customerForm.role}
                onValueChange={(value) => setCustomerForm(prev => ({...prev, role: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isTradeCustomer"
                checked={customerForm.isTradeCustomer}
                onCheckedChange={(checked) => setCustomerForm(prev => ({...prev, isTradeCustomer: checked}))}
              />
              <Label htmlFor="isTradeCustomer">Trade Customer</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomerModal(false)
                  setEditingCustomer(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCustomer}
                disabled={!customerForm.name || !customerForm.email}
              >
                Update Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {selectedCustomer.name}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Role:</strong> {selectedCustomer.role}</p>
                    <p><strong>Type:</strong> {selectedCustomer.isTradeCustomer ? 'Trade Customer' : 'Regular Customer'}</p>
                    <p><strong>Joined:</strong> {formatDate(selectedCustomer.createdAt)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Total Orders:</strong> {selectedCustomer.orders?.length || 0}</p>
                    <p><strong>Total Reviews:</strong> {selectedCustomer.reviews?.length || 0}</p>
                    <p><strong>Last Order:</strong> {selectedCustomer.orders?.[0] ? formatDate(selectedCustomer.orders[0].createdAt) : 'No orders yet'}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCustomer.orders.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                            <Badge className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
