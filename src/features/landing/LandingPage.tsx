import { LandingNav } from "./sections/LandingNav";
import { HeroSlider } from "./sections/HeroSlider";
import { Pain } from "./sections/Pain";
import { Comparison } from "./sections/Comparison";
import { Features } from "./sections/Features";
import { Plans } from "./sections/Plans";
import { HowItWorks } from "./sections/HowItWorks";
import { Proof } from "./sections/Proof";
import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";
import { Footer } from "./sections/Footer";
import { ChatBubble } from "./sections/ChatBubble";
import "./landing.css";

/**
 * Ordem das seções: dor → prova → oferta → objeção → fechamento. O formulário de
 * viabilidade aparece cedo (logo depois do hero) porque é a conversão principal, e o
 * mesmo CTA volta no fim pra quem leu a página inteira antes de decidir.
 */
export function LandingPage() {
  return (
    <div className="lp">
      <LandingNav />
      <main>
        <HeroSlider />
        <Pain />
        <Comparison />
        <Features />
        <Plans />
        <HowItWorks />
        <Proof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
