const ingredients = [
  {
    name: "زيت اللوز الحلو",
    description: "زيت طبيعي غني يرطب البشرة بعمق ويمنحها نعومة حريرية",
    benefit: "ترطيب عميق"
  },
  {
    name: "الجلسرين النباتي",
    description: "مرطب طبيعي يحافظ على رطوبة البشرة ويحميها من الجفاف",
    benefit: "حماية مستمرة"
  },
  {
    name: "فيتامين E",
    description: "مضاد أكسدة قوي يحارب علامات التقدم بالسن ويجدد خلايا البشرة",
    benefit: "تجديد البشرة"
  },
  {
    name: "مكونات سرية خاصة",
    description: "تركيبة حصرية من خلاصات طبيعية مختارة بعناية لنتائج استثنائية",
    benefit: "سر التميز"
  }
]

export function Ingredients() {
  return (
    <section id="ingredients" className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            المكونات
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            أسرار الطبيعة في كل قطرة
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    {ingredient.name}
                  </h3>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {ingredient.benefit}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {ingredient.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
