"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { getProducts, Product } from "@/lib/products-store"

export function ProductSection() {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  if (products.length === 0) {
    return null
  }

  const product = products[0]

  return (
    <section id="products" className="bg-secondary/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            منتجنا المميز
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            {product.nameAr}
          </h2>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-square bg-muted/50 lg:aspect-auto">
                <Image
                  src={product.imageUrl}
                  alt={product.nameAr}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                  <span className="mr-2 text-sm text-muted-foreground">(47 تقييم)</span>
                </div>

                <h3 className="mb-2 font-serif text-2xl font-bold text-foreground lg:text-3xl">
                  {product.nameAr}
                </h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  {product.nameEn}
                </p>

                <div className="mb-6 flex items-center gap-4">
                  <div>
                    <span className="text-3xl font-bold text-foreground">{product.price}</span>
                    <span className="mr-1 text-lg text-muted-foreground">ر.س</span>
                    {product.originalPrice && (
                      <span className="mr-2 text-lg text-muted-foreground line-through">
                        {product.originalPrice} ر.س
                      </span>
                    )}
                  </div>
                  {product.stock === 0 ? (
                    <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                      نفذ
                    </span>
                  ) : (
                    <span className="rounded-full border border-green-600 px-3 py-1 text-sm text-green-600">
                      متوفر
                    </span>
                  )}
                </div>

                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {product.description || "تركيبة فاخرة من زيت اللوز الحلو والجلسرين النباتي مع فيتامين E. يمنح بشرتك ترطيباً عميقاً ونعومة حريرية تدوم طوال اليوم."}
                </p>

                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span>زيت اللوز الحلو</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span>الجلسرين النباتي</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span>فيتامين E</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span>مكونات سرية خاصة</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-lg font-medium transition-colors hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="min-w-[3rem] text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-lg font-medium transition-colors hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 gap-2"
                    disabled={product.stock === 0}
                    onClick={() => {
                      if (product.stock === 0) return
                      for (let i = 0; i < quantity; i++) {
                        addItem({
                          id: product.id,
                          name: product.nameAr,
                          price: product.price,
                          image: product.imageUrl
                        })
                      }
                      setAdded(true)
                      setTimeout(() => setAdded(false), 2000)
                      setQuantity(1)
                    }}
                  >
                    {product.stock === 0 ? (
                      <>نفذ من المخزون</>
                    ) : added ? (
                      <>
                        <Check className="h-5 w-5" />
                        تمت الإضافة
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        أضف للسلة
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
