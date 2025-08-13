'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface FooterPage {
  id: string
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function FooterPagesPage() {
  const [pages, setPages] = useState<FooterPage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/footer-pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch footer pages",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch footer pages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/footer-pages/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Page ${!isActive ? 'activated' : 'deactivated'} successfully`,
        })
        fetchPages()
      } else {
        toast({
          title: "Error",
          description: "Failed to update page status",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page status",
        variant: "destructive"
      })
    }
  }

  const deletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const response = await fetch(`/api/admin/footer-pages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Page deleted successfully",
        })
        fetchPages()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete page",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Footer Pages</h1>
        <Link href="/admin/footer-pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Page
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No footer pages found</p>
              <Link href="/admin/footer-pages/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {page.title}
                      <Badge variant={page.isActive ? "default" : "secondary"}>
                        {page.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Slug: /{page.slug}
                    </p>
                    {page.metaDescription && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(page.id, page.isActive)}
                    >
                      {page.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Link href={`/admin/footer-pages/${page.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePage(page.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sort Order: {page.sortOrder}</span>
                  <span>
                    Updated: {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
