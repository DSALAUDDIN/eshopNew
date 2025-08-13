"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useEffect } from "react"

export function CategoryGrid() {
  const router = useRouter()
  const { categories, fetchCategories } = useStore()

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [categories.length, fetchCategories])

  // Default categories as fallback
  const defaultCategories = [
    {
      name: "Fashion",
      image: "/images/fashion-category.jpg",
      href: "/category/fashion",
    },
    {
      name: "Home Decor",
      image: "/images/home-decor-category.jpg",
      href: "/category/home-decor",
    },
    {
      name: "Mugs & Teapots",
      image: "/images/mugs-teapots-category.jpg",
      href: "/mugs-teapots",
    },
  ]

  // Use live categories if available, otherwise use defaults
  const displayCategories =
    categories.length > 0
      ? categories.map((category) => ({
          name: category.name,
          image: category.image || "/placeholder.jpg",
          href: `/category/${category.slug}`,
        }))
      : defaultCategories

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600">Explore our curated collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {displayCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => router.push(category.href)}
            className="rounded-xl overflow-hidden shadow-lg group bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] transition-colors"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg md:text-xl font-bold text-white drop-shadow font-brandon">
                {category.name}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
