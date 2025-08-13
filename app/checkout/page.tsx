'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useStore } from '@/lib/store'
import { ShoppingBag, CreditCard, Truck, MapPin, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  billingAddress: string
  billingCity: string
  billingPostalCode: string
  billingCountry: string
  shippingAddress: string
  shippingCity: string
  shippingPostalCode: string
  shippingCountry: string
  sameAsBilling: boolean
  paymentMethod: string
  deliveryMethod: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, getCartItemCount, clearCart, user } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'Bangladesh',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'Bangladesh',
    sameAsBilling: true,
    paymentMethod: 'cod',
    deliveryMethod: 'standard',
    notes: ''
  })

  // modals
  const [showConfirm, setShowConfirm] = useState(false)
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false)
  const successOkRef = useRef<HTMLButtonElement | null>(null)

  const shippingCost = formData.deliveryMethod === 'express' ? 200 : (getCartTotal() > 2000 ? 0 : 100)
  const subtotal = getCartTotal()
  const total = subtotal + shippingCost

  // ⛔️ Do not auto-redirect when success modal is showing
  useEffect(() => {
    if (cart.length === 0 && !showOrderSuccessModal) {
      router.push('/')
    }
  }, [cart.length, showOrderSuccessModal, router])

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'sameAsBilling' && value === true ? {
        shippingAddress: prev.billingAddress,
        shippingCity: prev.billingCity,
        shippingPostalCode: prev.billingPostalCode,
        shippingCountry: prev.billingCountry
      } : {})
    }))
  }

  const validateForm = () => {
    const required: (keyof CheckoutForm)[] = [
      'firstName', 'lastName', 'email', 'phone',
      'billingAddress', 'billingCity', 'billingPostalCode'
    ]
    if (!formData.sameAsBilling) {
      required.push('shippingAddress', 'shippingCity', 'shippingPostalCode')
    }
    for (const field of required) {
      if (!String(formData[field] ?? '').trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in ${String(field).replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive"
        })
        return false
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" })
      return false
    }
    const phoneRegex = /^(\+880|880|0)?[1-9]\d{8,10}$/
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number (e.g., 01712345678 or +8801712345678)",
        variant: "destructive"
      })
      return false
    }
    return true
  }

  const handlePlaceOrderClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setShowConfirm(true)
  }

  const handleConfirmOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        subtotal,
        shippingAmount: shippingCost,
        totalAmount: total,
        billingAddress: {
          address: formData.billingAddress,
          city: formData.billingCity,
          postalCode: formData.billingPostalCode,
          country: formData.billingCountry
        },
        shippingAddress: formData.sameAsBilling ? {
          address: formData.billingAddress,
          city: formData.billingCity,
          postalCode: formData.billingPostalCode,
          country: formData.billingCountry
        } : {
          address: formData.shippingAddress,
          city: formData.shippingCity,
          postalCode: formData.shippingPostalCode,
          country: formData.shippingCountry
        },
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
        notes: formData.notes
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        setShowConfirm(false)
        setShowOrderSuccessModal(true)
        setTimeout(() => successOkRef.current?.focus(), 0)
        document.body.style.overflow = 'hidden' // lock scroll
      } else {
        const errorText = await response.text()
        let errorMessage = "Failed to place order. Please try again."
        try {
          const error = JSON.parse(errorText)
          errorMessage = error.error || error.message || errorMessage
        } catch {}
        toast({ title: "Order Failed", description: errorMessage, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessOk = () => {
    setShowOrderSuccessModal(false)
    document.body.style.overflow = '' // restore scroll
    router.push('/')
  }

  // Allow ESC only for confirm modal (success modal must wait for OK)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirm) setShowConfirm(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showConfirm])

  // If cart is empty but success modal is up, keep the page to show the modal
  if (cart.length === 0 && !showOrderSuccessModal) return null

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-[#6EC1D1]" />
              Checkout
            </h1>

            <form onSubmit={handlePlaceOrderClick}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              placeholder="Enter first name"
                              required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              placeholder="Enter last name"
                              required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter email address"
                              required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+880 1X XX XX XX XX"
                              required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Billing Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="billingAddress">Street Address *</Label>
                        <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                            placeholder="Enter your street address"
                            required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billingCity">City *</Label>
                          <Input
                              id="billingCity"
                              value={formData.billingCity}
                              onChange={(e) => handleInputChange('billingCity', e.target.value)}
                              placeholder="City"
                              required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingPostalCode">Postal Code *</Label>
                          <Input
                              id="billingPostalCode"
                              value={formData.billingPostalCode}
                              onChange={(e) => handleInputChange('billingPostalCode', e.target.value)}
                              placeholder="Postal Code"
                              required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingCountry">Country</Label>
                          <Input
                              id="billingCountry"
                              value={formData.billingCountry}
                              onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                              disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sameAsBilling"
                            checked={formData.sameAsBilling}
                            onCheckedChange={(checked) => handleInputChange('sameAsBilling', Boolean(checked))}
                        />
                        <Label htmlFor="sameAsBilling">Same as billing address</Label>
                      </div>
                      {!formData.sameAsBilling && (
                          <>
                            <div>
                              <Label htmlFor="shippingAddress">Street Address *</Label>
                              <Input
                                  id="shippingAddress"
                                  value={formData.shippingAddress}
                                  onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                                  placeholder="Enter shipping address"
                                  required
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="shippingCity">City *</Label>
                                <Input
                                    id="shippingCity"
                                    value={formData.shippingCity}
                                    onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                                    placeholder="City"
                                    required
                                />
                              </div>
                              <div>
                                <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                                <Input
                                    id="shippingPostalCode"
                                    value={formData.shippingPostalCode}
                                    onChange={(e) => handleInputChange('shippingPostalCode', e.target.value)}
                                    placeholder="Postal Code"
                                    required
                                />
                              </div>
                              <div>
                                <Label htmlFor="shippingCountry">Country</Label>
                                <Input
                                    id="shippingCountry"
                                    value={formData.shippingCountry}
                                    onChange={(e) => handleInputChange('shippingCountry', e.target.value)}
                                    disabled
                                />
                              </div>
                            </div>
                          </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Delivery & Payment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Delivery & Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-base font-medium">Delivery Method</Label>
                        <RadioGroup
                            value={formData.deliveryMethod}
                            onValueChange={(value) => handleInputChange('deliveryMethod', value)}
                            className="mt-2"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="flex-1">
                              <div className="font-medium">Standard Delivery (3-5 days)</div>
                              <div className="text-sm text-gray-500">
                                {getCartTotal() > 2000 ? 'Free' : '৳100'} - Regular delivery
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="flex-1">
                              <div className="font-medium">Express Delivery (1-2 days)</div>
                              <div className="text-sm text-gray-500">৳200 - Fast delivery</div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label className="text-base font-medium">Payment Method</Label>
                        <RadioGroup
                            value={formData.paymentMethod}
                            onValueChange={(value) => handleInputChange('paymentMethod', value)}
                            className="mt-2"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="flex-1">
                              <div className="font-medium">Cash on Delivery</div>
                              <div className="text-sm text-gray-500">Pay when you receive your order</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                            <RadioGroupItem value="online" id="online" disabled />
                            <Label htmlFor="online" className="flex-1">
                              <div className="font-medium">Online Payment</div>
                              <div className="text-sm text-gray-500">Credit Card / Mobile Banking (Coming Soon)</div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Special delivery instructions, gift message, etc."
                            rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-8">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {cart.map((item) => {
                          let imageUrl = '/placeholder.jpg'
                          const img = (item.product as any).images
                          if (Array.isArray(img) && img.length > 0) {
                            imageUrl = img[0]
                          } else if (typeof img === 'string') {
                            try {
                              const parsed = JSON.parse(img)
                              if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0]
                            } catch {
                              const csvSplit = img.split(',').map((s) => s.trim()).filter(Boolean)
                              if (csvSplit.length > 0) imageUrl = csvSplit[0]
                            }
                          } else if (item.product.image) {
                            imageUrl = item.product.image
                          }
                          return (
                              <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Image
                                    src={imageUrl}
                                    alt={item.product.name}
                                    width={50}
                                    height={50}
                                    className="rounded object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{item.product.name}</h4>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-sm font-medium">
                                  ৳{(item.product.price * item.quantity).toFixed(0)}
                                </div>
                              </div>
                          )
                        })}
                      </div>
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal ({getCartItemCount()} items)</span>
                          <span>৳{subtotal.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>{shippingCost === 0 ? 'Free' : `৳${shippingCost}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span className="text-[#6EC1D1]">৳{total.toFixed(0)}</span>
                        </div>
                      </div>
                      <Button
                          type="submit"
                          className="w-full bg-[#6EC1D1] hover:bg-[#5AAFBF] text-white font-semibold h-12"
                          disabled={loading}
                      >
                        {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Processing...
                            </div>
                        ) : (
                            `Place Order - ৳${total.toFixed(0)}`
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        By placing your order, you agree to our Terms & Conditions and Privacy Policy.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Confirm Modal (dismissible) */}
        {showConfirm && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                role="dialog"
                aria-modal="true"
                onClick={() => !loading && setShowConfirm(false)}
            >
              <div
                  className="bg-white rounded-xl p-8 shadow-xl w-full max-w-sm text-center border"
                  onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">Are you sure you want to place this order?</h3>
                <div className="flex gap-4 justify-center">
                  <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleConfirmOrder}
                      disabled={loading}
                  >
                    Yes
                  </Button>
                  <Button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700"
                      onClick={() => setShowConfirm(false)}
                      disabled={loading}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
        )}

        {/* Success Modal (non-dismissible: waits for OK) */}
        {showOrderSuccessModal && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                role="dialog"
                aria-modal="true"
                // no backdrop close, no ESC close
            >
              <div
                  className="bg-white rounded-xl p-8 shadow-xl w-full max-w-sm text-center border"
                  onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-2 text-green-600">Order Successfully Generated!</h3>
                <p className="mb-6 text-gray-700">
                  Your order has been successfully generated. We will contact you soon.
                </p>
                <div className="flex gap-3">
                  <Button
                      ref={successOkRef}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      onClick={handleSuccessOk}
                      autoFocus
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
