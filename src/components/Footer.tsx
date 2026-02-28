import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Social Links */}
          <div className="flex gap-6">
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
              href="https://linkedin.com/in/creatman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              LinkedIn
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted">
            © {currentYear} Creatman. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
