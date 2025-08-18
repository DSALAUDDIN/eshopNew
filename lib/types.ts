export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  subcategory: string
  isNew: boolean
  isSale: boolean
  isFeatured?: boolean
  description: string
  inStock: boolean
  stockQuantity?: number
  sku: string
  materials?: string
  dimensions?: string
  weight?: number
  reviews?: Review[]
}

export interface Review {
  id: string
  customerName: string
  rating: number
  title?: string
  comment: string
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  email: string
  name: string
  isTradeCustomer: boolean
}
