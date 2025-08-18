'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from './skeleton'

interface ImageWithLoaderProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function ImageWithLoader({
  src,
  alt,
  className,
  priority,
  sizes,
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        isLoading ? 'animate-pulse' : ''
      }`}
    >
      {isLoading && (
        <Skeleton
          className="absolute inset-0 w-full h-full bg-gray-200"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        sizes={sizes}
      />
    </div>
  )
}
