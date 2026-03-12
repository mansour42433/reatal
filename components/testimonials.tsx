import { Star } from "lucide-react"

const testimonials = [
  {
    name: "سارة الأحمد",
    text: "كريم رائع جداً! بشرتي أصبحت ناعمة ومرطبة طوال اليوم. الرائحة طبيعية ومنعشة.",
    rating: 5
  },
  {
    name: "نورة محمد",
    text: "أفضل كريم استخدمته للجسم. المكونات الطبيعية واضحة من النتيجة. أنصح به بشدة!",
    rating: 5
  },
  {
    name: "ريم العتيبي",
    text: "منتج حرفي بجودة عالية. التغليف أنيق والكريم فعّال. سأعيد الطلب بالتأكيد.",
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="bg-secondary/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            آراء العملاء
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            ماذا يقولون عنا
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                "{testimonial.text}"
              </p>
              <div className="font-medium text-foreground">
                {testimonial.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
