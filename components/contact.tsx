"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, MessageCircle } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <section id="contact" className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
              تواصل معنا
            </span>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              نسعد بتواصلك
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  الاسم
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسمك الكريم"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  رسالتك
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="كيف يمكننا مساعدتك؟"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                إرسال الرسالة
              </Button>
            </form>

            {/* Contact Info */}
            <div className="flex flex-col justify-center">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="mb-6 text-xl font-semibold text-foreground">
                  طرق التواصل
                </h3>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/966570407516"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50 hover:bg-muted/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">واتساب</div>
                      <div className="text-sm text-muted-foreground">0570407516</div>
                    </div>
                  </a>
                  <a
                    href="https://www.instagram.com/_2rital_store?igsh=NW96bm4xa2l1Mzgy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50 hover:bg-muted/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <Instagram className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">انستقرام</div>
                      <div className="text-sm text-muted-foreground">@_2rital_store</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
