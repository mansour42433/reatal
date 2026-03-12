"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, Check } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

export function ProductSection() {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  return (
    <section id="products" className="bg-secondary/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            منتجنا المميز
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            كريم ريتال للجسم
          </h2>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="grid lg:grid-cols-2">
              {/* Product Image */}
              <div className="relative aspect-square bg-muted/50 lg:aspect-auto">
                <Image
                  src="/images/rital-cream.jpg"
                  alt="كريم ريتال للجسم"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                  <span className="mr-2 text-sm text-muted-foreground">(47 تقييم)</span>
                </div>

                <h3 className="mb-2 font-serif text-2xl font-bold text-foreground lg:text-3xl">
                  زيت الاستحمام - ليمون وزيتون
                </h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Artisan Body Oil
                </p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">149</span>
                  <span className="mr-1 text-lg text-muted-foreground">ر.س</span>
                </div>

                <p className="mb-6 leading-relaxed text-muted-foreground">
                  تركيبة فاخرة من زيت اللوز الحلو والجلسرين النباتي مع فيتامين E.
                  يمنح بشرتك ترطيباً عميقاً ونعومة حريرية تدوم طوال اليوم.
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

                {/* Quantity & Add to Cart */}
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
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        addItem({
                          id: "rital-cream",
                          name: "كريم ريتال للجسم",
                          price: 149,
                          image: "/images/rital-cream.jpg"
                        })
                      }
                      setAdded(true)
                      setTimeout(() => setAdded(false), 2000)
                      setQuantity(1)
                    }}
                  >
                    {added ? (
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
