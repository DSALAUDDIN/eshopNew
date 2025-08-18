"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useEffect } from "react"

export function CategoryGrid() {
    const router = useRouter()
    const { categories, fetchCategories } = useStore()

    useEffect(() => {
        if (categories.length === 0) fetchCategories()
    }, [categories.length, fetchCategories])

    // Fallbacks
    const defaultCategories = [
        { name: "Fashion",     image: "/images/fashion-category.jpg",     href: "/category/fashion" },
        { name: "Home Decor",  image: "/images/home-decor-category.jpg",  href: "/category/home-decor" },
        { name: "Mugs & Teapots", image: "/images/mugs-teapots-category.jpg", href: "/mugs-teapots" },
    ]

    const displayCategories =
        categories.length > 0
            ? categories.map((c: any) => ({
                name: c?.name ?? "Category",
                image: c?.image || "/placeholder.jpg",
                href: `/category/${c?.slug ?? ""}`,
            }))
            : defaultCategories

    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                <p className="text-gray-600">Explore our curated collections</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {displayCategories.map((category, idx) => (
                    <button
                        key={`${category.href}-${idx}`}
                        onClick={() => router.push(category.href)}
                        className="rounded-xl overflow-hidden shadow-lg group bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] transition-colors"
                        type="button"
                        aria-label={`Open ${category.name}`}
                    >
                        {/* Square, fully responsive image box */}
                        <div className="relative w-full aspect-square bg-white">
                            <Image
                                src={category.image || "/placeholder.jpg"}
                                alt={category.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                                priority={idx === 0} // first one can be priority
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
