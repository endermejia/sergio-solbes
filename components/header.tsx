"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, BookOpen, GraduationCap, FileText, Mail, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "#sobre-mi", label: "Sobre mí", icon: GraduationCap },
  { href: "#investigacion", label: "Investigación", icon: BookOpen },
  { href: "#publicaciones", label: "Publicaciones", icon: FileText },
  { href: "#docencia", label: "Docencia", icon: Briefcase },
  { href: "#contacto", label: "Contacto", icon: Mail },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Prevent scrolling if clicking on a link or button
    if (
      (e.target as HTMLElement).closest('a') ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      onClick={handleHeaderClick}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 cursor-pointer"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="font-serif text-xl font-semibold text-foreground">
              Sergio Solbes Ferri
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary rounded-md"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
