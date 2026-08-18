import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/features/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VBZ — Internet fibra óptica que entrega o que promete" },
      { name: "description", content: "Fibra óptica de 500 Mega a 1 Giga com Wi-Fi 6 incluso, instalação com hora marcada e suporte no WhatsApp. Consulte a viabilidade no seu endereço, sem compromisso." },
      { property: "og:title", content: "Esta vai ser a última vez que você vai procurar por Internet" },
      { property: "og:description", content: "Fibra que entrega a velocidade contratada, Wi-Fi que cobre a casa inteira e suporte com gente de verdade. Consulte a viabilidade no seu endereço." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
