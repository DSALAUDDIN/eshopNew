"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function CartSidebar() {
  const router = useRouter()
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useStore()

  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#FFA000] text-white">
          <h2 className="text-base md:text-lg font-bold">Shopping Cart ({getCartItemCount()})</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCartOpen(false)}
            className="text-white hover:bg-[#E68900] rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                // --- Consistent image logic as product page ---
                let imageUrl = '/placeholder.svg';
                const img = (item.product as any).images;
                if (Array.isArray(img) && img.length > 0) {
                  imageUrl = img[0];
                } else if (typeof img === 'string') {
                  try {
                    const parsed = JSON.parse(img);
                    if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                  } catch {
                    const csvSplit = img.split(',').map((s) => s.trim()).filter(Boolean);
                    if (csvSplit.length > 0) imageUrl = csvSplit[0];
                  }
                } else if (item.product.image) {
                  imageUrl = item.product.image;
                }
                return (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-white border rounded-xl shadow-md">
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-blue-600 font-bold">৳{item.product.price.toFixed(0)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newQuantity = item.quantity - 1
                            if (newQuantity > 0) {
                              updateQuantity(item.product.id, newQuantity)
                            } else {
                              removeFromCart(item.product.id)
                            }
                          }}
                          className="h-6 w-6 p-0 border-[#FFA000] text-[#FFA000] hover:bg-[#FFF8E1]"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-6 w-6 p-0 border-[#FFA000] text-[#FFA000] hover:bg-[#FFF8E1]"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto text-red-500 hover:bg-red-50 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4 bg-white">
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span className="text-[hsl(var(--primary))]">৳{getCartTotal().toFixed(0)}</span>
            </div>
            <Button
              className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] text-white font-semibold shadow-lg"
              onClick={() => {
                setCartOpen(false)
                router.push('/checkout')
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
