"use client";

import { ThemeProvider } from "./ThemeProvider";
import Navigation from "./Navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navigation />
      {children}
    </ThemeProvider>
  );
}
