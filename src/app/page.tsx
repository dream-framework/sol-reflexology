import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Services } from "@/components/site/services";
import { Philosophy } from "@/components/site/philosophy";
import { Stats } from "@/components/site/stats";
import { Booking } from "@/components/site/booking";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Philosophy />
        <Stats />
        <Booking />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
