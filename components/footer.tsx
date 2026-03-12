import Link from "next/link"
import { Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary py-12 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 inline-block font-serif text-2xl font-bold">
              ريتال
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              منتجات عناية طبيعية مصنوعة يدوياً بحب وشغف.
              نؤمن بقوة الطبيعة في منح بشرتك الجمال الحقيقي.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#products" className="text-sm opacity-80 transition-opacity hover:opacity-100">
                المنتجات
              </Link>
              <Link href="#story" className="text-sm opacity-80 transition-opacity hover:opacity-100">
                قصتنا
              </Link>
              <Link href="#ingredients" className="text-sm opacity-80 transition-opacity hover:opacity-100">
                المكونات
              </Link>
              <Link href="#contact" className="text-sm opacity-80 transition-opacity hover:opacity-100">
                تواصل معنا
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-semibold">تابعنا</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/rital_store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="انستقرام"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="واتساب"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-sm opacity-60">
            جميع الحقوق محفوظة © {new Date().getFullYear()} متجر ريتال
          </p>
        </div>
      </div>
    </footer>
  )
}
