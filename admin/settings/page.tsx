'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Switch } from '@/components/ui/switch'
import { Upload, Globe, Mail, DollarSign, FolderTree, Folder, FolderPlus, Edit, Trash2, Search } from 'lucide-react'

// Define interfaces for proper typing
interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  isActive: boolean;
}

interface Settings {
  site_name: string;
  site_description: string;
  site_logo: string;
  hero_banner: string;
  hero_carousel?: string[];
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  business_hours: string;
  currency: string;
  shipping_fee: string;
  free_shipping_threshold: string;
  tax_rate: string;
  delivery_days: string;
  express_delivery_fee: string;
  [key: string]: any; // Allow additional properties
}

export default function AdminSettings() {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFiles, setBannerFiles] = useState<File[]>([])
  const [logoPreview, setLogoPreview] = useState('')
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Category management state with proper types
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [categorySearchTerm, setCategorySearchTerm] = useState('')

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  })

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    categoryId: '',
    isActive: true
  })

  const [settings, setSettings] = useState<Settings>({
    // Branding
    site_name: 'Southern Fashion & Décor',
    site_description: 'Premium fashion and home décor collection',
    site_logo: '/placeholder-logo.png',
    hero_banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',

    // Contact Info
    contact_email: 'info@southernfashion.com',
    contact_phone: '+1 (555) 123-4567',
    contact_address: '123 Fashion Street, Style City, SC 12345',
    business_hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',

    // E-commerce
    currency: 'USD',
    shipping_fee: '10.00',
    free_shipping_threshold: '100.00',
    tax_rate: '0.08',

    // Other
    delivery_days: '3-5 business days',
    express_delivery_fee: '15.00'
  })

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Load current settings
  const loadSettings = async () => {
    try {
      console.log('🔄 Loading settings...')
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Settings loaded:', data)
        setSettings((prevSettings: Settings) => ({ ...prevSettings, ...data }))
        setLogoPreview(data.site_logo || '')
        setBannerPreviews([data.hero_banner || ''])
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error)
    }
  }

  // Handle input changes
  const handleInputChange = (key: string, value: string) => {
    setSettings((prev: Settings) => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('🖼️ Logo file selected:', file.name)
      setLogoFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle banner file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setBannerFiles(fileArray)

      const readers = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then(previews => {
        setBannerPreviews(previews)
      })
    }
  }

  // Save settings only (no images)
  const handleSaveSettings = async () => {
    setSaving(true)
    console.log('💾 Saving settings...')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        console.log('✅ Settings saved successfully!')
        alert('🎉 Settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      alert('❌ Error: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  // Upload images and save
  const handleSaveImages = async () => {
    setUploading(true)
    console.log('🚀 Starting image upload process...')

    try {
      let newSettings = { ...settings }

      // Upload logo if selected
      if (logoFile) {
        console.log('📤 Uploading logo...')
        const formData = new FormData()
        formData.append('file', logoFile)
        formData.append('type', 'logo')

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const result = await uploadResponse.json()
          console.log('✅ Logo uploaded:', result.url)
          newSettings.site_logo = result.url
        } else {
          throw new Error('Logo upload failed')
        }
      }

      // Upload banners if selected
      if (bannerFiles.length > 0) {
        console.log('📤 Uploading hero carousel images...')
        const formData = new FormData()
        bannerFiles.forEach((file) => {
          formData.append('hero_images', file)
        })

        const uploadResponse = await fetch('/api/admin/settings/hero', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const result = await uploadResponse.json()
          console.log('✅ Hero carousel uploaded:', result.heroImages)
          newSettings.hero_carousel = result.heroImages
          newSettings.hero_banner = result.heroImages[0] // Keep first image as fallback
        } else {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || 'Hero carousel upload failed')
        }
      }

      // Save all settings including new image URLs
      const saveResponse = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      })

      if (saveResponse.ok) {
        console.log('✅ Settings saved successfully!')
        setSettings(newSettings)

        // Clear form
        setLogoFile(null)
        setBannerFiles([])
        if (logoInputRef.current) logoInputRef.current.value = ''
        if (bannerInputRef.current) bannerInputRef.current.value = ''

        alert('🎉 Images and settings saved successfully! Please refresh the main page to see changes.')

        // Refresh settings across the app
        const { refreshSettings } = await import('@/lib/settings')
        refreshSettings()
      } else {
        throw new Error('Failed to save settings')
      }

    } catch (error) {
      console.error('❌ Save error:', error)
      alert('❌ Error: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  // Category management functions
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
        let filteredData = data

        if (categorySearchTerm) {
          filteredData = data.filter((category: Category) =>
            category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(categorySearchTerm.toLowerCase())
          )
        }

        setCategories(filteredData)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        console.log('✅ Category created successfully')
        setShowCategoryModal(false)
        resetCategoryForm()

        // Force refresh categories to show new images
        setCategoriesLoading(true)
        await fetchCategories()

        alert('✅ Category created successfully!')
      } else {
        const errorData = await response.json()
        alert(`❌ Error: ${errorData.error || 'Failed to create category'}`)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('❌ Error creating category')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory?.id) return
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        console.log('✅ Category updated successfully')
        setShowCategoryModal(false)
        setEditingCategory(null)
        resetCategoryForm()

        // Force refresh categories to show updated images
        setCategoriesLoading(true)
        await fetchCategories()

        alert('✅ Category updated successfully!')
      } else {
        const errorData = await response.json()
        alert(`❌ Error: ${errorData.error || 'Failed to update category'}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('❌ Error updating category')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all subcategories and may affect associated products.')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          fetchCategories()
          alert('✅ Category deleted successfully!')
        } else {
          const errorData = await response.json()
          alert(`❌ Error: ${errorData.error || 'Failed to delete category'}`)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('❌ Network error occurred while deleting category')
      }
    }
  }

  const handleCreateSubcategory = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subcategoryForm)
      })

      if (response.ok) {
        console.log('✅ Subcategory created successfully')
        setShowSubcategoryModal(false)
        resetSubcategoryForm()

        // Force refresh categories to show new subcategory images
        setCategoriesLoading(true)
        await fetchCategories()

        alert('✅ Subcategory created successfully!')
      } else {
        const errorData = await response.json()
        alert(`❌ Error: ${errorData.error || 'Failed to create subcategory'}`)
      }
    } catch (error) {
      console.error('Error creating subcategory:', error)
      alert('❌ Error creating subcategory')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategory?.id) return
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/categories/subcategories/${editingSubcategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subcategoryForm)
      })

      if (response.ok) {
        console.log('✅ Subcategory updated successfully')
        setShowSubcategoryModal(false)
        setEditingSubcategory(null)
        resetSubcategoryForm()

        // Force refresh categories to show updated subcategory images
        setCategoriesLoading(true)
        await fetchCategories()

        alert('✅ Subcategory updated successfully!')
      } else {
        const errorData = await response.json()
        alert(`❌ Error: ${errorData.error || 'Failed to update subcategory'}`)
      }
    } catch (error) {
      console.error('Error updating subcategory:', error)
      alert('❌ Error updating subcategory')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (confirm('Are you sure you want to delete this subcategory? This may affect associated products.')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/categories/subcategories/${subcategoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          fetchCategories()
          alert('✅ Subcategory deleted successfully!')
        } else {
          const errorData = await response.json()
          alert(`❌ Error: ${errorData.error || 'Failed to delete subcategory'}`)
        }
      } catch (error) {
        console.error('Error deleting subcategory:', error)
        alert('❌ Network error occurred while deleting subcategory')
      }
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      image: '',
      isActive: true
    })
  }

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      name: '',
      description: '',
      image: '',
      categoryId: '',
      isActive: true
    })
  }

  const openEditCategoryModal = (category: any) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive
    })
    setShowCategoryModal(true)
  }

  const openEditSubcategoryModal = (subcategory: any) => {
    setEditingSubcategory(subcategory)
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || '',
      image: subcategory.image || '',
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive
    })
    setShowSubcategoryModal(true)
  }

  // Load settings and categories on component mount
  useEffect(() => {
    loadSettings()
    fetchCategories()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Admin Settings</h1>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">🎨 Branding</TabsTrigger>
          <TabsTrigger value="site">🌐 Site Info</TabsTrigger>
          <TabsTrigger value="contact">📧 Contact</TabsTrigger>
          <TabsTrigger value="commerce">💰 E-commerce</TabsTrigger>
          <TabsTrigger value="categories">📂 Categories</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Branding & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Site Name and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      placeholder="Your Site Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_description">Site Description</Label>
                    <Input
                      id="site_description"
                      value={settings.site_description}
                      onChange={(e) => handleInputChange('site_description', e.target.value)}
                      placeholder="Your Site Description"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">🏷️ Site Logo</Label>

                    {logoPreview && (
                      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="max-h-20 mx-auto object-contain"
                        />
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mb-2"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Logo Image
                    </Button>

                    <Input
                      type="file"
                      accept="image/*"
                      ref={logoInputRef}
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    {logoFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ {logoFile.name} selected
                      </p>
                    )}
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">🖼️ Hero Banner</Label>

                    {bannerPreviews.length > 0 && (
                      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        {bannerPreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Banner Preview ${index + 1}`}
                            className="max-h-20 w-full object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mb-2"
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Banner Images
                    </Button>

                    <Input
                      type="file"
                      accept="image/*"
                      ref={bannerInputRef}
                      onChange={handleBannerChange}
                      className="hidden"
                      multiple
                    />

                    {bannerFiles.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ {bannerFiles.map(file => file.name).join(', ')} selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="text-center">
                  <Button
                    onClick={handleSaveImages}
                    disabled={uploading || (!logoFile && bannerFiles.length === 0)}
                    className="px-8 py-2 text-lg"
                    size="lg"
                  >
                    {uploading ? '⏳ Uploading Images...' : '💾 Save Images'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Info Tab */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Site Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site_name_2">Site Name</Label>
                  <Input
                    id="site_name_2"
                    value={settings.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="site_description_2">Site Description</Label>
                  <Textarea
                    id="site_description_2"
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Site Info'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_address">Address</Label>
                  <Textarea
                    id="contact_address"
                    value={settings.contact_address}
                    onChange={(e) => handleInputChange('contact_address', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="business_hours">Business Hours</Label>
                  <Input
                    id="business_hours"
                    value={settings.business_hours}
                    onChange={(e) => handleInputChange('business_hours', e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Contact Info'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* E-commerce Tab */}
        <TabsContent value="commerce">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                E-commerce Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_rate">Tax Rate (decimal)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      value={settings.tax_rate}
                      onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shipping_fee">Shipping Fee</Label>
                    <Input
                      id="shipping_fee"
                      type="number"
                      step="0.01"
                      value={settings.shipping_fee}
                      onChange={(e) => handleInputChange('shipping_fee', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="free_shipping_threshold">Free Shipping Threshold</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      step="0.01"
                      value={settings.free_shipping_threshold}
                      onChange={(e) => handleInputChange('free_shipping_threshold', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="express_delivery_fee">Express Delivery Fee</Label>
                    <Input
                      id="express_delivery_fee"
                      type="number"
                      step="0.01"
                      value={settings.express_delivery_fee}
                      onChange={(e) => handleInputChange('express_delivery_fee', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="delivery_days">Delivery Time</Label>
                  <Input
                    id="delivery_days"
                    value={settings.delivery_days}
                    onChange={(e) => handleInputChange('delivery_days', e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? 'Saving...' : 'Save E-commerce Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-5 h-5" />
                Category Management
                <Badge variant="secondary">{categories.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={categorySearchTerm}
                    onChange={(e) => {
                      setCategorySearchTerm(e.target.value)
                      fetchCategories()
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchCategories}
                    className="border-gray-300 shadow-sm"
                  >
                    Refresh Categories
                  </Button>
                  <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                    <DialogTrigger asChild>
                      <Button onClick={resetCategoryForm}>
                        <Folder className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Dialog open={showSubcategoryModal} onOpenChange={setShowSubcategoryModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={resetSubcategoryForm}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add Subcategory
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              {/* Categories Table */}
              {categoriesLoading ? (
                <div className="text-center py-8">Loading categories...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategories</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category: any) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {/* Category Image */}
                              {category.image ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                  <Folder className="h-6 w-6 text-gray-400" />
                                </div>
                              )}

                              <div>
                                <p className="font-medium">{category.name}</p>
                                <p className="text-sm text-gray-500">{category.slug}</p>
                                {category.description && (
                                  <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {category.subcategories?.length > 0 ? (
                                <>
                                  <Badge variant="outline">
                                    {category.subcategories.length} subcategories
                                  </Badge>
                                  <div className="space-y-1">
                                    {category.subcategories.slice(0, 3).map((sub: any) => (
                                      <div key={sub.id} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                                        <span className="flex items-center gap-2">
                                          {/* Subcategory Image */}
                                          {sub.image ? (
                                            <img
                                              src={sub.image}
                                              alt={sub.name}
                                              className="w-4 h-4 rounded object-cover"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                              }}
                                            />
                                          ) : (
                                            <FolderPlus className="h-3 w-3" />
                                          )}
                                          {sub.name}
                                        </span>
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                            onClick={() => openEditSubcategoryModal(sub)}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 text-red-500"
                                            onClick={() => handleDeleteSubcategory(sub.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                    {category.subcategories.length > 3 && (
                                      <p className="text-xs text-gray-500">
                                        +{category.subcategories.length - 3} more
                                      </p>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-400 text-sm">No subcategories</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {category._count?.products || 0} products
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.isActive ? "Active" : "Inactive"}
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
                                variant="outline"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {categories.length === 0 && (
                    <div className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FolderTree className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">No categories found</p>
                        <Button size="sm" onClick={() => setShowCategoryModal(true)}>
                          Create your first category
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Fashion"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Category description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category Image</Label>
              {categoryForm.image && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <img
                    src={categoryForm.image}
                    alt="Category Preview"
                    className="max-h-20 mx-auto object-contain"
                  />
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => document.getElementById('categoryImageInput')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Category Image
              </Button>

              <Input
                id="categoryImageInput"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    console.log('📁 Category image selected:', file.name)

                    // Upload image
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('type', 'category')

                    try {
                      const uploadResponse = await fetch('/api/admin/upload', {
                        method: 'POST',
                        body: formData
                      })

                      if (uploadResponse.ok) {
                        const result = await uploadResponse.json()
                        console.log('✅ Category image uploaded:', result.url)
                        setCategoryForm(prev => ({...prev, image: result.url}))
                      } else {
                        alert('❌ Failed to upload category image')
                      }
                    } catch (error) {
                      console.error('Upload error:', error)
                      alert('❌ Error uploading image')
                    }
                  }
                }}
                className="hidden"
              />

              <p className="text-xs text-gray-500">
                Upload an image for this category (JPEG, PNG, WebP - max 5MB)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="categoryActive"
                checked={categoryForm.isActive}
                onCheckedChange={(checked) => setCategoryForm(prev => ({...prev, isActive: checked}))}
              />
              <Label htmlFor="categoryActive">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCategoryModal(false)
                  setEditingCategory(null)
                  resetCategoryForm()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                disabled={!categoryForm.name || saving}
              >
                {saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subcategory Modal */}
      <Dialog open={showSubcategoryModal} onOpenChange={setShowSubcategoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category *</Label>
              <Select
                value={subcategoryForm.categoryId}
                onValueChange={(value) => setSubcategoryForm(prev => ({...prev, categoryId: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategoryName">Subcategory Name *</Label>
              <Input
                id="subcategoryName"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Women's Clothing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategoryDescription">Description</Label>
              <Textarea
                id="subcategoryDescription"
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Subcategory description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Subcategory Image</Label>
              {subcategoryForm.image && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <img
                    src={subcategoryForm.image}
                    alt="Subcategory Preview"
                    className="max-h-20 mx-auto object-contain"
                  />
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => document.getElementById('subcategoryImageInput')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Subcategory Image
              </Button>

              <Input
                id="subcategoryImageInput"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    console.log('📁 Subcategory image selected:', file.name)

                    // Upload image
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('type', 'subcategory')

                    try {
                      const uploadResponse = await fetch('/api/admin/upload', {
                        method: 'POST',
                        body: formData
                      })

                      if (uploadResponse.ok) {
                        const result = await uploadResponse.json()
                        console.log('✅ Subcategory image uploaded:', result.url)
                        setSubcategoryForm(prev => ({...prev, image: result.url}))
                      } else {
                        alert('❌ Failed to upload subcategory image')
                      }
                    } catch (error) {
                      console.error('Upload error:', error)
                      alert('❌ Error uploading image')
                    }
                  }
                }}
                className="hidden"
              />

              <p className="text-xs text-gray-500">
                Upload an image for this subcategory (JPEG, PNG, WebP - max 5MB)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="subcategoryActive"
                checked={subcategoryForm.isActive}
                onCheckedChange={(checked) => setSubcategoryForm(prev => ({...prev, isActive: checked}))}
              />
              <Label htmlFor="subcategoryActive">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSubcategoryModal(false)
                  setEditingSubcategory(null)
                  resetSubcategoryForm()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory}
                disabled={!subcategoryForm.name || !subcategoryForm.categoryId || saving}
              >
                {saving ? 'Saving...' : (editingSubcategory ? 'Update Subcategory' : 'Create Subcategory')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Settings Display */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📋 Current Settings (Debug View)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
