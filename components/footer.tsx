"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface SocialMediaSetting {
  id: string
  platform: string
  url: string
  isActive: boolean
  sortOrder: number
}

export function Footer() {
  const router = useRouter()
  const [socialSettings, setSocialSettings] = useState<SocialMediaSetting[]>([])

  const fetchSocialSettings = async () => {
    try {
      const response = await fetch('/api/admin/social-media', {
        // Add cache-busting to ensure fresh data
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSocialSettings(data.filter((setting: SocialMediaSetting) => setting.isActive))
      }
    } catch (error) {
      console.error('Error fetching social media settings:', error)
    }
  }

  useEffect(() => {
    fetchSocialSettings()

    // Set up an interval to refresh social media settings every 30 seconds
    const interval = setInterval(fetchSocialSettings, 30000)

    // Also listen for focus events to refresh when user returns to the page
    const handleFocus = () => {
      fetchSocialSettings()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Newsletter signup functionality would be implemented here!")
  }

  const getSocialLink = (platform: string, url: string) => {
    if (platform === 'email') {
      return `mailto:${url}`
    }
    return url.startsWith('http') ? url : `https://${url}`
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'f'
      case 'instagram': return 'i'
      case 'twitter': return 't'
      default: return platform.charAt(0).toLowerCase()
    }
  }

  const getEmailSetting = () => {
    return socialSettings.find(setting => setting.platform === 'email')
  }

  return (
    <footer className="bg-[#f5f3ec] text-black py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Help */}
          <div>
            <h3 className="font-bold mb-4 text-primary font-brandon">HELP</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <button
                  onClick={() => router.push("/contact")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/delivery")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/terms")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/privacy")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/faq")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/shipping")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  BD Shipping
                </button>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold mb-4 text-primary font-brandon">ABOUT US</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <button
                  onClick={() => router.push("/about")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/showroom")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/lookbook")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Lookbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/trade-shows")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Trade Shows
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/ethics")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Ethical Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/sustainability")}
                  className="hover:text-primary transition-colors font-brandon text-black"
                >
                  Sustainability Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold mb-4 text-primary font-brandon">FOLLOW US</h3>
            <div className="flex space-x-4 mb-4">
              {socialSettings
                .filter(setting => setting.platform !== 'email')
                .map((setting) => (
                <a
                  key={setting.id}
                  href={getSocialLink(setting.platform, setting.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg cursor-pointer hover:bg-[#5BB8C1] transition-all shadow-md flex items-center justify-center"
                  title={`Follow us on ${setting.platform}`}
                >
                  <span className="text-white text-sm font-brandon">
                    {getSocialIcon(setting.platform)}
                  </span>
                </a>
              ))}
            </div>
            {getEmailSetting() && (
              <p className="text-sm text-gray-700 mb-4 font-brandon">
                <a
                  href={getSocialLink('email', getEmailSetting()!.url)}
                  className="hover:text-primary transition-colors"
                >
                  @{getEmailSetting()!.url.replace('mailto:', '')}
                </a>
              </p>
            )}

            <h4 className="font-bold mb-2 text-primary font-brandon">WE ACCEPT</h4>
            <div className="flex space-x-2">
              <div className="w-12 h-8 bg-[hsl(var(--primary))] rounded text-white text-xs flex items-center justify-center font-semibold shadow-md font-brandon">
                VISA
              </div>
              <div className="w-12 h-8 bg-gray-700 rounded text-white text-xs flex items-center justify-center font-semibold shadow-md font-brandon">
                MC
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 text-primary font-brandon">GET 5% OFF</h3>
            <p className="text-sm text-gray-700 mb-4 font-brandon">
              Sign up to our wholesale newsletter and receive 5% off your first order.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <Input
                placeholder="Enter email address"
                className="flex-1 text-sm bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 font-brandon"
                type="email"
                required
              />
              <Button type="submit" className="bg-[hsl(var(--primary))] hover:bg-[#5BB8C1] ml-2 shadow-md border-0 font-brandon">
                →
              </Button>
            </form>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-gray-400 mt-4 cursor-pointer hover:text-primary transition-colors block font-brandon"
            >
              BACK TO TOP
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p className="font-brandon">
            © 2025 My Amazin Store. All rights reserved.
          </p>
          <p className="mt-2 font-brandon">
            Made with{" "}
            <span className="text-[hsl(var(--primary))]">♥</span> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  )
}
