"use client"

import { Search, ShoppingCart, Phone, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useSiteSettings } from "@/lib/settings"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const router = useRouter()
  const { getCartItemCount, setCartOpen, searchQuery, setSearchQuery, categories, fetchCategories } = useStore()
  const { settings, loading } = useSiteSettings()
  const [isHydrated, setIsHydrated] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
  const cartCount = isHydrated ? getCartItemCount() : 0

  // Improved AnimatedMenuIcon for robust mobile visibility
  const AnimatedMenuIcon = () => (
    <motion.div
      className="relative flex items-center justify-center w-8 h-8"
      initial={false}
      animate={isMobileMenuOpen ? "open" : "closed"}
      aria-label="Open menu"
      role="button"
    >
      {/* Hamburger bars */}
      <motion.span
        className="block absolute w-7 h-1 rounded bg-white left-1 top-2"
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
        variants={{
          closed: { rotate: 0, y: 0, opacity: 1 },
          open: { rotate: 45, y: 12, opacity: 1 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <motion.span
        className="block absolute w-7 h-1 rounded bg-white left-1 top-4"
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
        variants={{
          closed: { opacity: 1, y: 0 },
          open: { opacity: 0, y: 0 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <motion.span
        className="block absolute w-7 h-1 rounded bg-white left-1 top-6"
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
        variants={{
          closed: { rotate: 0, y: 0, opacity: 1 },
          open: { rotate: -45, y: -12, opacity: 1 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {/* Fallback static icon if animation fails */}
      <span className="sr-only">Menu</span>
    </motion.div>
  )

  return (
      <header className="bg-[hsl(var(--primary))] text-white shadow-lg relative z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center z-20">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:bg-[hsl(var(--primary))] font-brandon p-0 w-10 h-10 flex items-center justify-center"
                  aria-label="Open menu"
              >
                <AnimatedMenuIcon />
              </Button>
            </div>

            {/* Logo - Always centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 w-full pointer-events-none py-6 md:py-10">
              <button onClick={() => router.push("/")} className="block pointer-events-auto" aria-label="Go home">
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

            {/* Cart and Contact (right side) */}
            <div className="flex items-center space-x-3 ml-auto z-20">
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
                  aria-label="Open cart"
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

        {/* Mobile Navigation Drawer - dynamic categories only */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                    className="fixed inset-0 bg-black/60 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                {/* Sidebar */}
                <motion.aside
                    className="fixed top-0 left-0 h-full w-[90vw] max-w-[340px] bg-white text-[hsl(var(--primary))] z-[60] shadow-2xl flex flex-col rounded-r-2xl overflow-y-auto"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b bg-[hsl(var(--primary))] text-white rounded-tr-2xl">
                    <div className="flex items-center gap-2">
                      <AnimatedMenuIcon />
                      <span className="ml-2 font-brandon text-lg font-bold">
                        {settingsData?.site_name || "SFDBD"}
                      </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white"
                        aria-label="Close menu"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  <nav className="flex-1 overflow-y-auto py-4 px-2">
                    {categories && categories.length > 0 && categories.map((cat: any) => (
                      <div key={cat.id} className="mb-1">
                        <button
                          className="flex items-center w-full py-3 px-4 rounded-lg font-brandon text-base font-medium hover:bg-orange-50 transition group text-left"
                          onClick={() => {
                            if (cat.subcategories && cat.subcategories.length > 0) {
                              setActiveCategory(activeCategory === cat.id ? null : cat.id)
                            } else {
                              router.push(`/category/${cat.slug}`)
                              setIsMobileMenuOpen(false)
                            }
                          }}
                        >
                          {cat.name}
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <span className="ml-auto">
                              {activeCategory === cat.id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </span>
                          )}
                        </button>
                        {cat.subcategories && cat.subcategories.length > 0 && activeCategory === cat.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-8 flex flex-col space-y-1 bg-orange-50 rounded-lg mb-2 py-2"
                          >
                            {cat.subcategories.map((sub: any) => (
                              <button
                                key={sub.id}
                                className="flex items-center py-2 px-2 text-left font-brandon text-[15px] text-gray-700 hover:text-orange-700 hover:bg-orange-100 rounded transition"
                                onClick={() => {
                                  router.push(`/category/${cat.slug}?subcategory=${sub.slug}`)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </nav>
                  <div className="border-t p-5 flex items-center justify-between bg-gray-50 rounded-br-2xl">
                    <div className="flex items-center text-[hsl(var(--primary))] font-brandon text-base">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{settingsData?.contact_phone || "+1 (555) 123-4567"}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCartOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="relative text-[hsl(var(--primary))] hover:bg-orange-100 font-brandon"
                        aria-label="Open cart"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.aside>
              </>
          )}
        </AnimatePresence>
      </header>
  )
}