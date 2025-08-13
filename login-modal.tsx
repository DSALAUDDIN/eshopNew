"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { useState, useCallback } from "react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newCustomerEmail, setNewCustomerEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useStore()

  if (!isOpen) return null

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate input
    if (!email || !password) {
      alert("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Use the store's login function which handles the API call
      const success = await login(email, password)

      if (success) {
        setIsLoading(false)
        setEmail("")
        setPassword("")
        onClose()

        // Show success message
        alert("Successfully logged in!")

        // Check if user is a trade customer for potential admin access
        // Note: Admin role checking would need to be implemented based on your user system
        const currentUser = useStore.getState().user
        if (currentUser?.email.includes('admin') || currentUser?.isTradeCustomer) {
          // This is a simplified check - you may want to implement proper role checking
          setTimeout(() => {
            window.location.href = '/admin'
          }, 100)
        }
      } else {
        alert('Login failed. Please check your credentials.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
      alert(errorMessage)
      setIsLoading(false)
    }
  }, [email, password, login, onClose])

  const handleNewCustomer = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCustomerEmail) {
      alert("Please enter your email address")
      return
    }

    // Simulate registration process
    alert(`Registration link sent to ${newCustomerEmail}. Please check your email.`)
    setNewCustomerEmail("")
  }, [newCustomerEmail])

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="bg-[#FFA000] text-white p-4 md:p-6 relative rounded-t-2xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-[hsl(var(--primary))] rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-xl md:text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-white/90 mt-2">Please sign in to your account</p>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Existing Customer Login */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#FFA000]">Existing Customer</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full bg-[#FFA000] hover:bg-[#FF8F00] text-white"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-[#FFA000] hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* New Customer Registration */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#FFA000]">New Customer</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Create an account to track your orders, save items to your wishlist, and receive exclusive offers.
              </p>
              <form onSubmit={handleNewCustomer} className="space-y-4">
                <div>
                  <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newCustomerEmail}
                  variant="outline"
                  className="w-full border-[#FFA000] text-[#FFA000] hover:bg-[#FFA000] hover:text-white"
                >
                  Create Account
                </Button>
              </form>
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Benefits of creating an account:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Track your order status</li>
                  <li>• Save items to your wishlist</li>
                  <li>• Faster checkout process</li>
                  <li>• Exclusive member offers</li>
                  <li>• Order history and reordering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
