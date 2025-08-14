"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { DeliveryBanner } from "@/components/delivery-banner"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { MobileMenu } from "@/mobile-menu"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header Section - Only Header and Navigation */}
      <div className="sticky top-0 z-40">
        {/* Header */}
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Navigation - only show on md and up */}
        <div className="hidden md:block">
          <Navigation />
        </div>
      </div>

      {/* Delivery Banner - Not sticky */}
      <DeliveryBanner />

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Global Components */}
      <CartSidebar />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  )
}
