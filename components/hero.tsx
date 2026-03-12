import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="order-2 text-center lg:order-1 lg:text-right">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
              مصنوع يدوياً بحب
            </span>
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="block text-balance">كريم الجسم</span>
              <span className="block text-balance text-accent">للعناية بالبشرة</span>
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0">
              تركيبة فاخرة من زيت اللوز الحلو والجلسرين النباتي مع فيتامين E.
              منتج حرفي يمنح بشرتك النعومة والإشراق الذي تستحقه.
            </p>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-2xl shadow-2xl lg:max-w-lg">
              <Image
                src="/images/rital-cream.jpg"
                alt="كريم ريتال للجسم"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
    </section>
  )
}
