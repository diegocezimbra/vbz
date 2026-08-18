import { createFileRoute } from "@tanstack/react-router";

import { Onboarding } from "@/features/onboarding/Onboarding";

export const Route = createFileRoute("/lp/onboarding")({
  head: () => ({
    meta: [
      { title: "VBZ — Contrate sua fibra em poucos minutos" },
      { name: "description", content: "Consulte a disponibilidade no seu endereço, escolha o plano, assine o contrato e agende a instalação. Sem fidelidade, sem multa e sem custo de instalação." },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  component: Onboarding,
});
