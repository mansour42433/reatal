import { Leaf, Sparkles, Heart, Shield } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "مكونات طبيعية 100%",
    description: "زيت الزيتون وزبدة الشيا واللوز الطبيعي"
  },
  {
    icon: Sparkles,
    title: "تركيبة حرفية",
    description: "مصنوع يدوياً بعناية فائقة لضمان أعلى جودة"
  },
  {
    icon: Heart,
    title: "عناية فائقة",
    description: "يمنح بشرتك الترطيب العميق والنعومة الدائمة"
  },
  {
    icon: Shield,
    title: "آمن للبشرة",
    description: "خالٍ من المواد الكيميائية الضارة والعطور الصناعية"
  }
]

export function Features() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            لماذا تختار ريتال؟
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            جمال طبيعي يدوم
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-accent/50 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                <feature.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
