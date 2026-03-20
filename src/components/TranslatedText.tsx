"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TranslatedText({ tKey }: { tKey: string }) {
  const { t } = useLanguage();
  return <>{t(tKey)}</>;
}
