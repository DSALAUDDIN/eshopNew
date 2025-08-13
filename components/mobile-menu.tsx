"use client"

import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { useRouter } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="bg-white w-64 h-full p-4 shadow-xl font-brandon" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[hsl(var(--primary))]">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary) / 0.1)]">
            ×
          </Button>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => router.push("/")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left"
          >
            HOME
          </button>
          <button
            onClick={() => router.push("/category/fashion")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left"
          >
            FASHION
          </button>
          <button
            onClick={() => router.push("/category/decor")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left"
          >
            DÉCOR
          </button>
          <button
            onClick={() => router.push("/category/furniture")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left"
          >
            FURNITURE
          </button>
          <button
            onClick={() => router.push("/sale")}
            className="block text-orange-600 hover:text-orange-700 font-medium transition-colors w-full text-left"
          >
            SALE
          </button>
          <button
            onClick={() => router.push("/help")}
            className="block text-gray-700 hover:text-orange-600 font-medium transition-colors w-full text-left"
          >
            HELP
          </button>
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-1 mt-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
