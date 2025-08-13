"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/types"
import { useStore } from "@/lib/store"
import { Navigation } from "@/components/navigation"
import { ProductDetail } from "@/components/product-detail"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onLoginRequired?: () => void
}

export function ProductModal({ product, isOpen, onClose, onLoginRequired }: ProductModalProps) {
  const { getCartItemCount, getCartTotal, setCartOpen } = useStore()

  if (!isOpen || !product) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 md:p-4">
        <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-lg">
          {/* Header */}
          <div className="bg-[#FFA000] text-white p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span>🔍</span>
                  <Input
                    placeholder="Enter keyword or product code"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm w-64"
                  />
                </div>
              </div>

              <div className="text-center flex-1 md:flex-none">
                <h1 className="text-2xl md:text-3xl font-bold">SFDBD</h1>
                <p className="text-xs md:text-sm tracking-wider">trade</p>
              </div>

              <div className="flex items-center space-x-2 md:space-x-6 text-xs md:text-sm">
                <div className="hidden md:flex items-center space-x-2">
                  <span>📞</span>
                  <span>+880 1234 567890</span>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <span>✉️</span>
                  <span>info@sfdbd.com</span>
                </div>
                <button onClick={() => setCartOpen(true)} className="hover:text-blue-200 transition-colors">
                  <span className="hidden md:inline">
                    ৳{(getCartTotal() * 85).toFixed(0)} ({getCartItemCount()})
                  </span>
                  <span className="md:hidden">({getCartItemCount()})</span>
                </button>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-[#E68900]">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* Delivery Banner */}
          <div className="bg-[#FFA000] text-center py-2 text-xs md:text-sm text-white">
            FREE BD DELIVERY OVER ৳5000 / $60 / €50
          </div>

          {/* Product Detail Component */}
          <ProductDetail product={product} onLoginRequired={onLoginRequired} />

          {/* Footer */}
          <div className="bg-white border-t py-6 md:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-8 text-sm">
              <div>
                <h3 className="font-medium mb-3 md:mb-4 text-gray-800">HELP</h3>
                <ul className="space-y-1 md:space-y-2 text-gray-600 text-xs md:text-sm">
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Contact Us</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Delivery</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Terms & Conditions</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">FAQs</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">BD Shipping</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 md:mb-4 text-gray-800">ABOUT US</h3>
                <ul className="space-y-1 md:space-y-2 text-gray-600 text-xs md:text-sm">
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Our Story</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Showroom</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Lookbook</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Trade Shows</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Ethical Policy</li>
                  <li className="hover:text-blue-700 cursor-pointer transition-colors">Sustainability Mission</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 md:mb-4 text-gray-800">FOLLOW US</h3>
                <div className="flex space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded cursor-pointer hover:bg-blue-700 transition-colors"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-500 rounded cursor-pointer hover:bg-pink-600 transition-colors"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded cursor-pointer hover:bg-red-600 transition-colors"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-400 rounded cursor-pointer hover:bg-blue-500 transition-colors"></div>
                </div>
                <h4 className="font-medium mb-2 md:mb-3 text-gray-800 text-xs md:text-sm">WE ACCEPT</h4>
                <div className="flex space-x-1 md:space-x-2">
                  <div className="w-10 h-6 md:w-12 md:h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                    VISA
                  </div>
                  <div className="w-10 h-6 md:w-12 md:h-8 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                    MC
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3 md:mb-4 text-gray-800">GET 5% OFF</h3>
                <p className="text-gray-600 text-xs mb-3 md:mb-4">
                  Sign up to our wholesale newsletter and receive 5% off your first order.
                </p>
                <div className="flex">
                  <Input placeholder="Enter email address" className="flex-1 text-xs" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 md:px-4 py-2 rounded-l-none">
                    →
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3 md:mt-4 cursor-pointer hover:text-gray-700 transition-colors">
                  BACK TO TOP
                </p>
              </div>
            </div>

            <div className="border-t mt-4 md:mt-8 pt-4 md:pt-6 text-xs text-gray-500 text-center px-4 md:px-8">
              <p>© SFDBD 2025, DHAKA, BANGLADESH</p>
              <p>COMPANY REGISTRATION NUMBER 12345678 | VAT NUMBER BD 123 456 789 | ECOMMERCE BY TEAM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
