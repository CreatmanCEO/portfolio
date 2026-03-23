import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let metaTitle = "Creatman — Technical Product Builder";
  let metaDescription = "I see problems and build solutions.";

  try {
    const titleRow = db.select().from(siteContent).where(eq(siteContent.key, "meta_title")).get();
    const descRow = db.select().from(siteContent).where(eq(siteContent.key, "meta_description")).get();
    if (titleRow?.value) metaTitle = titleRow.value;
    if (descRow?.value) metaDescription = descRow.value;
  } catch {
    // Fallback to defaults if DB not available during build
  }

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://creatman.site",
      siteName: "Creatman",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
    metadataBase: new URL("https://creatman.site"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
