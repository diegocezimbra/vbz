import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { Dor } from "./sections/Dor";
import { Passos } from "./sections/Passos";
import { Recursos } from "./sections/Recursos";
import { Comparativo } from "./sections/Comparativo";
import { FormSec } from "./sections/FormSec";
import { Planos } from "./sections/Planos";
import { Confianca } from "./sections/Confianca";
import { ChatEExit, Final, Footer } from "./sections/Fechamento";
import "./landing.css";

/**
 * Ordem: promessa → prova de que a dor é conhecida → como funciona → o que vem junto
 * → comparação → captura → oferta → prova social → objeção → fechamento.
 * O formulário aparece no meio, depois da dor, e o mesmo CTA volta no fim pra quem
 * leu a página inteira antes de decidir.
 */
export function LandingPage() {
  return (
    <div className="lp">
      <Nav />
      <main>
        <Hero />
        <Dor />
        <Passos />
        <Recursos />
        <Comparativo />
        <FormSec />
        <Planos />
        <Confianca />
        <Final />
      </main>
      <Footer />
      <ChatEExit />
    </div>
  );
}
