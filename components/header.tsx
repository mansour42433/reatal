"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "@/components/cart-sheet"

const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "#products" },
  { label: "قصتنا", href: "#story" },
  { label: "المكونات", href: "#ingredients" },
  { label: "تواصل معنا", href: "#contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">القائمة</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-background">
            <nav className="mt-8 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight lg:text-3xl">
            ريتال
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/admin" className="hidden lg:block">
            <Button variant="ghost" size="icon" title="لوحة التحكم">
              <Settings className="h-5 w-5" />
              <span className="sr-only">لوحة التحكم</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">بحث</span>
          </Button>
          <CartSheet />
        </div>
      </div>
    </header>
  )
}
