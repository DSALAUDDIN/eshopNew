"use client"

import { Search, Phone } from "lucide-react"
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
  const { searchQuery, setSearchQuery, fetchCategories } = useStore()
  const { settings, loading } = useSiteSettings()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    fetchCategories()
  }, [fetchCategories])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const settingsData = settings as any

  return (
      <header className="bg-[#6ab4dc] text-white shadow relative z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Search Bar (Left) */}
            <form onSubmit={handleSearch} className="flex items-center bg-[#6ab4dc]">
              <div className="relative w-[250px] md:w-[350px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                    placeholder="Enter keyword or product code"
                    className="bg-white/20 border border-white/30 text-white placeholder:text-white/80 text-sm pl-10 font-brandon"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </form>

            {/* Logo + Shop Name (Center) */}
            <div className="flex flex-col justify-center items-center text-center">
              <button onClick={() => router.push("/")} aria-label="Go home">
                {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-24 bg-white/20 rounded"></div>
                    </div>
                ) : settingsData?.site_logo &&
                settingsData.site_logo !== '/placeholder-logo.png' &&
                (settingsData.site_logo.startsWith('/uploads/') || settingsData.site_logo.startsWith('http')) ? (
                    <img
                        src={settingsData.site_logo}
                        alt={settingsData.site_name || "Logo"}
                        className="max-h-10 w-auto object-contain"
                    />
                ) : (
                    <h1 className="text-2xl font-bold text-white">
                      {settingsData?.site_name || "SFDBD"}
                    </h1>
                )}
              </button>

              {settingsData?.site_name && (
                  <span className="text-xs text-orange-200 mt-1">
                {settingsData.site_name.toLowerCase()}
              </span>
              )}
            </div>

            {/* Contact (Right) */}
            <div className="hidden md:flex items-center space-x-3">
              <Phone className="w-4 h-4" />
              <span>{settingsData?.contact_phone || "+8801534207276"}</span>
            </div>

            {/* Commented out cart and refresh buttons */}
            {/*
          <Button>Refresh Categories</Button>
          <Button>Cart</Button>
          */}
          </div>
        </div>
      </header>
  )
}




