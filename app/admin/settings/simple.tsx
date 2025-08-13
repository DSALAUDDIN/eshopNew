'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'

export default function SimpleAdminSettings() {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [bannerPreview, setBannerPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'Southern Fashion & Décor',
    site_logo: '/placeholder-logo.png',
    hero_banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
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
        setSettings(data)
        setLogoPreview(data.site_logo || '')
        setBannerPreview(data.hero_banner || '')
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error)
    }
  }

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('🖼️ Logo file selected:', file.name)
      setLogoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle banner file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('🖼️ Banner file selected:', file.name)
      setBannerFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload and save
  const handleSave = async () => {
    setUploading(true)
    console.log('🚀 Starting save process...')

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

      // Upload banner if selected
      if (bannerFile) {
        console.log('📤 Uploading banner...')
        const formData = new FormData()
        formData.append('file', bannerFile)
        formData.append('type', 'banner')

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const result = await uploadResponse.json()
          console.log('✅ Banner uploaded:', result.url)
          newSettings.hero_banner = result.url
        } else {
          throw new Error('Banner upload failed')
        }
      }

      // Save settings
      console.log('💾 Saving settings...')
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
        setBannerFile(null)
        if (logoInputRef.current) logoInputRef.current.value = ''
        if (bannerInputRef.current) bannerInputRef.current.value = ''

        alert('Settings saved successfully! Please refresh the main page to see changes.')
      } else {
        throw new Error('Failed to save settings')
      }

    } catch (error) {
      console.error('❌ Save error:', error)
      alert('Error: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  // Load settings on component mount
  React.useEffect(() => {
    loadSettings()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Admin Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Logo & Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Logo Upload */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Site Logo</Label>

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
              <Label className="text-lg font-semibold mb-4 block">Hero Banner</Label>

              {bannerPreview && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="max-h-20 w-full object-cover rounded"
                  />
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => bannerInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Banner Image
              </Button>

              <Input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                onChange={handleBannerChange}
                className="hidden"
              />

              {bannerFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ {bannerFile.name} selected
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSave}
              disabled={uploading || (!logoFile && !bannerFile)}
              className="px-8 py-2 text-lg"
            >
              {uploading ? '⏳ Uploading...' : '💾 Save Changes'}
            </Button>
          </div>

          {/* Current Settings Display */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Current Settings:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
