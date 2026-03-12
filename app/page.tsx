import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ProductSection } from "@/components/product-section"
import { Story } from "@/components/story"
import { Ingredients } from "@/components/ingredients"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ProductSection />
      <Story />
      <Ingredients />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
