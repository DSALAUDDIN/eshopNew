// components/CategoryHeader.js
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function CategoryHeader({ image, title, description, categoryId }) {
    const [currentImage, setCurrentImage] = useState(image)
    const [imageError, setImageError] = useState(false)

    // Fetch fresh category data to get updated image
    useEffect(() => {
        const fetchCategoryImage = async () => {
            if (categoryId) {
                try {
                    const response = await fetch(`/api/categories`)
                    if (response.ok) {
                        const categories = await response.json()
                        const category = categories.find(cat => cat.id === categoryId || cat.slug === categoryId)
                        if (category && category.image && category.image !== currentImage) {
                            setCurrentImage(category.image)
                            setImageError(false)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching category image:', error)
                }
            }
        }

        fetchCategoryImage()

        // Set up polling to check for image updates every 30 seconds
        const interval = setInterval(fetchCategoryImage, 30000)
        return () => clearInterval(interval)
    }, [categoryId, currentImage])

    // Fallback image if no image is provided or if there's an error
    const fallbackImage = "/images/placeholder.jpg"
    const displayImage = (currentImage && !imageError) ? currentImage : fallbackImage

    return (
        <div className="flex gap-8 items-start mb-8">
            <div className="relative w-64 h-52 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                    src={displayImage}
                    alt={title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    priority
                    sizes="256px"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold uppercase mb-2">{title}</h1>
                <hr className="border-t border-gray-300 mb-3" />
                <p className="max-w-xl text-gray-700">{description}</p>
            </div>
        </div>
    )
}
