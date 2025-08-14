"use client"

import { Search, ShoppingCart, Phone, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useSiteSettings } from "@/lib/settings"
import { useState, useEffect } from "react"

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const router = useRouter()
  const { getCartItemCount, setCartOpen, searchQuery, setSearchQuery } = useStore()
  const { settings, loading } = useSiteSettings()
  const [isHydrated, setIsHydrated] = useState(false)

  // Ensure hydration is complete before showing cart count
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Handle search functionality
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Type-safe settings access
  const settingsData = settings as any

  // Debug log to see what settings we're getting
  console.log('Header settings:', settings)

  const cartCount = isHydrated ? getCartItemCount() : 0

  return (
    <header className="bg-[hsl(var(--primary))] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-[hsl(var(--primary))] font-brandon"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Search - Hidden on mobile, shown on desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-xs">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Enter keyword or product code"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 text-sm font-brandon"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </form>

          {/* Logo - Centered on mobile */}
          <div className="text-center flex-1 md:flex-none">
            <button onClick={() => router.push("/")} className="block">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-24 bg-white/20 rounded"></div>
                </div>
              ) : settingsData?.site_logo &&
                  settingsData.site_logo !== '/placeholder-logo.png' &&
                  (settingsData.site_logo.startsWith('/uploads/') || settingsData.site_logo.startsWith('http')) ? (
                <div className="flex flex-col items-center">
                  <img
                    src={settingsData.site_logo}
                    alt={settingsData.site_name || "Logo"}
                    className="max-h-10 w-auto object-contain"
                    onError={(e) => {
                      console.error('Logo failed to load:', settingsData.site_logo)
                      // Fallback to text logo if image fails
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div>
                            <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg font-brandon">
                              ${settingsData?.site_name || "SFDBD"}
                            </h1>
                            <p class="text-xs md:text-sm tracking-wider text-orange-200 font-brandon">trade</p>
                          </div>
                        `
                      }
                    }}
                    onLoad={() => {
                      console.log('✅ Logo loaded successfully:', settingsData.site_logo)
                    }}
                  />
                  {settingsData?.site_name && (
                    <p className="text-xs text-orange-200 font-brandon mt-1">
                      {settingsData.site_name.toLowerCase()}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg font-brandon">
                    {settingsData?.site_name || "SFDBD"}
                  </h1>
                  <p className="text-xs md:text-sm tracking-wider text-orange-200 font-brandon">trade</p>
                </div>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Contact - Hidden on mobile */}
            <div className="hidden lg:flex items-center text-sm font-brandon">
              <Phone className="w-4 h-4 mr-2" />
              <span>{settingsData?.contact_phone || "+1 (555) 123-4567"}</span>
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:bg-[hsl(var(--primary))] font-brandon"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="md:hidden mt-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
            <Input
              placeholder="Search products..."
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 text-sm pl-10 font-brandon"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </form>
        </div>
      </div>
    </header>
  )
}
