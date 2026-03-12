"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Package, ShoppingCart, Users, DollarSign, Search, LogOut, CircleCheck as CheckCircle, Clock, Truck, Circle as XCircle, Tag, Pencil, Trash2, Plus, Save, Lock, Eye, EyeOff, X, Printer, MapPin, Phone, User } from "lucide-react"
import Link from "next/link"
import { Product, getAllProducts, updateProduct, addProduct, deleteProduct } from "@/lib/products-store"
import { useCart } from "@/lib/cart-context"
import { Order, OrderStatus, getAllOrders, updateOrderStatus as updateOrderStatusStore, deleteOrder, statusConfig } from "@/lib/orders-store"
import Image from "next/image"

const ADMIN_PASSWORD = "admin123"

const statusIcons: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    nameAr: "",
    nameEn: "",
    price: 0,
    imageUrl: "/images/rital-cream.jpg",
    active: true,
    stock: 10
  })

  // Discount codes from cart context
  const { discountCodes, addDiscountCode: addCode, toggleDiscountCode: toggleCode, deleteDiscountCode: deleteCode } = useCart()
  const [newCode, setNewCode] = useState("")
  const [newDiscount, setNewDiscount] = useState("")

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.includes(searchTerm) ||
      order.orderNumber.includes(searchTerm) ||
      order.phone.includes(searchTerm)
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const loadOrders = () => {
    setOrders(getAllOrders())
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatusStore(orderId, newStatus)
    loadOrders()
  }

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      deleteOrder(orderId)
      loadOrders()
    }
  }

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: left;">${item.price} ر.س</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: left;">${item.price * item.quantity} ر.س</td>
      </tr>
    `).join("")

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>طلب ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #333; }
          .header p { margin: 5px 0; color: #666; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .info-box { flex: 1; padding: 15px; background: #f9f9f9; border-radius: 8px; margin: 0 5px; }
          .info-box h3 { margin: 0 0 10px 0; color: #333; font-size: 14px; }
          .info-box p { margin: 5px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: right; border-bottom: 2px solid #ddd; }
          .totals { text-align: left; margin-top: 20px; }
          .totals p { margin: 5px 0; }
          .totals .total { font-size: 18px; font-weight: bold; color: #333; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>متجر ريتال</h1>
          <p>فاتورة طلب</p>
        </div>
        
        <div class="info-section">
          <div class="info-box">
            <h3>معلومات الطلب</h3>
            <p><strong>رقم الطلب:</strong> ${order.orderNumber}</p>
            <p><strong>التاريخ:</strong> ${new Date(order.createdAt).toLocaleDateString("ar-SA")}</p>
            <p><strong>الحالة:</strong> ${statusConfig[order.status].label}</p>
          </div>
          <div class="info-box">
            <h3>معلومات العميل</h3>
            <p><strong>الاسم:</strong> ${order.customerName}</p>
            <p><strong>الجوال:</strong> ${order.phone}</p>
            <p><strong>المدينة:</strong> ${order.city}</p>
          </div>
        </div>
        
        <div class="info-box" style="margin-bottom: 20px;">
          <h3>العنوان</h3>
          <p>${order.address}</p>
          ${order.notes ? `<p><strong>ملاحظات:</strong> ${order.notes}</p>` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th style="text-align: center;">الكمية</th>
              <th style="text-align: left;">السعر</th>
              <th style="text-align: left;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div class="totals">
          <p>المجموع الفرعي: ${order.subtotal} ر.س</p>
          ${order.discount > 0 ? `<p style="color: green;">الخصم ${order.discountCode ? `(${order.discountCode})` : ""}: -${order.discount} ر.س</p>` : ""}
          <p class="total">الإجمالي: ${order.total} ر.س</p>
        </div>

        <div class="footer">
          <p>شكراً لتسوقكم من متجر ريتال</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `
    
    printWindow.document.write(html)
    printWindow.document.close()
  }

  const loadProducts = () => {
    setProducts(getAllProducts())
  }

  const handleUpdateProduct = (productId: string) => {
    if (!editForm.name || !editForm.price) return

    const success = updateProduct(productId, editForm)
    if (success) {
      loadProducts()
      setEditingProduct(null)
      setEditForm({})
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.nameAr || !newProduct.nameEn || !newProduct.price) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    addProduct(newProduct)
    loadProducts()
    setShowAddProduct(false)
    setNewProduct({
      name: "",
      nameAr: "",
      nameEn: "",
      price: 0,
      imageUrl: "/images/rital-cream.jpg",
      active: true,
      stock: 10
    })
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProduct(productId)
      loadProducts()
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product.id)
    setEditForm({
      name: product.name,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      active: product.active,
      stock: product.stock
    })
  }

  const handleAddDiscountCode = () => {
    if (!newCode || !newDiscount) return
    addCode(newCode, Number(newDiscount))
    setNewCode("")
    setNewDiscount("")
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    totalRevenue: orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0),
    totalCustomers: new Set(orders.map(o => o.phone)).size
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', 'true')
      }
    } else {
      setError("كلمة المرور غير صحيحة")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword("")
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAuth')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      }
    }
    loadProducts()
    loadOrders()
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">لوحة تحكم ريتال</CardTitle>
            <CardDescription>أدخل كلمة المرور للوصول إلى لوحة الإدارة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pl-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                دخول
              </Button>
              <Link href="/" className="block">
                <Button type="button" variant="ghost" className="w-full">
                  العودة للمتجر
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-2xl font-bold text-foreground">
              لوحة تحكم ريتال
            </h1>
            <Badge variant="secondary">الإدارة</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                العودة للمتجر
              </Button>
            </Link>
            <Button variant="ghost" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              تسجيل خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي الطلبات
              </CardTitle>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                طلبات قيد الانتظار
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{stats.pendingOrders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي الإيرادات
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.totalRevenue} ر.س</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                عدد المنتجات
              </CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{products.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="discounts">��كواد الخصم</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5" />
                    إدارة المنتجات
                  </CardTitle>
                  <Button onClick={() => setShowAddProduct(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة منتج
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {showAddProduct && (
                    <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">إضافة منتج جديد</h3>
                        <Button size="sm" variant="ghost" onClick={() => setShowAddProduct(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>الاسم (عربي)</Label>
                          <Input
                            value={newProduct.nameAr}
                            onChange={(e) => setNewProduct({...newProduct, nameAr: e.target.value, name: e.target.value})}
                            placeholder="كريم ريتال للجسم"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>الاسم (إنجليزي)</Label>
                          <Input
                            value={newProduct.nameEn}
                            onChange={(e) => setNewProduct({...newProduct, nameEn: e.target.value})}
                            placeholder="Rital Body Cream"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>السعر</Label>
                          <Input
                            type="number"
                            value={newProduct.price || ""}
                            onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            placeholder="149"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>السعر الأصلي (اختياري)</Label>
                          <Input
                            type="number"
                            value={newProduct.originalPrice || ""}
                            onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value) || undefined})}
                            placeholder="199"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>المخزون</Label>
                          <Input
                            type="number"
                            value={newProduct.stock || ""}
                            onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                            placeholder="10"
                            min="0"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>الوصف</Label>
                          <Textarea
                            value={newProduct.description || ""}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            placeholder="وصف المنتج..."
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleAddProduct}>
                          <Plus className="ml-1 h-4 w-4" />
                          إضافة المنتج
                        </Button>
                      </div>
                    </div>
                  )}

                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      {editingProduct === product.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">تعديل المنتج</h3>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setEditingProduct(null)
                              setEditForm({})
                            }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>الاسم (عربي)</Label>
                              <Input
                                value={editForm.nameAr || ""}
                                onChange={(e) => setEditForm({...editForm, nameAr: e.target.value, name: e.target.value})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>الاسم (إنجليزي)</Label>
                              <Input
                                value={editForm.nameEn || ""}
                                onChange={(e) => setEditForm({...editForm, nameEn: e.target.value})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>السعر</Label>
                              <Input
                                type="number"
                                value={editForm.price || ""}
                                onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>السعر الأصلي</Label>
                              <Input
                                type="number"
                                value={editForm.originalPrice || ""}
                                onChange={(e) => setEditForm({...editForm, originalPrice: Number(e.target.value) || undefined})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>المخزون</Label>
                              <Input
                                type="number"
                                value={editForm.stock ?? 0}
                                onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                                min="0"
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label>الوصف</Label>
                              <Textarea
                                value={editForm.description || ""}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                rows={3}
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`active-${product.id}`}
                                checked={editForm.active ?? true}
                                onChange={(e) => setEditForm({...editForm, active: e.target.checked})}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={`active-${product.id}`}>منتج نشط</Label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                              setEditingProduct(null)
                              setEditForm({})
                            }}>
                              إلغاء
                            </Button>
                            <Button onClick={() => handleUpdateProduct(product.id)}>
                              <Save className="ml-1 h-4 w-4" />
                              حفظ التغييرات
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{product.nameAr}</h3>
                                <Badge variant={product.active ? "default" : "secondary"}>
                                  {product.active ? "نشط" : "غير نشط"}
                                </Badge>
                                {product.stock === 0 ? (
                                  <Badge variant="destructive" className="bg-red-500 text-white">
                                    نفذ
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    المخزون: {product.stock}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                              {product.description && (
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-foreground">
                                  {product.price} ر.س
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {product.originalPrice} ر.س
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditProduct(product)}
                            >
                              <Pencil className="ml-1 h-4 w-4" />
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {products.length === 0 && !showAddProduct && (
                    <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">لا توجد منتجات</p>
                      <Button onClick={() => setShowAddProduct(true)} className="mt-4" variant="outline">
                        <Plus className="ml-1 h-4 w-4" />
                        إضافة منتج جديد
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingCart className="h-5 w-5" />
                    إدارة الطلبات
                  </CardTitle>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالاسم أو رقم الطلب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 md:w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="حالة الطلب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="processing">قيد التجهيز</SelectItem>
                        <SelectItem value="shipped">تم الشحن</SelectItem>
                        <SelectItem value="delivered">تم التوصيل</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">لا توجد طلبات حتى الآن</p>
                    <p className="mt-2 text-sm text-muted-foreground">ستظهر الطلبات هنا عند استلامها من العملاء</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const StatusIcon = statusIcons[order.status]
                      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
                      return (
                        <div
                          key={order.id}
                          className="rounded-lg border border-border bg-card p-4"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            {/* Order Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-lg font-bold text-foreground">{order.orderNumber}</span>
                                <Badge className={`gap-1 ${statusConfig[order.status].color}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {statusConfig[order.status].label}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>
                              </div>

                              {/* Customer Details */}
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span dir="ltr">{order.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{order.city}</span>
                                </div>
                              </div>

                              {/* Address */}
                              <div className="rounded-md bg-muted/50 p-3">
                                <p className="text-sm font-medium text-foreground">العنوان:</p>
                                <p className="text-sm text-muted-foreground">{order.address}</p>
                                {order.notes && (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">ملاحظات:</span> {order.notes}
                                  </p>
                                )}
                              </div>

                              {/* Products */}
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">المنتجات ({totalQuantity} قطعة):</p>
                                <div className="flex flex-wrap gap-2">
                                  {order.items.map((item, idx) => (
                                    <Badge key={idx} variant="outline" className="gap-1">
                                      {item.name} × {item.quantity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Totals */}
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span>المجموع: <span className="font-bold">{order.subtotal} ر.س</span></span>
                                {order.discount > 0 && (
                                  <span className="text-green-600">
                                    خصم {order.discountCode && `(${order.discountCode})`}: -{order.discount} ر.س
                                  </span>
                                )}
                                <span className="text-lg font-bold text-foreground">
                                  الإجمالي: {order.total} ر.س
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value as OrderStatus)}
                              >
                                <SelectTrigger className="w-full sm:w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                                  <SelectItem value="processing">قيد التجهيز</SelectItem>
                                  <SelectItem value="shipped">تم الشحن</SelectItem>
                                  <SelectItem value="delivered">تم التوصيل</SelectItem>
                                  <SelectItem value="cancelled">ملغي</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handlePrintOrder(order)}
                              >
                                <Printer className="h-4 w-4" />
                                طباعة
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discounts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Tag className="h-5 w-5" />
                  أكواد الخصم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-dashed border-border p-4">
                  <h4 className="mb-4 font-medium text-foreground">إضافة كود خصم جديد</h4>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="code">اسم الكود</Label>
                      <Input
                        id="code"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="مثال: SUMMER25"
                      />
                    </div>
                    <div className="w-full space-y-2 sm:w-32">
                      <Label htmlFor="discount">نسبة الخصم %</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={newDiscount}
                        onChange={(e) => setNewDiscount(e.target.value)}
                        placeholder="10"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddDiscountCode} className="w-full gap-2 sm:w-auto">
                        <Plus className="h-4 w-4" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {discountCodes.map((code) => (
                    <div
                      key={code.id}
                      className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${code.active ? "border-border bg-card" : "border-muted bg-muted/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Tag className={`h-5 w-5 ${code.active ? "text-primary" : "text-muted-foreground"}`} />
                        <div>
                          <span className={`font-mono text-lg font-bold ${code.active ? "text-foreground" : "text-muted-foreground"}`}>
                            {code.code}
                          </span>
                          <Badge variant={code.active ? "default" : "secondary"} className="mr-2">
                            {code.discount}% خصم
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={code.active ? "outline" : "default"}
                          onClick={() => toggleCode(code.id)}
                        >
                          {code.active ? "تعطيل" : "تفعيل"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteCode(code.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
