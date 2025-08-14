"use client"

import { Button } from "@/components/ui/button"
import { Phone, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useSiteSettings } from "@/lib/settings"
import { useEffect, useState } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter()
  const { categories, fetchCategories } = useStore()
  const { settings } = useSiteSettings()
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen, fetchCategories])

  const handleNavigate = (path: string) => {
    router.push(path)
    onClose()
  }

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId)
  }

  if (!isOpen) return null

  const settingsData = settings as any

  return (
    <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="bg-white w-72 h-full p-4 shadow-xl font-brandon overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[hsl(var(--primary))]">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary) / 0.1)]">
            ×
          </Button>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => handleNavigate("/")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left py-2"
          >
            HOME
          </button>

          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleNavigate(`/category/${category.slug}`)}
                  className="block text-gray-700 hover:text-orange-600 font-medium transition-colors text-left py-2 flex-grow"
                >
                  {category.name.toUpperCase()}
                </button>
                {category.subcategories && category.subcategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                    className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary) / 0.1)] p-2"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />
                  </Button>
                )}
              </div>
              {openCategory === category.id && category.subcategories && (
                <div className="pl-4 border-l-2 border-gray-200 ml-2">
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleNavigate(`/category/${category.slug}?subcategory=${subcategory.slug}`)}
                      className="block text-gray-600 hover:text-orange-600 transition-colors w-full text-left py-2"
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => handleNavigate("/sale")}
            className="block text-orange-600 hover:text-orange-700 font-medium transition-colors w-full text-left py-2"
          >
            SALE
          </button>
          <button
            onClick={() => handleNavigate("/help")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left py-2"
          >
            HELP
          </button>
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mt-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{settingsData?.contact_phone || "+8801534207276"}</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
