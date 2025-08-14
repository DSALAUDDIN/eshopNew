"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, User, CartItem } from "./types"

interface StoreState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  // Cart state
  cart: CartItem[]
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number

  // Favorites state
  favorites: number[]
  toggleFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Products state
  products: Product[]
  categories: any[]
  loading: boolean
  fetchProducts: (filters?: any) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchProductById: (id: string | number) => Promise<Product | null>
  fetchRelatedProducts: (category: string, excludeId: number, limit?: number) => Promise<Product[]>
  fetchBestSellingProducts: (limit?: number) => Promise<Product[]>
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          if (response.ok) {
            const data = await response.json()
            const user: User = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              isTradeCustomer: data.user.isTradeCustomer
            }
            set({ user })
            localStorage.setItem('authToken', data.token)
            return true
          }
          return false
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },
      logout: () => {
        set({ user: null })
        localStorage.removeItem('authToken')
      },

      // Cart state
      cart: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      addToCart: (product, quantity) => {
        const { cart } = get()
        const existingItem = cart.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ cart: [...cart, { product, quantity }] })
        }
      },
      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.product.id !== productId),
        })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0)
      },

      // Favorites state
      favorites: [],
      toggleFavorite: (productId) => {
        const { favorites } = get()
        const isFavorited = favorites.includes(productId)

        if (isFavorited) {
          set({ favorites: favorites.filter((id) => id !== productId) })
        } else {
          set({ favorites: [...favorites, productId] })
        }
      },
      isFavorite: (productId) => get().favorites.includes(productId),

      // Search state
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Products state
      products: [],
      categories: [],
      loading: false,

      fetchProducts: async (filters = {}) => {
        set({ loading: true })
        try {
          const params = new URLSearchParams()

          // Add filters to params
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value))
          })

          const response = await fetch(`/api/products?${params}`)
          if (response.ok) {
            const data = await response.json()
            // Extract products array from the response object
            set({ products: data.products || [] })
          }
        } catch (error) {
          console.error('Error fetching products:', error)
          set({ products: [] })
        } finally {
          set({ loading: false })
        }
      },

      fetchCategories: async () => {
        try {
          // Add multiple cache-busting parameters to ensure fresh data
          const timestamp = new Date().getTime()
          const random = Math.random().toString(36).substring(7)
          const response = await fetch(`/api/categories?_t=${timestamp}&_r=${random}`, {
            cache: 'no-store', // Disable caching to ensure fresh data
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          })
          if (response.ok) {
            const data = await response.json()
            console.log('Fetched categories:', data.categories, 'at', data.fetchedAt)
            set({ categories: data.categories })
          }
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      },

      fetchProductById: async (id: string | number) => {
        try {
          const response = await fetch(`/api/products/${id}`)
          if (response.ok) {
            const product = await response.json()
            return product
          }
          return null
        } catch (error) {
          console.error('Error fetching product:', error)
          return null
        }
      },

      fetchRelatedProducts: async (category: string, excludeId: number, limit: number = 8) => {
        try {
          const response = await fetch(`/api/products/related?category=${category}&excludeId=${excludeId}&limit=${limit}`)
          if (response.ok) {
            const products = await response.json()
            return products
          }
          return []
        } catch (error) {
          console.error('Error fetching related products:', error)
          return []
        }
      },

      fetchBestSellingProducts: async (limit: number = 8) => {
        try {
          const response = await fetch(`/api/products/best-selling?limit=${limit}`)
          if (response.ok) {
            const products = await response.json()
            return products
          }
          return []
        } catch (error) {
          console.error('Error fetching best selling products:', error)
          return []
        }
      }
    }),
    {
      name: "southern-fashion-store",
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        favorites: state.favorites,
      }),
    }
  )
)
