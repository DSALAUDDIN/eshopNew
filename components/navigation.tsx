"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"

export function Navigation() {
    const router = useRouter()
    const [openCategory, setOpenCategory] = useState<string | null>(null)
    const { categories, fetchCategories } = useStore()

    useEffect(() => {
        // Force immediate fetch on mount with strong cache-busting
        const refreshCategories = () => {
            fetchCategories()
        }

        refreshCategories()

        // Set up interval to refresh categories every 30 seconds
        const interval = setInterval(refreshCategories, 30000)

        // Listen for focus events to refresh when user returns to tab
        const handleFocus = () => {
            refreshCategories()
        }

        window.addEventListener('focus', handleFocus)

        return () => {
            clearInterval(interval)
            window.removeEventListener('focus', handleFocus)
        }
    }, [fetchCategories])

    const getPromoContent = (category: any) => {
        if (!category) return { img: "", title: "", desc: "", cta: "" }

        // Use the actual category image from database, with fallbacks
        const categoryImage = category.image || getDefaultImage(category.slug)

        return {
            img: categoryImage,
            title: category.name?.toUpperCase() || "",
            desc: category.description || `Explore our latest ${category.name?.toLowerCase() || ""} products`,
            cta: "SHOP NOW"
        }
    }

    // Fallback images for categories without uploaded images
    const getDefaultImage = (slug: string) => {
        const defaultImages: { [key: string]: string } = {
            "decor": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=220&q=80",
            "fashion": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=220&q=80",
            "footwear": "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=220&q=80",
            "furniture": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=220&q=80",
            "others": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=220&q=80"
        }
        return defaultImages[slug] || "https://via.placeholder.com/220x160?text=Collection"
    }

    const handleOpen = (id: string | null) => setOpenCategory(id)
    const closeDropdown = () => setOpenCategory(null)

    return (
        <nav className="bg-white border-b shadow-sm relative z-50">
            {/* Navbar */}
            <div className="w-full">
                <div className="flex justify-center space-x-8 py-4">
                    {categories.filter((cat, idx, arr) => arr.findIndex(c => c.name === cat.name) === idx).map((category) => {
                        const isOpen = openCategory === category.id;
                        return (
                            <div
                                key={category.id}
                                className="relative"
                                onMouseEnter={() => handleOpen(category.id)}
                                onMouseLeave={closeDropdown}
                                onFocus={() => handleOpen(category.id)}
                                onBlur={closeDropdown}
                                tabIndex={0}
                            >
                                <button
                                    onClick={() => router.push(`/category/${category.slug}`)}
                                    className="text-gray-700 hover:text-[hsl(var(--primary))] font-semibold uppercase px-2 transition-colors"
                                >
                                    {category.name}
                                </button>
                                {/* Dropdown - appears BELOW navbar, only for this category */}
                                {isOpen && category.subcategories && (
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 w-[900px] bg-white border-b shadow-xl z-30 rounded-b-2xl transition-all duration-200"
                                        style={{
                                            top: "100%",
                                            minHeight: 350,
                                            maxHeight: 400
                                        }}
                                        onMouseEnter={() => handleOpen(category.id)}
                                        onMouseLeave={closeDropdown}
                                    >
                                        <div className="mx-auto w-full flex flex-row px-16 py-10 gap-8">
                                            {/* Subcategories grid */}
                                            <div className="flex-1 flex flex-col justify-center h-full">
                                                <div className="grid grid-cols-3 gap-x-10 gap-y-2">
                                                    {category.subcategories.filter((sub, idx, arr) => arr.findIndex(s => s.name === sub.name) === idx).map((subcategory: any) => (
                                                        <button
                                                            key={subcategory.id}
                                                            onClick={() => router.push(`/category/${category.slug}?subcategory=${subcategory.slug}`)}
                                                            className="block text-base text-gray-700 hover:text-[hsl(var(--primary))] font-normal py-1 text-left transition-colors"
                                                        >
                                                            {subcategory.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Promo card at right */}
                                            <div className="w-[320px] flex flex-col justify-center items-center">
                                                <div className="bg-gray-100 rounded-xl p-6 text-center">
                                                    <div className="w-[220px] h-[160px] mx-auto mb-4 overflow-hidden rounded-lg">
                                                        <Image
                                                            src={getPromoContent(category).img}
                                                            alt={getPromoContent(category).title}
                                                            width={220}
                                                            height={160}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-2">
                                                        {getPromoContent(category).title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4">
                                                        {getPromoContent(category).desc}
                                                    </p>
                                                    <Button
                                                        onClick={() => router.push(`/category/${category.slug}`)}
                                                        variant="default"
                                                        className="bg-[hsl(var(--primary))] hover:bg-[#5BABC2]"
                                                    >
                                                        {getPromoContent(category).cta}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
