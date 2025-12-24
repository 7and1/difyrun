"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Github,
  Zap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/config/categories";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DifyRun
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                onBlur={() =>
                  setTimeout(() => setCategoryDropdownOpen(false), 150)
                }
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Categories
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    categoryDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border bg-popover p-2 shadow-lg">
                  <div className="grid gap-1">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={`/explore/${category.slug}`}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            `bg-category-${category.id}`,
                          )}
                        />
                        <span>{category.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {category.nameCn}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/sources"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sources
            </Link>

            <Link
              href="/docs/getting-started"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </nav>
        </div>

        {/* Right side - Search and actions */}
        <div className="flex items-center gap-4">
          {/* Search button */}
          <Link href="/explore?focus=search">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search workflows</span>
            </Button>
          </Link>

          {/* AI Help button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-dify-advisor"))
            }
          >
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="sr-only">AI Help</span>
          </Button>

          {/* GitHub link */}
          <a
            href="https://github.com/langgenius/dify"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
              <span className="sr-only">Dify on GitHub</span>
            </Button>
          </a>

          {/* CTA Button */}
          <Link href="/explore" className="hidden sm:block">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Browse Templates
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-3">
            <Link
              href="/explore"
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore All
            </Link>

            <div className="py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Categories
              </p>
              <div className="space-y-1 pl-2">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/explore/${category.slug}`}
                    className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/sources"
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sources
            </Link>

            <Link
              href="/docs/getting-started"
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>

            <button
              className="flex items-center gap-2 py-2 text-sm font-medium text-purple-600"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-dify-advisor"));
              }}
            >
              <Sparkles className="h-4 w-4" />
              AI Help
            </button>

            <div className="pt-4 border-t">
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
