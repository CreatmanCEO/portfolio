"use client";

import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navigation from "./Navigation";
import CookieAlert from "./CookieAlert";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Navigation />
        {children}
        <CookieAlert />
      </LanguageProvider>
    </ThemeProvider>
  );
}
