'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface FooterPageFormProps {
  pageId?: string
}

interface FooterPageData {
  title: string
  slug: string
  content: string
  metaTitle: string
  metaDescription: string
  isActive: boolean
  sortOrder: number
}

export default function FooterPageForm({ pageId }: FooterPageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FooterPageData>({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    sortOrder: 0
  })

  const isEditing = !!pageId

  const fetchPage = async () => {
    if (!pageId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/footer-pages/${pageId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title,
          slug: data.slug,
          content: data.content,
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          isActive: data.isActive,
          sortOrder: data.sortOrder
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch page data",
          variant: "destructive"
        })
        router.push('/admin/footer-pages')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch page data",
        variant: "destructive"
      })
      router.push('/admin/footer-pages')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug only for new pages
      ...(isEditing ? {} : { slug: generateSlug(title) })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isEditing 
        ? `/api/admin/footer-pages/${pageId}`
        : '/api/admin/footer-pages'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Page ${isEditing ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/footer-pages')
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || `Failed to ${isEditing ? 'update' : 'create'} page`,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} page`,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      fetchPage()
    }
  }, [pageId])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/footer-pages">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Footer Page' : 'Create Footer Page'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="Enter page slug"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL will be: /{formData.slug}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="content">Page Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter page content (HTML allowed)"
                  className="min-h-[300px]"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can use HTML for formatting
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Enter meta title for SEO"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Enter meta description for SEO"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Page' : 'Create Page'}
                </>
              )}
            </Button>
            <Link href="/admin/footer-pages">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
