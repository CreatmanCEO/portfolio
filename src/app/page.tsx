import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <AboutMe />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
