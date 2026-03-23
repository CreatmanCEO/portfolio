"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center md:pt-28 md:pb-20">
      {/* Headline */}
      <h1 className="mb-8 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
        {t("hero.headline")}
      </h1>

      {/* Storytelling subtitle */}
      <div className="mx-auto mb-4 max-w-2xl space-y-1">
        {t("hero.subtitle")
          .split("\n")
          .map((line, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-muted md:text-lg"
            >
              {line}
            </p>
          ))}
      </div>

      {/* Punchline — bold */}
      <p className="mb-10 text-base font-medium md:text-lg">
        {t("hero.punchline")}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/projects"
          className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {t("hero.viewProjects")}
        </Link>
        <Link
          href="/ai-analyst"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent/5"
        >
          {t("hero.exploreCode")}
        </Link>
      </div>

      {/* Text link — scroll to contact */}
      <button
        onClick={handleScrollToContact}
        className="mt-4 text-sm text-muted transition-colors hover:text-foreground"
      >
        {t("hero.getInTouch")}
      </button>
    </section>
  );
}
