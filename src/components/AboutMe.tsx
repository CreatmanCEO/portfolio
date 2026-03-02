"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaGithub, FaTelegram, FaLinkedin } from "react-icons/fa";

export default function AboutMe() {
  const { t } = useLanguage();

  const quickFacts = [
    { key: "about.location", icon: "📍" },
    { key: "about.status", icon: "🌍" },
    { key: "about.experience", icon: "💼" },
    { key: "about.background", icon: "🔄" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/yourusername",
      icon: FaGithub,
    },
    {
      name: "Telegram",
      url: "https://t.me/yourusername",
      icon: FaTelegram,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/yourusername",
      icon: FaLinkedin,
    },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          {t("about.title")}
        </h2>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-[256px_1fr] gap-8 md:gap-12 items-start">
          {/* Photo Column */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shadow-blue-500/50">
              <Image
                src="/images/me.jpg"
                alt="Profile Photo"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"
                  aria-label={link.name}
                >
                  <link.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Bio Column */}
          <div className="space-y-6">
            {/* Bio Paragraphs */}
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>{t("about.bio.p1")}</p>
              <p>{t("about.bio.p2")}</p>
              <p>{t("about.bio.p3")}</p>
            </div>

            {/* Quick Facts Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              {quickFacts.map((fact) => (
                <div
                  key={fact.key}
                  className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700 text-sm text-gray-300 flex items-center gap-2"
                >
                  <span>{fact.icon}</span>
                  <span>{t(fact.key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
