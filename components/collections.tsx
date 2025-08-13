"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  slug: string
  image?: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
  image?: string
}

export function Collections() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showSubcategoriesModal, setShowSubcategoriesModal] = useState(false)
  const { categories, fetchCategories } = useStore()

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [categories.length, fetchCategories])

  // Category images mapping
  const getCategoryImage = (category: Category) => {
    // First check if the category has an image field from the database
    if (category.image) {
      return category.image
    }

    // Fallback to mapping based on category name or slug (case-insensitive)
    const categoryKey = (category.name || category.slug || '').toLowerCase()

    const imageMap: { [key: string]: string } = {
      // Fashion related
      fashion: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      // Decor related
      decor: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "decor-accent": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      // Furniture related
      furniture: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      // Footwear related
      footwear: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
      shoes: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
      // Toys related
      toys: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      // Ceramics related
      ceramics: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      pottery: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      // Home related
      home: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      // Leather related
      leather: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }

    // Try to find a match based on category name/slug
    for (const [key, image] of Object.entries(imageMap)) {
      if (categoryKey.includes(key)) {
        return image
      }
    }

    // Default fallback image
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setSelectedCategory(category)
      setShowSubcategoriesModal(true)
    } else {
      // Navigate directly to category if no subcategories - use slug instead of id
      router.push(`/category/${category.slug}`)
    }
  }

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string) => {
    router.push(`/category/${categorySlug}?subcategory=${subcategorySlug}`)
    setShowSubcategoriesModal(false)
  }

  const handleViewAllInCategory = (categorySlug: string) => {
    router.push(`/category/${categorySlug}`)
    setShowSubcategoriesModal(false)
  }

  return (
    <>
      <section className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[hsl(var(--primary))] font-brandon">
          EXPLORE OUR COLLECTIONS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-6">
          {categories && categories.length > 0 ? (
            categories.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="text-center cursor-pointer group block w-full hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="rounded-xl overflow-hidden mb-3 md:mb-4 shadow-md hover:shadow-xl transition-shadow duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
                  <div className="absolute top-2 right-2 z-20">
                    {category.subcategories && category.subcategories.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {category.subcategories.length}
                      </Badge>
                    )}
                  </div>
                  <Image
                    src={getCategoryImage(category)}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base font-brandon">
                  {category.name}
                </h3>
                {category.subcategories && category.subcategories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {category.subcategories.length} subcategories
                  </p>
                )}
              </button>
            ))
          ) : (
            // Loading state while categories are being fetched
            Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="text-center">
                <div className="rounded-xl overflow-hidden mb-3 md:mb-4 shadow-md bg-gray-200 animate-pulse">
                  <div className="w-full h-32 md:h-40 bg-gray-300"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Subcategories Modal */}
      <Dialog open={showSubcategoriesModal} onOpenChange={setShowSubcategoriesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedCategory?.name} Collection
            </DialogTitle>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-6">
              {/* View All Button */}
              <div className="text-center">
                <Button
                  onClick={() => handleViewAllInCategory(selectedCategory.slug)}
                  className="mb-6"
                  size="lg"
                >
                  View All {selectedCategory.name} Products
                </Button>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedCategory.subcategories?.map((subcategory: Subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(selectedCategory.slug, subcategory.slug)}
                    className="p-4 border rounded-lg hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                        <span className="text-2xl">
                          {getSubcategoryIcon(subcategory.slug)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                        {subcategory.name}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to get subcategory icons
function getSubcategoryIcon(slug: string): string {
  const iconMap: { [key: string]: string } = {
    // Fashion
    "mens": "👨",
    "womens": "👩",
    "kids-fashion": "👶",
    "trendy": "✨",
    "mixed-fashion": "👔",

    // Decor
    "room-decor": "🏠",
    "kitchen-dining": "🍽️",
    "photo-frame": "🖼️",
    "baskets": "🧺",
    "vases": "🏺",
    "placemat-coaster": "🍽️",
    "cushion-blanket": "🛏️",
    "bed-sheets-pillow": "🛌",
    "rugs-bath-mats": "🪟",
    "tableware": "🍴",
    "sustainable-items": "♻️",
    "mixed-decor": "🏡",
    "storage": "📦",
    "wall-decor": "🖼️",

    // Furniture
    "bedrooms": "🛏️",
    "dining-rooms": "🍽️",
    "living-rooms": "🛋️",
    "occasionals": "💺",
    "accents": "✨",
    "indoor": "🏠",
    "outdoor": "🌳",
    "hotel-furniture": "🏨",
    "accessories": "🎨",
    "study-items": "📚",
    "storage-furniture": "📦",
    "wall-decor-furniture": "🖼️",
    "hangers": "👔",
    "desk-accessories": "💻",

    // Footwear
    "mens-footwear": "👞",
    "womens-footwear": "👠",
    "kids-footwear": "👟",
    "occasional-footwear": "🥿",

    // Toys
    "kids-toys": "🧸",
    "occasional-toys": "🎲",

    // Ceramics
    "tablewares": "🍽️",
    "kitchenware": "🍳",
    "occasional-ceramics": "🏺",

    // Leather
    "mens-leather": "💼",
    "womens-leather": "👜",
    "kids-leather": "🎒",
    "accessories-leather": "👓",
    "occasional-leather": "💼"
  }

  return iconMap[slug] || "📦"
}
