'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Plus, Edit, Trash2, Facebook, Instagram, Twitter, Mail, Youtube, Linkedin } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface SocialMediaSetting {
  id: string
  platform: string
  url: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  email: Mail,
  youtube: Youtube,
  linkedin: Linkedin
}

const platformLabels = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  email: 'Email',
  youtube: 'YouTube',
  linkedin: 'LinkedIn'
}

const availablePlatforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'email', label: 'Email' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' }
]

export default function SocialMediaPage() {
  const [settings, setSettings] = useState<SocialMediaSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editForm, setEditForm] = useState({
    platform: '',
    url: '',
    isActive: true,
    sortOrder: 0
  })
  const [createForm, setCreateForm] = useState({
    platform: '',
    url: '',
    isActive: true,
    sortOrder: 0
  })

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/social-media')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch social media settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch social media settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!createForm.platform || !createForm.url) {
      toast({
        title: "Error",
        description: "Platform and URL are required",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/admin/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Social media setting created successfully",
        })
        setShowCreateForm(false)
        setCreateForm({
          platform: '',
          url: '',
          isActive: true,
          sortOrder: 0
        })
        fetchSettings()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create setting",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create setting",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (setting: SocialMediaSetting) => {
    setEditingId(setting.id)
    setEditForm({
      platform: setting.platform,
      url: setting.url,
      isActive: setting.isActive,
      sortOrder: setting.sortOrder
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      const response = await fetch(`/api/admin/social-media/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Social media setting updated successfully",
        })
        setEditingId(null)
        fetchSettings()
      } else {
        toast({
          title: "Error",
          description: "Failed to update setting",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({
      platform: '',
      url: '',
      isActive: true,
      sortOrder: 0
    })
  }

  const handleCancelCreate = () => {
    setShowCreateForm(false)
    setCreateForm({
      platform: '',
      url: '',
      isActive: true,
      sortOrder: 0
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media setting?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Social media setting deleted successfully",
        })
        fetchSettings()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete setting",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive"
      })
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/social-media/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Setting ${!isActive ? 'activated' : 'deactivated'} successfully`,
        })
        fetchSettings()
      } else {
        toast({
          title: "Error",
          description: "Failed to update setting status",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting status",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Media Settings</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Social Media Platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="create-platform">Platform</Label>
              <Select value={createForm.platform} onValueChange={(value) => setCreateForm(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.filter(platform =>
                    !settings.some(setting => setting.platform === platform.value)
                  ).map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create-url">
                {createForm.platform === 'email' ? 'Email Address' : 'URL'}
              </Label>
              <Input
                id="create-url"
                value={createForm.url}
                onChange={(e) => setCreateForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder={createForm.platform === 'email' ? 'email@domain.com' : 'https://...'}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-sortOrder">Sort Order</Label>
                <Input
                  id="create-sortOrder"
                  type="number"
                  value={createForm.sortOrder}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="create-isActive"
                  checked={createForm.isActive}
                  onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="create-isActive">Active</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Save className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button variant="outline" onClick={handleCancelCreate}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {settings.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No Social Media Settings</h3>
              <p className="text-gray-500 mb-4">Add your social media platforms to display them on your website.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Platform
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings List */}
      <div className="grid gap-6">
        {settings.map((setting) => {
          const Icon = platformIcons[setting.platform as keyof typeof platformIcons]
          const isEditing = editingId === setting.id

          return (
            <Card key={setting.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-6 w-6 text-blue-600" />}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {platformLabels[setting.platform as keyof typeof platformLabels] || setting.platform}
                        <Badge variant={setting.isActive ? "default" : "secondary"}>
                          {setting.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      {!isEditing && (
                        <p className="text-sm text-gray-500 mt-1">
                          {setting.platform === 'email' ? setting.url : setting.url}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(setting.id, setting.isActive)}
                        >
                          {setting.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(setting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(setting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSave}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              {isEditing && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`url-${setting.id}`}>
                      {setting.platform === 'email' ? 'Email Address' : 'URL'}
                    </Label>
                    <Input
                      id={`url-${setting.id}`}
                      value={editForm.url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder={setting.platform === 'email' ? 'email@domain.com' : 'https://...'}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`sortOrder-${setting.id}`}>Sort Order</Label>
                      <Input
                        id={`sortOrder-${setting.id}`}
                        type="number"
                        value={editForm.sortOrder}
                        onChange={(e) => setEditForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`isActive-${setting.id}`}
                        checked={editForm.isActive}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor={`isActive-${setting.id}`}>Active</Label>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
