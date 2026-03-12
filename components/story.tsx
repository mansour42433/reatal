export function Story() {
  return (
    <section id="story" className="bg-primary py-16 text-primary-foreground lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest opacity-80">
            قصتنا
          </span>
          <h2 className="mb-8 font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
            صُنع بحب وشغف
          </h2>
          <p className="mb-6 text-lg leading-relaxed opacity-90">
            بدأت رحلتنا من شغف حقيقي بالعناية الطبيعية بالبشرة. نؤمن أن الجمال الحقيقي
            يأتي من المكونات النقية التي تهديها لنا الطبيعة.
          </p>
          <p className="text-lg leading-relaxed opacity-90">
            كل قطعة من كريم ريتال تُصنع يدوياً بعناية فائقة، باستخدام أجود أنواع الزيوت
            الطبيعية والمكونات العضوية. نحرص على أن يصلك منتج يليق ببشرتك ويمنحها
            العناية الفائقة التي تستحقها.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-2 font-serif text-4xl font-bold">100%</div>
              <div className="text-sm opacity-80">مكونات طبيعية</div>
            </div>
            <div>
              <div className="mb-2 font-serif text-4xl font-bold">+500</div>
              <div className="text-sm opacity-80">عميل سعيد</div>
            </div>
            <div>
              <div className="mb-2 font-serif text-4xl font-bold">صفر</div>
              <div className="text-sm opacity-80">مواد كيميائية</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
