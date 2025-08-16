"use client"

import { Search, User, ShoppingBag, Phone, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSiteSettings } from "@/lib/settings"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, loading } = useSiteSettings()

  const [activeMenu, setActiveMenu] = useState<any | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true)
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
    }
  }

  return (
      <>
        <header className="bg-[#6cb2da] text-white z-50 sticky top-0 shadow-md" onMouseLeave={() => setActiveMenu(null)}>
          {/* === TOP BAR SECTION === */}
          <div className="border-b border-gray-200/30">
            <div className="bg-[#559ac8] text-white text-center py-2 text-sm font-semibold">
              FREE UK DELIVERY OVER £200 / 200€ / $200
            </div>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between gap-4 py-4">
                {/* Left: Logo & Mobile Menu */}
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="h-6 w-6" />
                  </Button>
                  <button onClick={() => router.push("/")} aria-label="Go home">
                    {loading ? (
                      <div className="h-10 w-40 animate-pulse rounded-md bg-white/30"></div>
                    ) : (
                      settings && (
                        <img src={settings.site_logo} alt={settings.site_name || 'Site Logo'} className="h-10 object-contain" />
                      )
                    )}
                  </button>
                </div>

                {/* Center: Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center px-8">
                  <form onSubmit={handleSearch} className="relative w-full max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                      placeholder="Enter keyword or product code" 
                      className="bg-white border-gray-300 text-sm pl-11 py-2 w-full focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-gray-800" 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                    />
                  </form>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center justify-end space-x-4 text-sm">
                  <a href="#" className="hidden lg:flex items-center gap-2 hover:text-gray-200"><User size={20} /> Login to TRADE</a>
                  <a href="#" className="flex items-center gap-2 hover:text-gray-200"><ShoppingBag size={20} /> £0.00</a>
                  {settings && settings.contact_phone && (
                    <a href={`tel:${settings.contact_phone}`} className="hidden lg:flex items-center gap-2 hover:text-gray-200">
                      <Phone size={20} /> {settings.contact_phone}
                    </a>
                  )}
                </div>
              </div>
              {/* Mobile Search Bar */}
              <div className="md:hidden pb-4">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Enter keyword or product code" 
                    className="bg-white border-gray-300 text-sm pl-11 py-2 w-full focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-gray-800" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                </form>
              </div>
            </div>
          </div>

          {/* === NAVIGATION SECTION === */}
          <div className="hidden md:block bg-[#6cb2da] relative">
            <nav className="container mx-auto flex justify-center items-center gap-x-8 h-[48px]">
               {categoriesLoading ? (
                <div className="flex items-center justify-center gap-x-8">
                  <div className="h-5 w-24 animate-pulse rounded-md bg-white/30"></div>
                  <div className="h-5 w-24 animate-pulse rounded-md bg-white/30"></div>
                  <div className="h-5 w-24 animate-pulse rounded-md bg-white/30"></div>
                  <div className="h-5 w-24 animate-pulse rounded-md bg-white/30"></div>
                </div>
              ) : (
                categories.map((cat: any) => (
                    <div key={cat.id} className="py-3" onMouseEnter={() => setActiveMenu(cat)}>
                      <button onClick={() => router.push(`/category/${cat.slug}`)} className="text-sm font-bold tracking-wider uppercase text-white hover:text-gray-200 transition-colors">
                        {cat.name}
                      </button>
                    </div>
                ))
              )}
            </nav>
            
            {/* MEGA MENU CONTAINER */}
            <AnimatePresence>
              {activeMenu && (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute w-full z-50 left-0 top-full"
                  >
                    <div className="bg-white shadow-lg text-gray-800" onMouseEnter={() => setActiveMenu(activeMenu)} onMouseLeave={() => setActiveMenu(null)}>
                      <div className="container mx-auto p-8 flex justify-between gap-8">
                        <div className="flex-1">
                          {activeMenu.subcategories && activeMenu.subcategories.length > 0 && (
                              <ul className="columns-4 gap-x-8">
                                {activeMenu.subcategories.map((subcat: any) => (
                                    <li key={subcat.id} className="mb-2 break-inside-avoid-column">
                                      <a href={`/category/${subcat.slug}`} className="text-gray-600 hover:text-teal-600 text-sm block">{subcat.name}</a>
                                    </li>
                                ))}
                              </ul>
                          )}
                        </div>
                        {activeMenu.image && (
                            <a href="#" className="w-1/5 flex-shrink-0 text-center group">
                              <div className="bg-gray-100 overflow-hidden mb-2">
                                <img src={activeMenu.image} alt={activeMenu.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                              <span className="font-bold text-gray-800 uppercase text-sm tracking-wider group-hover:text-teal-600">{activeMenu.imageTitle}</span>
                            </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* OVERLAY for Mega Menu */}
        <AnimatePresence>
            {activeMenu && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setActiveMenu(null)}
                />
            )}
        </AnimatePresence>

        {/* Your Mobile Menu Drawer would go here */}
      </>
  )
}
