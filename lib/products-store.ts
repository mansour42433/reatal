"use client"

export interface Product {
  id: string
  name: string
  nameAr: string
  nameEn: string
  price: number
  originalPrice?: number
  description?: string
  imageUrl: string
  active: boolean
}

// تخزين مؤقت للمنتجات (سيتم استبداله بـ Supabase لاحقاً)
let productsStore: Product[] = [
  {
    id: "rital-cream",
    name: "كريم الجسم",
    nameAr: "كريم الجسم",
    nameEn: "Body Cream",
    price: 50,
    description: "تركيبة فاخرة من زيت اللوز الحلو والجلسرين النباتي مع فيتامين E",
    imageUrl: "/images/rital-cream.jpg",
    active: true
  }
]

export const getProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('rital-products')
    if (stored) {
      productsStore = JSON.parse(stored)
    }
  }
  return productsStore.filter(p => p.active)
}

export const getAllProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('rital-products')
    if (stored) {
      productsStore = JSON.parse(stored)
    }
  }
  return productsStore
}

export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find(p => p.id === id)
}

export const updateProduct = (id: string, updates: Partial<Product>): boolean => {
  const index = productsStore.findIndex(p => p.id === id)
  if (index === -1) return false

  productsStore[index] = { ...productsStore[index], ...updates }

  if (typeof window !== 'undefined') {
    localStorage.setItem('rital-products', JSON.stringify(productsStore))
  }

  return true
}

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const newProduct: Product = {
    ...product,
    id: `product-${Date.now()}`
  }

  productsStore.push(newProduct)

  if (typeof window !== 'undefined') {
    localStorage.setItem('rital-products', JSON.stringify(productsStore))
  }

  return newProduct
}

export const deleteProduct = (id: string): boolean => {
  const index = productsStore.findIndex(p => p.id === id)
  if (index === -1) return false

  productsStore.splice(index, 1)

  if (typeof window !== 'undefined') {
    localStorage.setItem('rital-products', JSON.stringify(productsStore))
  }

  return true
}
