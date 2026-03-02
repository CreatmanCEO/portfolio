"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { FaTelegram, FaGithub, FaEnvelope } from "react-icons/fa";

type FormStatus = "idle" | "sending" | "success" | "error";
type Purpose = "collaborate" | "project" | "hire";

export default function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("collaborate");
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
      setPurpose("collaborate");
      setMessage("");

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          {t("contact.title")}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={status === "sending"}
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={status === "sending"}
            />
          </div>

          {/* Purpose */}
          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.purpose")}
            </label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as Purpose)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              disabled={status === "sending"}
            >
              <option value="collaborate">
                {t("contact.purpose.collaborate")}
              </option>
              <option value="project">{t("contact.purpose.project")}</option>
              <option value="hire">{t("contact.purpose.hire")}</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.messagePlaceholder")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              disabled={status === "sending"}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-6">
            {t("contact.orReach")}
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://t.me/nir_creator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaTelegram className="text-2xl" />
              <span className="font-medium">@nir_creator</span>
            </a>
            <a
              href="mailto:nirazulay@gmail.com"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaEnvelope className="text-2xl" />
              <span className="font-medium">nirazulay@gmail.com</span>
            </a>
            <a
              href="https://github.com/nirwo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaGithub className="text-2xl" />
              <span className="font-medium">nirwo</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
