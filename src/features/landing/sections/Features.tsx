import { Activity, Headphones, Shield, Wifi, Zap, Home } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Velocidade que bate com o contrato", desc: "Fibra simétrica: a mesma banda pra baixar e pra subir, medida na sua frente no dia da instalação." },
  { icon: Wifi, title: "Wi-Fi 6 incluso", desc: "Roteador no plano, ponto mesh no Ultra, e o sinal conferido cômodo a cômodo antes do técnico sair." },
  { icon: Headphones, title: "Suporte com gente de verdade", desc: "WhatsApp com time local. A conversa continua de onde parou, sem repetir o problema pra cada atendente." },
  { icon: Activity, title: "Rede monitorada 24/7", desc: "NOC acompanhando a rede o tempo todo — muitas vezes a gente vê o problema antes de você." },
  { icon: Shield, title: "SLA em contrato (empresa)", desc: "Prazo de reparo e disponibilidade escritos, com redundância pra quem não pode parar." },
  { icon: Home, title: "Instalação com hora marcada", desc: "Nada de “período da tarde”. Você escolhe o horário e o técnico chega nele." },
];

export function Features() {
  return (
    <section className="lp-sec" id="recursos">
      <div className="lp__wrap">
        <span className="lp-sec__eyebrow">O que vem junto</span>
        <h2>Tudo que faz a Internet parar de ser um problema</h2>
        <p className="lp-sec__sub">
          Não é só o cabo de fibra: é o equipamento certo, a instalação bem feita e alguém
          do outro lado quando você precisa.
        </p>
        <div className="lp-grid lp-grid--3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div className="lp-feat" key={title}>
              <span className="lp-feat__icon"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
