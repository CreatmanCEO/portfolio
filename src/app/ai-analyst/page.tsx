"use client";

import AIAnalyst from "@/components/AIAnalyst";
import WelcomeModal from "@/components/WelcomeModal";

export default function AIAnalystPage() {
  return (
    <main className="h-screen overflow-hidden">
      <WelcomeModal />
      <AIAnalyst />
    </main>
  );
}
