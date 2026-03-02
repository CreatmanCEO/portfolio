import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <div className="my-12 md:my-24"></div>
        <AboutMe />
        <div className="my-12 md:my-24"></div>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
