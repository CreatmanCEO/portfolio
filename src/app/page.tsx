import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import TechStack from "@/components/TechStack";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Creatman",
          url: "https://creatman.site",
          jobTitle: "Technical Product Builder",
          sameAs: [
            "https://github.com/CreatmanCEO/",
            "https://www.linkedin.com/in/creatman/",
            "https://t.me/Creatman_it",
          ],
          description:
            "I see problems and build solutions. 20+ shipped products across security, AI, fintech, infrastructure, and developer tools.",
        }}
      />
      <main>
        <Hero />
        <AboutMe />
        <TechStack />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
