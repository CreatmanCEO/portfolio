"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              href="https://github.com/CreatmanCEO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              GitHub
            </Link>
            <Link
              href="https://t.me/Creatman_it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="Telegram"
            >
              Telegram
            </Link>
            <Link
              href="https://www.linkedin.com/in/creatman/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              LinkedIn
            </Link>
            <a
              href="mailto:creatmanick@gmail.com"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted">
            © {currentYear} Creatman. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
