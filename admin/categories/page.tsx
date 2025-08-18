'use client'

import { useState, useEffect, ChangeEvent } from 'react'
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
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  FolderTree,
  Eye,
  ArrowLeft,
  FolderOpen,
} from 'lucide-react'
// Import the type definitions from the updated file
import type { Category, Subcategory } from '@/lib/categories'

// --- TYPE DEFINITIONS ---

// This form type is derived from the main Category interface.
type CategoryForm = Omit<Category, 'id' | 'slug' | 'subcategories' | '_count'> & {
  image: string | null;
};

type SubcategoryForm = Omit<Subcategory, 'id' | 'slug' | '_count'> & {
  description: string
  image: string
  isActive: boolean
}

// --- COMPONENT ---

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
      null
  )
  const [viewMode, setViewMode] = useState<'categories' | 'subcategories'>(
      'categories'
  )

  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    description: '',
    image: '',
    isActive: true,
  })

  // This state is defined but its corresponding modal/UI is not fully implemented in the original code.
  // It is kept here for completeness based on the original structure.
  const [subcategoryForm, setSubcategoryForm] = useState<SubcategoryForm>({
    name: '',
    description: '',
    image: '',
    categoryId: '',
    isActive: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [searchTerm])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data: Category[] = await response.json()
        let filteredData = data

        if (searchTerm) {
          filteredData = data.filter(
              (category: Category) =>
                  category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  category.description
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
          )
        }
        setCategories(filteredData)
      } else {
        throw new Error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([]) // Clear categories on error
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      })

      if (response.ok) {
        setShowCategoryModal(false)
        resetCategoryForm()
        fetchCategories() // Refresh data
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
          `/api/admin/categories/${editingCategory.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(categoryForm),
          }
      )

      if (response.ok) {
        setShowCategoryModal(false)
        setEditingCategory(null)
        resetCategoryForm()
        fetchCategories() // Refresh data

        if (categoryForm.image !== editingCategory.image) {
          alert(
              'Category image updated successfully! The thumbnail will refresh automatically on the category page.'
          )
        }
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (
        confirm(
            'Are you sure you want to delete this category? This will also delete all associated subcategories and products.'
        )
    ) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchCategories() // Refresh data
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleImageUpload = async (
      file: File,
      type: 'category' | 'subcategory'
  ) => {
    const token = localStorage.getItem('adminToken')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'categories')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'category') {
          setCategoryForm(prev => ({ ...prev, image: data.url }))
        } else {
          setSubcategoryForm(prev => ({ ...prev, image: data.url }))
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      image: '',
      isActive: true,
    })
  }

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive,
    })
    setShowCategoryModal(true)
  }

  const handleViewSubcategories = (category: Category) => {
    setSelectedCategory(category)
    setViewMode('subcategories')
  }

  const handleBackToCategories = () => {
    setViewMode('categories')
    setSelectedCategory(null)
  }

  const renderSubcategoriesView = () => {
    if (!selectedCategory) return null

    // Get subcategories directly from the selected category object
    const subcategories = selectedCategory.subcategories || []

    return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToCategories}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedCategory.name} Subcategories
              </h2>
              <p className="text-gray-600">
                Manage subcategories for {selectedCategory.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map(subcategory => (
                <Card
                    key={subcategory.id}
                    className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    {getSubcategoryIcon(subcategory.slug)}
                  </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {subcategory.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Slug: {subcategory.slug}
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {subcategories.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No subcategories found
                  </h3>
                  <p className="text-gray-500">
                    This category doesn't have any subcategories.
                  </p>
                </CardContent>
              </Card>
          )}
        </div>
    )
  }

  // Helper function to get subcategory icons
  const getSubcategoryIcon = (slug: string) => {
    const iconMap: Record<string, string> = {
      // Add your slug-to-icon mappings here
      "mens": "👨", "womens": "👩", "kids-fashion": "👶",
      "room-decor": "🏠", "kitchen-dining": "🍽️",
    }
    return iconMap[slug] || '📦'
  }

  if (viewMode === 'subcategories') {
    return <div className="p-6 space-y-6">{renderSubcategoriesView()}</div>
  }

  return (
      <div className="p-6 space-y-6">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold truncate">Categories Management</h1>
          </div>
          <div className="flex flex-row gap-2 flex-shrink-0 ml-4">
            <Button
              variant="outline"
              onClick={fetchCategories}
              className="border-gray-300 shadow-sm"
            >
              Refresh Categories
            </Button>
            <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
              <DialogTrigger asChild>
                <Button
                    onClick={() => {
                      setEditingCategory(null)
                      resetCategoryForm()
                    }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                        id="name"
                        value={categoryForm.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCategoryForm(prev => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Enter category name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={categoryForm.description || ''}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setCategoryForm(prev => ({
                              ...prev,
                              description: e.target.value,
                            }))
                        }
                        placeholder="Enter category description"
                        rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                          type="file"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, 'category')
                          }}
                          className="hidden"
                          id="category-image-upload"
                      />
                      <label
                          htmlFor="category-image-upload"
                          className="cursor-pointer"
                      >
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">
                          Click to upload category image
                        </p>
                      </label>

                      {categoryForm.image && (
                          <div className="mt-4 relative inline-block">
                            <img
                                src={categoryForm.image}
                                alt="Category Preview"
                                className="w-32 h-32 object-cover rounded border"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setCategoryForm(prev => ({ ...prev, image: '' }))
                                }
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                        id="isActive"
                        checked={categoryForm.isActive}
                        onCheckedChange={(checked: boolean) =>
                            setCategoryForm(prev => ({ ...prev, isActive: checked }))
                        }
                    />
                    <Label htmlFor="isActive">Active Category</Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                          setShowCategoryModal(false)
                          setEditingCategory(null)
                        }}
                    >
                      Cancel
                    </Button>
                    <Button
                        onClick={
                          editingCategory
                              ? handleUpdateCategory
                              : handleCreateCategory
                        }
                        disabled={!categoryForm.name || loading}
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                  placeholder="Search by category name or description..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                  }
                  className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="text-center py-8">Loading categories...</div>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Subcategories</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category: Category) => {
                        // Get subcategories directly from the category object
                        const subcategories = category.subcategories || []
                        return (
                            <TableRow key={category.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {category.image ? (
                                      <img
                                          src={category.image}
                                          alt={category.name}
                                          className="w-12 h-12 object-cover rounded"
                                      />
                                  ) : (
                                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                        <FolderTree className="h-6 w-6 text-gray-400" />
                                      </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{category.name}</p>
                                    <p className="text-sm text-gray-500">
                                      Slug: {category.slug}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-gray-600 max-w-xs truncate">
                                  {category.description || 'No description'}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {category._count?.products || 0} products
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {subcategories.length} subcategories
                                  </Badge>
                                  {subcategories.length > 0 && (
                                      <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleViewSubcategories(category)}
                                          className="text-blue-600 hover:text-blue-800"
                                      >
                                        <FolderOpen className="h-4 w-4 mr-1" />
                                        View
                                      </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                    variant={
                                      category.isActive ? 'default' : 'secondary'
                                    }
                                >
                                  {category.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openEditCategoryModal(category)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteCategory(category.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                        )
                      })}
                      {categories.length === 0 && !loading && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <FolderTree className="h-12 w-12 text-gray-400" />
                                <p className="text-gray-500">No categories found</p>
                                <Button
                                    size="sm"
                                    onClick={() => setShowCategoryModal(true)}
                                >
                                  Create your first category
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}