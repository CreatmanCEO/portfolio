"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { FaTelegram, FaGithub, FaEnvelope } from "react-icons/fa";

type FormStatus = "idle" | "sending" | "success" | "error";
type Purpose = "hire" | "discuss" | "consulting" | "connect";

export default function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("hire");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, purpose, message }),
      });

      if (!response.ok) throw new Error("Failed to send");

      setStatus("success");
      setName("");
      setContact("");
      setPurpose("hire");
      setMessage("");

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-surface">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
          {t("contact.title")}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-muted mb-2"
            >
              {t("contact.name")}
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.namePlaceholder")}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-surface text-foreground"
              disabled={status === "sending"}
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-muted mb-2"
            >
              {t("contact.contact")}
            </label>
            <input
              type="text"
              id="contact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t("contact.contactPlaceholder")}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-surface text-foreground"
              disabled={status === "sending"}
            />
          </div>

          {/* Purpose */}
          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-muted mb-2"
            >
              {t("contact.purpose")}
            </label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as Purpose)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-surface text-foreground"
              disabled={status === "sending"}
            >
              <option value="hire">
                {t("contact.purpose.hire")}
              </option>
              <option value="discuss">
                {t("contact.purpose.discuss")}
              </option>
              <option value="consulting">
                {t("contact.purpose.consulting")}
              </option>
              <option value="connect">
                {t("contact.purpose.connect")}
              </option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-muted mb-2"
            >
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.messagePlaceholder")}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none bg-surface text-foreground"
              disabled={status === "sending"}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? t("contact.sending") : t("contact.submit")}
          </button>

          {/* Status Messages */}
          {status === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              {t("contact.success")}
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
              {t("contact.error")}
            </div>
          )}
        </form>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted mb-6">
            {t("contact.orReach")}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <a
              href="https://t.me/Creatman_it"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
            >
              <FaTelegram className="text-2xl" />
              <span className="font-medium">@Creatman_it</span>
            </a>
            <a
              href="mailto:creatmanick@gmail.com"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
            >
              <FaEnvelope className="text-2xl" />
              <span className="font-medium">creatmanick@gmail.com</span>
            </a>
            <a
              href="https://github.com/CreatmanCEO/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
            >
              <FaGithub className="text-2xl" />
              <span className="font-medium">CreatmanCEO</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
