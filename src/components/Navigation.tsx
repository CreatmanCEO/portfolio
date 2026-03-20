"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/ai-analyst", label: t("nav.aiAnalyst") },
  ];

  const LanguageToggle = () => (
    <div className="flex gap-1 text-xs">
      <button
        onClick={() => setLanguage('en')}
        className={`rounded-md px-2 py-1 transition-colors ${
          language === 'en'
            ? 'bg-accent/10 font-medium text-accent'
            : 'text-muted hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ru')}
        className={`rounded-md px-2 py-1 transition-colors ${
          language === 'ru'
            ? 'bg-accent/10 font-medium text-accent'
            : 'text-muted hover:text-foreground'
        }`}
      >
        RU
      </button>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold">
              <span className="text-accent">Creat</span>
              <span>man</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    pathname === link.href ? "text-accent" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* Language Toggle - Desktop Only */}
              <div className="hidden md:block">
                <LanguageToggle />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                aria-label="Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed left-0 top-0 z-50 h-full w-64 bg-surface shadow-xl md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <Link href="/" className="text-xl font-bold">
                <span className="text-accent">Creat</span>
                <span>man</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6 p-6">
              {/* Navigation Links */}
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium transition-colors hover:text-accent ${
                      pathname === link.href ? "text-accent" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Language Toggle */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted">Language</p>
                <LanguageToggle />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
