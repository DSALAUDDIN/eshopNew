"use client"

import { Search, Phone, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useSiteSettings } from "@/lib/settings"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const router = useRouter()
  const { searchQuery, setSearchQuery, fetchCategories, categories } = useStore()
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

  const settingsData = settings as any

  return (
      <header className="bg-[#6ab4dc] text-white shadow relative z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Logo + Shop Name (Left) */}
            <div className="flex flex-col justify-center items-center text-center">
              <button onClick={() => router.push("/")} aria-label="Go home">
                {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-24 bg-white/20 rounded"></div>
                    </div>
                ) : settingsData?.site_logo ? (
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

            {/* Search Bar (Center for desktop) */}
            <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center bg-[#6ab4dc]"
            >
              <div className="relative w-[250px] md:w-[350px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                    placeholder="Enter keyword or product code"
                    className="bg-white/20 border border-white/30 text-white placeholder:text-white/80 text-sm pl-10 font-brandon"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Contact (desktop only) */}
              <div className="hidden md:flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{settingsData?.contact_phone || "+8801534207276"}</span>
              </div>

              {/* Mobile menu button */}
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-bold text-lg text-gray-800">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <nav className="p-4 space-y-2">
                  {categories?.map((cat: any) => (
                      <button
                          key={cat.id}
                          onClick={() => {
                            router.push(`/category/${cat.slug}`)
                            setIsMobileMenuOpen(false)
                          }}
                          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                      >
                        {cat.name}
                      </button>
                  ))}
                </nav>
              </motion.div>
          )}
        </AnimatePresence>
      </header>
  )
}
