"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingBag, X, Minus, Plus, Tag, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { addOrder } from "@/lib/orders-store"

interface CustomerInfo {
  name: string
  phone: string
  city: string
  address: string
  notes: string
}

export function CartSheet() {
  const {
    items,
    totalItems,
    subtotal,
    discount,
    total,
    appliedCode,
    removeItem,
    updateQuantity,
    applyDiscount,
    removeDiscount,
    clearCart,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return
    const success = applyDiscount(couponCode)
    if (success) {
      setCouponError("")
      setCouponCode("")
    } else {
      setCouponError("كود الخصم غير صالح")
    }
  }

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {}
    if (!customerInfo.name.trim()) newErrors.name = "الاسم مطلوب"
    if (!customerInfo.phone.trim()) newErrors.phone = "رقم الجوال مطلوب"
    else if (!/^(05|5)\d{8}$/.test(customerInfo.phone.replace(/\s/g, ""))) 
      newErrors.phone = "رقم جوال غير صحيح"
    if (!customerInfo.city.trim()) newErrors.city = "المدينة مطلوبة"
    if (!customerInfo.address.trim()) newErrors.address = "العنوان مطلوب"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    setStep("checkout")
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // حفظ الطلب في localStorage
    const order = addOrder({
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      city: customerInfo.city,
      address: customerInfo.address,
      notes: customerInfo.notes || undefined,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      discount,
      discountCode: appliedCode || undefined,
      total
    })
    
    console.log("Order submitted:", order)
    
    setIsSubmitting(false)
    setStep("success")
    clearCart()
  }

  const handleBackToCart = () => {
    setStep("cart")
    setErrors({})
  }

  const resetAndClose = () => {
    setStep("cart")
    setCustomerInfo({ name: "", phone: "", city: "", address: "", notes: "" })
    setErrors({})
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              {totalItems}
            </span>
          )}
          <span className="sr-only">السلة</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-lg" onCloseAutoFocus={resetAndClose}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            {step === "checkout" && (
              <button onClick={handleBackToCart} className="p-1 hover:bg-muted rounded">
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
            {step === "cart" && <ShoppingBag className="h-5 w-5" />}
            {step === "cart" ? "سلة التسوق" : step === "checkout" ? "إتمام الطلب" : "تم الطلب"}
          </SheetTitle>
        </SheetHeader>

        {/* Success Screen */}
        {step === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">تم استلام طلبك بنجاح</h3>
            <p className="text-muted-foreground">
              شكراً لك! سنتواصل معك قريباً لتأكيد الطلب
            </p>
            <Button onClick={resetAndClose} className="mt-4">
              متابعة التسوق
            </Button>
          </div>
        )}

        {/* Checkout Form */}
        {step === "checkout" && (
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    placeholder="أدخل اسمك الكامل"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال *</Label>
                  <Input
                    id="phone"
                    placeholder="05xxxxxxxx"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className={errors.phone ? "border-red-500" : ""}
                    dir="ltr"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">المدينة *</Label>
                  <Input
                    id="city"
                    placeholder="مثال: الرياض"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان التفصيلي *</Label>
                  <Textarea
                    id="address"
                    placeholder="الحي، الشارع، رقم المبنى..."
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className={errors.address ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    placeholder="أي ملاحظات للتوصيل..."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-4">
              <div className="mb-4 rounded-lg bg-muted/50 p-3">
                <h4 className="mb-2 font-medium">ملخص الطلب</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المنتجات ({totalItems})</span>
                    <span>{subtotal} ر.س</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>-{discount.toFixed(0)} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1 font-semibold">
                    <span>الإجمالي</span>
                    <span>{total.toFixed(0)} ر.س</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  "تأكيد الطلب"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "cart" && items.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">السلة فارغة</p>
            <p className="text-sm text-muted-foreground">
              أضف منتجات للسلة للمتابعة
            </p>
          </div>
        )}

        {step === "cart" && items.length > 0 && (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-foreground">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-md border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1.5 transition-colors hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 transition-colors hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-foreground">
                          {item.price * item.quantity} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Code */}
            <div className="border-t border-border pt-4">
              {appliedCode ? (
                <div className="mb-4 flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      كود {appliedCode} مفعل
                    </span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-sm text-red-600 hover:underline"
                  >
                    إزالة
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="كود الخصم"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      تطبيق
                    </Button>
                  </div>
                  {couponError && (
                    <p className="mt-1 text-sm text-destructive">{couponError}</p>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{subtotal} ر.س</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span>-{discount.toFixed(0)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>الإجمالي</span>
                  <span>{total.toFixed(0)} ر.س</span>
                </div>
              </div>

              <Button className="mt-4 w-full" size="lg" onClick={handleCheckout}>
                إتمام الطلب
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
