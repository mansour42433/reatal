"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface DiscountCode {
  id: string
  code: string
  discount: number // percentage
  active: boolean
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
  discountCodes: DiscountCode[]
  addDiscountCode: (code: string, discount: number) => void
  toggleDiscountCode: (id: string) => void
  deleteDiscountCode: (id: string) => void
}

const defaultDiscountCodes: DiscountCode[] = [
  { id: "1", code: "RITAL10", discount: 10, active: true },
  { id: "2", code: "RITAL20", discount: 20, active: true },
  { id: "3", code: "WELCOME", discount: 15, active: true },
  { id: "4", code: "ريتال", discount: 50, active: true },
]

const DISCOUNT_STORAGE_KEY = "rital-discount-codes"

const getStoredDiscountCodes = (): DiscountCode[] => {
  if (typeof window === 'undefined') return defaultDiscountCodes
  const stored = localStorage.getItem(DISCOUNT_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultDiscountCodes
    }
  }
  return defaultDiscountCodes
}

const saveDiscountCodes = (codes: DiscountCode[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(codes))
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(defaultDiscountCodes)

  // Load discount codes from localStorage on mount
  useEffect(() => {
    setDiscountCodes(getStoredDiscountCodes())
  }, [])

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
    const validCode = discountCodes.find(
      (c) => c.code.toLowerCase() === code.toLowerCase() && c.active
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

  const addDiscountCode = (code: string, discountAmount: number) => {
    const newCode: DiscountCode = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      discount: discountAmount,
      active: true
    }
    const updatedCodes = [...discountCodes, newCode]
    setDiscountCodes(updatedCodes)
    saveDiscountCodes(updatedCodes)
  }

  const toggleDiscountCode = (id: string) => {
    const updatedCodes = discountCodes.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    )
    setDiscountCodes(updatedCodes)
    saveDiscountCodes(updatedCodes)
  }

  const deleteDiscountCode = (id: string) => {
    const updatedCodes = discountCodes.filter(c => c.id !== id)
    setDiscountCodes(updatedCodes)
    saveDiscountCodes(updatedCodes)
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
        discountCodes,
        addDiscountCode,
        toggleDiscountCode,
        deleteDiscountCode,
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
