"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const quickFacts = [
  { icon: "📦", key: "about.fact1" },
  { icon: "⏱", key: "about.fact2" },
  { icon: "🌍", key: "about.fact3" },
  { icon: "🔧", key: "about.fact4" },
];

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <h2 className="mb-10 text-xs font-medium uppercase tracking-widest text-muted">
        {t("about.title")}
      </h2>

      <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-12">
        {/* Photo — rectangular, rounded corners */}
        <div className="flex justify-center md:justify-start">
          <div className="relative h-[280px] w-[200px] overflow-hidden rounded-xl">
            <Image
              src="/images/me.jpg"
              alt="Creatman"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Bio text */}
        <div className="space-y-4">
          {["about.p1", "about.p2", "about.p3", "about.p4", "about.p5"].map((key) => (
            <p key={key} className="text-sm leading-relaxed text-muted md:text-base">
              {t(key)}
            </p>
          ))}

          {/* Tagline — accented */}
          <p className="pt-2 text-lg font-semibold md:text-xl">
            {t("about.tagline")}
          </p>
        </div>
      </div>

      {/* Quick Facts — 4 cards */}
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickFacts.map((fact) => (
          <div
            key={fact.key}
            className="rounded-lg bg-surface p-4 text-center"
          >
            <div className="mb-1 text-xl">{fact.icon}</div>
            <div className="text-sm font-medium">{t(fact.key)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
