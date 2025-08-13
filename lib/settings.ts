import { useState, useEffect } from 'react'

// Define the Settings type
export interface Settings {
  site_name: string
  site_logo: string
  hero_banner?: string
  hero_carousel?: string[]
  contact_phone?: string
  // Add more fields as needed
}

// Create a simple event emitter for settings updates
const settingsEvents = {
  listeners: [] as (() => void)[],
  emit() {
    this.listeners.forEach(listener => listener())
  },
  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}

// Export the refresh function for use in other components
export const refreshSettings = () => {
  settingsEvents.emit()
}

// Simple hook to get settings
export function useSiteSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      console.log('🔄 Fetching settings...')
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Settings loaded:', data)
        setSettings(data)
      }
    } catch (error) {
      console.error('❌ Error fetching settings:', error)
      // Use defaults if fetch fails
      setSettings({
        site_name: 'Southern Fashion & Décor',
        site_logo: '/placeholder-logo.png',
        hero_banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()

    // Subscribe to settings refresh events
    const unsubscribe = settingsEvents.subscribe(fetchSettings)

    return unsubscribe
  }, [])

  return { settings, loading }
}
