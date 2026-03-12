// نظام تخزين الطلبات

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  city: string
  address: string
  notes?: string
  items: OrderItem[]
  subtotal: number
  discount: number
  discountCode?: string
  total: number
  status: OrderStatus
  createdAt: string
}

const ORDERS_STORAGE_KEY = "rital-orders"

// توليد رقم طلب فريد
const generateOrderNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `ORD-${year}${month}${day}-${random}`
}

// جلب جميع الطلبات
export const getAllOrders = (): Order[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

// حفظ الطلبات
const saveOrders = (orders: Order[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  }
}

// إضافة طلب جديد
export const addOrder = (orderData: {
  customerName: string
  phone: string
  city: string
  address: string
  notes?: string
  items: OrderItem[]
  subtotal: number
  discount: number
  discountCode?: string
  total: number
}): Order => {
  const orders = getAllOrders()
  
  const newOrder: Order = {
    id: Date.now().toString(),
    orderNumber: generateOrderNumber(),
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString()
  }
  
  orders.unshift(newOrder) // إضافة الطلب الجديد في البداية
  saveOrders(orders)
  
  return newOrder
}

// تحديث حالة الطلب
export const updateOrderStatus = (orderId: string, status: OrderStatus): boolean => {
  const orders = getAllOrders()
  const orderIndex = orders.findIndex(o => o.id === orderId)
  
  if (orderIndex === -1) return false
  
  orders[orderIndex].status = status
  saveOrders(orders)
  
  return true
}

// حذف طلب
export const deleteOrder = (orderId: string): boolean => {
  const orders = getAllOrders()
  const filteredOrders = orders.filter(o => o.id !== orderId)
  
  if (filteredOrders.length === orders.length) return false
  
  saveOrders(filteredOrders)
  return true
}

// جلب طلب واحد
export const getOrderById = (orderId: string): Order | null => {
  const orders = getAllOrders()
  return orders.find(o => o.id === orderId) || null
}

// إعدادات حالات الطلب
export const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-800" },
  processing: { label: "قيد التجهيز", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "تم التوصيل", color: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" }
}
