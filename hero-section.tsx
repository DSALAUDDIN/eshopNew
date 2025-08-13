"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/lib/settings"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CSSProperties } from "react"

interface SiteSettings {
  site_name?: string
  site_description?: string
  hero_banner?: string
  hero_carousel?: string[]
}

export function HeroSection(): JSX.Element {
  const { settings, loading }: { settings: SiteSettings | null; loading: boolean } = useSiteSettings()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Get hero images from carousel or fallback to single banner
  const heroImages = settings?.hero_carousel && settings.hero_carousel.length > 0
    ? settings.hero_carousel
    : settings?.hero_banner
    ? [settings.hero_banner]
    : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80']

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [heroImages.length])

  const handleExploreClick = (): void => {
    const productsSection = document.getElementById("products")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentImage = heroImages[currentSlide]
  const backgroundStyle: CSSProperties = {
    backgroundImage: `url('${currentImage}')`,
  }

  // Show loading state or shop icon instead of hardcoded text
  if (loading) {
    return (
      <section className="relative">
        <div className="bg-primary text-white relative overflow-hidden">
          <div
            className="h-48 md:h-80 bg-cover bg-center relative flex items-center justify-center"
            style={backgroundStyle}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Shop Icon */}
              <div className="text-6xl md:text-8xl mb-4 animate-pulse">
                🏪
              </div>
              {/* Optional: Simple loading text */}
              <div className="text-sm md:text-lg text-white/80 font-brandon">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative">
      <div className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent z-10"></div>

        {/* Carousel Container */}
        <div className="relative h-48 md:h-80 overflow-hidden">
          {/* Images */}
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroImages.map((image, index) => (
              <div
                key={index}
                className="min-w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${image}')` }}
              />
            ))}
          </div>

          {/* Navigation Arrows - Only show if more than 1 image */}
          {heroImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator - Only show if more than 1 image */}
          {heroImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-15">
          <div className="absolute top-2 md:top-4 left-2 md:left-4">
            <span className="bg-primary text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold shadow-lg font-brandon">
              NEW COLLECTION
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div>
              {/* Only show content if we have actual settings, otherwise show shop icon */}
              {settings?.site_name ? (
                <>
                  <h2 className="text-2xl md:text-6xl font-bold mb-2 md:mb-4 text-white drop-shadow-2xl font-brandon">
                    {settings.site_name.toUpperCase()}
                  </h2>
                  <p className="text-sm md:text-2xl mb-4 md:mb-8 text-blue-100 drop-shadow-lg font-brandon">
                    {settings.site_description?.toUpperCase() || "WELCOME TO OUR STORE"}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {/* Just show shop icon if no settings */}
                  <div className="text-6xl md:text-8xl mb-4">
                    🏪
                  </div>
                </div>
              )}

              <Button
                className="bg-primary hover:bg-primary/90 text-white px-6 md:px-12 py-2 md:py-3 text-sm md:text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 border-0 font-brandon"
                onClick={handleExploreClick}
              >
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
