'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  X,
  RefreshCw
} from 'lucide-react'

// Add TypeScript interfaces
interface Category {
  id: string
  name: string
  slug: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug?: string
  description: string
  price: number
  originalPrice?: number
  sku: string
  categoryId: string
  subcategoryId?: string
  stockQuantity: number
  isNew: boolean
  isSale: boolean
  isFeatured: boolean
  isActive: boolean
  weight?: number
  dimensions?: string
  materials?: string
  careInstructions?: string
  seoTitle?: string
  seoDescription?: string
  createdAt?: number // Add createdAt to Product interface
  images: string[]
}

interface ProductForm {
  name: string
  description: string
  price: string
  originalPrice: string
  sku: string
  categoryId: string
  subcategoryId: string
  stockQuantity: string
  isNew: boolean
  isSale: boolean
  isFeatured: boolean
  isActive: boolean
  weight: string
  dimensions: string
  materials: string
  careInstructions: string
  seoTitle: string
  seoDescription: string
  images: string[]
}

// SKU generation function
const generateSKU = (productName: string): string => {
  const prefix = productName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 3)
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}-${timestamp}`
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ searchTerm: '', selectedCategory: '' })
  const [appliedFilters, setAppliedFilters] = useState({ searchTerm: '', selectedCategory: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '0',
    originalPrice: '0',
    sku: '',
    categoryId: '',
    subcategoryId: '',
    stockQuantity: '10',
    isNew: false,
    isSale: false,
    isFeatured: false,
    isActive: true,
    weight: '',
    dimensions: '',
    materials: '',
    careInstructions: '',
    seoTitle: '',
    seoDescription: '',
    images: []
  })

  // Get selected category object
  const selectedCategoryObj = categories.find(cat => cat.id === productForm.categoryId)
  const availableSubcategories = selectedCategoryObj?.subcategories || []

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: appliedFilters.searchTerm,
        category: appliedFilters.selectedCategory
      })

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data) // Debug log
        console.log('Pagination data:', data.pagination) // Debug log
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
        console.log('Setting totalPages to:', data.pagination.totalPages) // Debug log
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, appliedFilters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleFilter = () => {
    setCurrentPage(1)
    setAppliedFilters(filters)
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken')

      // Generate SKU if not provided
      const sku = productForm.sku || generateSKU(productForm.name)

      console.log('Creating product with data:', { ...productForm, sku })

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...productForm, sku })
      })

      console.log('Create response status:', response.status)
      console.log('Create response headers:', response.headers)

      if (response.ok) {
        const newProduct = await response.json()
        console.log('Product created successfully:', newProduct)

        setShowProductModal(false)
        resetForm()
        fetchProducts()

        // Show success message
        alert('Product created successfully!')
      } else {
        // Get detailed error information
        const errorText = await response.text()
        console.error('Create failed - Status:', response.status)
        console.error('Create failed - Response:', errorText)

        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorData.message || 'Unknown error'
          console.error('Parsed error data:', errorData)
        } catch (e) {
          errorMessage = errorText || 'Server error'
          console.error('Could not parse error response as JSON:', e)
        }

        alert(`Failed to create product: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Network or other error creating product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`An error occurred while creating the product: ${errorMessage}`)
    }
  }

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      // Prepare data for backend
      const now = Math.floor(Date.now() / 1000)
      const updateData = {
        ...productForm,
        images: JSON.stringify(productForm.images),
        isNew: productForm.isNew ? 1 : 0,
        isSale: productForm.isSale ? 1 : 0,
        isFeatured: productForm.isFeatured ? 1 : 0,
        isActive: productForm.isActive ? 1 : 0,
        inStock: Number(productForm.stockQuantity) > 0 ? 1 : 0,
        slug: productForm.name.toLowerCase().replace(/\s+/g, '-'), // Ensure slug is generated
        updatedAt: now,
        createdAt: editingProduct?.createdAt || now, // Ensure createdAt is always sent
        // Only include fields that exist in the schema
      }
      // Only keep fields that are in the schema
      const allowedFields = [
        'name', 'slug', 'description', 'price', 'originalPrice', 'sku', 'images', 'inStock',
        'stockQuantity', 'isNew', 'isSale', 'isFeatured', 'isActive', 'categoryId', 'subcategoryId',
        'weight', 'dimensions', 'materials', 'careInstructions', 'seoTitle', 'seoDescription',
        'createdAt', 'updatedAt'
      ]
      const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
      )
      const response = await fetch(`/api/admin/products/${editingProduct?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filteredUpdateData)
      })

      if (response.ok) {
        await response.json() // Response processed but not stored

        setShowProductModal(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()

        // Show success message (you can add a toast notification here)
        alert('Product updated successfully!')
      } else {
        const errorData = await response.json()
        console.error('Update failed:', errorData)
        alert(`Failed to update product: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('An error occurred while updating the product. Please try again.')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          alert('Product deleted successfully!')
          fetchProducts()
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          alert(`Failed to delete product: ${errorData.error || 'Unknown server error'}`)
          console.error('Error deleting product:', errorData)
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('An error occurred while deleting the product.')
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'products')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, data.url]
        }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '0',
      originalPrice: '0',
      sku: '',
      categoryId: '',
      subcategoryId: '',
      stockQuantity: '10',
      isNew: false,
      isSale: false,
      isFeatured: false,
      isActive: true,
      weight: '',
      dimensions: '',
      materials: '',
      careInstructions: '',
      seoTitle: '',
      seoDescription: '',
      images: []
    })
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      sku: product.sku || '',
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId || '',
      stockQuantity: product.stockQuantity.toString(),
      isNew: product.isNew,
      isSale: product.isSale,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      weight: product.weight?.toString() || '',
      dimensions: product.dimensions || '',
      materials: product.materials || '',
      careInstructions: product.careInstructions || '',
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      images: product.images || []
    })
    setShowProductModal(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                        value={productForm.categoryId}
                        onValueChange={(value) => setProductForm(prev => ({
                          ...prev,
                          categoryId: value,
                          subcategoryId: '' // Reset subcategory when category changes
                        }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subcategory Selection - Only show if category is selected */}
                  {productForm.categoryId && availableSubcategories.length > 0 && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select
                            value={productForm.subcategoryId}
                            onValueChange={(value) => setProductForm(prev => ({...prev, subcategoryId: value === 'none' ? '' : value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No subcategory</SelectItem>
                            {availableSubcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id}>
                                  {subcategory.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">
                          Available subcategories for {selectedCategoryObj?.name}: {availableSubcategories.length}
                        </p>
                      </div>
                  )}

                  {/*<div className="space-y-2">*/}
                  {/*  <Label htmlFor="price">Price *</Label>*/}
                  {/*  <Input*/}
                  {/*      id="price"*/}
                  {/*      type="number"*/}
                  {/*      step="0.01"*/}
                  {/*      value={productForm.price}*/}
                  {/*      onChange={(e) => setProductForm(prev => ({...prev, price: e.target.value}))}*/}
                  {/*      placeholder="0.00"*/}
                  {/*  />*/}
                  {/*</div>*/}

                  {/*<div className="space-y-2">*/}
                  {/*  <Label htmlFor="originalPrice">Original Price</Label>*/}
                  {/*  <Input*/}
                  {/*      id="originalPrice"*/}
                  {/*      type="number"*/}
                  {/*      step="0.01"*/}
                  {/*      value={productForm.originalPrice}*/}
                  {/*      onChange={(e) => setProductForm(prev => ({...prev, originalPrice: e.target.value}))}*/}
                  {/*      placeholder="0.00"*/}
                  {/*  />*/}
                  {/*</div>*/}

                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                        id="stockQuantity"
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm(prev => ({...prev, stockQuantity: e.target.value}))}
                        placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <div className="flex gap-2">
                      <Input
                          id="sku"
                          value={productForm.sku}
                          onChange={(e) => setProductForm(prev => ({...prev, sku: e.target.value}))}
                          placeholder="Auto-generated or enter custom SKU"
                      />
                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (productForm.name) {
                              const newSku = generateSKU(productForm.name)
                              setProductForm(prev => ({...prev, sku: newSku}))
                            } else {
                              alert('Please enter a product name first')
                            }
                          }}
                          title="Generate SKU from product name"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      SKU will be auto-generated when creating the product if left empty
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({...prev, description: e.target.value}))}
                      placeholder="Enter product description"
                      rows={4}
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploadingImage}
                    />
                    <label htmlFor="image-upload" className={`cursor-pointer ${isUploadingImage ? 'opacity-50' : ''}`}>
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">
                          {isUploadingImage ? 'Uploading, please wait...' : 'Click to upload images'}
                        </p>
                      </div>
                    </label>

                    {productForm.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {productForm.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
                </div>

                {/* Product Flags */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                        id="isNew"
                        checked={productForm.isNew}
                        onCheckedChange={(checked) => setProductForm(prev => ({...prev, isNew: checked}))}
                    />
                    <Label htmlFor="isNew">New Product</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                        id="isSale"
                        checked={productForm.isSale}
                        onCheckedChange={(checked) => setProductForm(prev => ({...prev, isSale: checked}))}
                    />
                    <Label htmlFor="isSale">On Sale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                        id="isFeatured"
                        checked={productForm.isFeatured}
                        onCheckedChange={(checked) => setProductForm(prev => ({...prev, isFeatured: checked}))}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                        id="isActive"
                        checked={productForm.isActive}
                        onCheckedChange={(checked) => setProductForm(prev => ({...prev, isActive: checked}))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                      variant="outline"
                      onClick={() => {
                        setShowProductModal(false)
                        setEditingProduct(null)
                        resetForm()
                      }}
                  >
                    Cancel
                  </Button>
                  <Button
                      onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                      disabled={!productForm.name || !productForm.description || !productForm.price || !productForm.categoryId}
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                      placeholder="Search products..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="pl-10"
                  />
                </div>
              </div>
              <Select 
                value={filters.selectedCategory} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, selectedCategory: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleFilter}>Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="text-center py-8">Loading products...</div>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {product.images?.[0] && product.images[0] !== 'null' && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                )}
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category?.name}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {product.isActive && <Badge variant="secondary">Active</Badge>}
                                {product.isNew && <Badge>New</Badge>}
                                {product.isSale && <Badge variant="destructive">Sale</Badge>}
                                {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => window.open(`/product/${product.id}`, '_blank')}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => openEditModal(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteProduct(product.id)}
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

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(idx + 1)}
                  style={{ margin: '0 4px' }}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
