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
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Search,
  LogOut,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Tag,
  Pencil,
  Trash2,
  Plus,
  Save,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
import Link from "next/link"

const ADMIN_PASSWORD = "admin123"

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  customerName: string
  phone: string
  city: string
  products: string
  quantity: number
  total: number
  status: OrderStatus
  date: string
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
}

interface DiscountCode {
  id: string
  code: string
  discount: number
  active: boolean
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "سارة الأحمد",
    phone: "0501234567",
    city: "الرياض",
    products: "كريم ريتال للجسم",
    quantity: 2,
    total: 298,
    status: "pending",
    date: "2026-03-12"
  },
  {
    id: "ORD-002",
    customerName: "نورة العتيبي",
    phone: "0559876543",
    city: "جدة",
    products: "كريم ريتال للجسم",
    quantity: 1,
    total: 149,
    status: "processing",
    date: "2026-03-11"
  },
  {
    id: "ORD-003",
    customerName: "فاطمة الشمري",
    phone: "0541112233",
    city: "الدمام",
    products: "كريم ريتال للجسم",
    quantity: 3,
    total: 447,
    status: "shipped",
    date: "2026-03-10"
  },
  {
    id: "ORD-004",
    customerName: "مريم القحطاني",
    phone: "0533445566",
    city: "مكة",
    products: "كريم ريتال للجسم",
    quantity: 1,
    total: 149,
    status: "delivered",
    date: "2026-03-09"
  },
  {
    id: "ORD-005",
    customerName: "هند الدوسري",
    phone: "0522334455",
    city: "المدينة",
    products: "كريم ريتال للجسم",
    quantity: 2,
    total: 298,
    status: "cancelled",
    date: "2026-03-08"
  }
]

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-800", icon: Clock },
  processing: { label: "قيد التجهيز", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "تم التوصيل", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800", icon: XCircle }
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  
  // Products state
  const [products, setProducts] = useState<Product[]>([
    { id: "rital-cream", name: "كريم ريتال للجسم", price: 149 }
  ])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState("")
  
  // Discount codes state
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    { id: "1", code: "RITAL10", discount: 10, active: true },
    { id: "2", code: "RITAL20", discount: 20, active: true },
    { id: "3", code: "WELCOME", discount: 15, active: true },
  ])
  const [newCode, setNewCode] = useState("")
  const [newDiscount, setNewDiscount] = useState("")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.includes(searchTerm) || 
      order.id.includes(searchTerm) ||
      order.phone.includes(searchTerm)
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const updateProductPrice = (productId: string) => {
    if (!newPrice) return
    setProducts(products.map(p => 
      p.id === productId ? { ...p, price: Number(newPrice) } : p
    ))
    setEditingProduct(null)
    setNewPrice("")
  }

  const addDiscountCode = () => {
    if (!newCode || !newDiscount) return
    setDiscountCodes([
      ...discountCodes,
      {
        id: Date.now().toString(),
        code: newCode.toUpperCase(),
        discount: Number(newDiscount),
        active: true
      }
    ])
    setNewCode("")
    setNewDiscount("")
  }

  const toggleDiscountCode = (id: string) => {
    setDiscountCodes(discountCodes.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ))
  }

  const deleteDiscountCode = (id: string) => {
    setDiscountCodes(discountCodes.filter(c => c.id !== id))
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
  }, [])

  // Login Screen
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
      {/* Header */}
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
        {/* Stats Cards */}
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
                العملاء
              </CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.totalCustomers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="prices">الأسعار</TabsTrigger>
            <TabsTrigger value="discounts">أكواد الخصم</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-xl">إدارة الطلبات</CardTitle>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الطلب</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="text-right">الهاتف</TableHead>
                        <TableHead className="text-right">المدينة</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">تغيير الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                            لا توجد طلبات مطابقة للبحث
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => {
                          const StatusIcon = statusConfig[order.status].icon
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customerName}</TableCell>
                              <TableCell dir="ltr" className="text-right">{order.phone}</TableCell>
                              <TableCell>{order.city}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell>{order.total} ر.س</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>
                                <Badge className={`gap-1 ${statusConfig[order.status].color}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {statusConfig[order.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                                >
                                  <SelectTrigger className="w-32">
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
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prices Tab */}
          <TabsContent value="prices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="h-5 w-5" />
                  إدارة الأسعار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">معرف المنتج: {product.id}</p>
                      </div>
                      
                      {editingProduct === product.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="السعر الجديد"
                            className="w-32"
                          />
                          <span className="text-muted-foreground">ر.س</span>
                          <Button size="sm" onClick={() => updateProductPrice(product.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingProduct(null)}>
                            إلغاء
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-foreground">
                            {product.price} ر.س
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product.id)
                              setNewPrice(product.price.toString())
                            }}
                          >
                            <Pencil className="ml-1 h-4 w-4" />
                            تعديل
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discount Codes Tab */}
          <TabsContent value="discounts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Tag className="h-5 w-5" />
                  أكواد الخصم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add new code */}
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
                      <Button onClick={addDiscountCode} className="w-full gap-2 sm:w-auto">
                        <Plus className="h-4 w-4" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Existing codes */}
                <div className="space-y-3">
                  {discountCodes.map((code) => (
                    <div
                      key={code.id}
                      className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                        code.active ? "border-border bg-card" : "border-muted bg-muted/50"
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
                          onClick={() => toggleDiscountCode(code.id)}
                        >
                          {code.active ? "تعطيل" : "تفعيل"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteDiscountCode(code.id)}
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
