"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface DiscountCode {
  code: string
  discount: number // percentage
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  discount: number
  total: number
  appliedCode: string | null
  applyDiscount: (code: string) => boolean
  removeDiscount: () => void
}

const validCodes: DiscountCode[] = [
  { code: "RITAL10", discount: 10 },
  { code: "RITAL20", discount: 20 },
  { code: "WELCOME", discount: 15 },
]

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [discountPercent, setDiscountPercent] = useState(0)

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedCode(null)
    setDiscountPercent(0)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = (subtotal * discountPercent) / 100
  const total = subtotal - discount

  const applyDiscount = (code: string): boolean => {
    const validCode = validCodes.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    )
    if (validCode) {
      setAppliedCode(validCode.code)
      setDiscountPercent(validCode.discount)
      return true
    }
    return false
  }

  const removeDiscount = () => {
    setAppliedCode(null)
    setDiscountPercent(0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        total,
        appliedCode,
        applyDiscount,
        removeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
