import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Zap, Shield, Headphones, Activity, Rocket, Lock,
  CheckCircle2, ArrowRight, Building2, Home, Wifi, Phone, MessageCircle, Star,
} from "lucide-react";
import vbzLogo from "@/assets/vbz-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VBZ — Internet fibra óptica dedicada para empresas" },
      { name: "description", content: "Fibra óptica 100% dedicada com SLA 99.9% para empresas. Também atendemos residências com planos de até 1 Giga." },
      { property: "og:title", content: "VBZ — Internet que não falha" },
      { property: "og:description", content: "Fibra 100% dedicada com SLA 99.9%. Para empresas onde downtime custa dinheiro." },
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

type Mode = "b2b" | "b2c";

function Index() {
  const [mode, setMode] = useState<Mode>("b2b");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header mode={mode} setMode={setMode} />
      {mode === "b2b" ? <BusinessLanding /> : <ResidentialLanding />}
      <Footer />
    </div>
  );
}

function Header({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={vbzLogo} alt="VBZ" width={140} height={40} className="h-9 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-surface border border-border">
          <button
            onClick={() => setMode("b2b")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              mode === "b2b" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 size={15} /> Para empresas
          </button>
          <button
            onClick={() => setMode("b2c")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              mode === "b2c" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home size={15} /> Para sua casa
          </button>
        </div>

        <a
          href="#contato"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
        >
          Falar com a gente <ArrowRight size={15} />
        </a>
      </div>

      {/* mobile toggle */}
      <div className="md:hidden px-6 pb-3 flex gap-1 p-1">
        <button onClick={() => setMode("b2b")} className={`flex-1 py-2 rounded-full text-sm font-semibold ${mode === "b2b" ? "bg-primary text-white" : "bg-surface text-foreground"}`}>Empresas</button>
        <button onClick={() => setMode("b2c")} className={`flex-1 py-2 rounded-full text-sm font-semibold ${mode === "b2c" ? "bg-primary text-white" : "bg-surface text-foreground"}`}>Sua casa</button>
      </div>
    </header>
  );
}

/* ───────────────────────── B2B ───────────────────────── */

function BusinessLanding() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.18 140 / 0.3), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.68 0.19 145 / 0.25), transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/12 border border-primary-foreground/25 text-xs font-semibold backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" /> VBZ Empresarial
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold max-w-4xl leading-[1.05]">
            Internet que <span className="text-primary-glow">não falha</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            Fibra 100% dedicada com SLA 99.9%. Para empresas onde downtime custa dinheiro de verdade.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contato" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-[var(--shadow-glow)] transition-all">
              Solicitar proposta <ArrowRight size={18} />
            </a>
            <a href="#casos" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary-foreground/12 border border-primary-foreground/25 text-primary-foreground font-semibold hover:bg-primary-foreground/18 transition">
              Ver casos reais
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-primary-foreground/20 rounded-2xl overflow-hidden border border-primary-foreground/20 shadow-[var(--shadow-card)]">
            {[
              { k: "99.9%", v: "SLA garantido" },
              { k: "150+", v: "Empresas confiam" },
              { k: "15+", v: "Anos operando" },
              { k: "<4h", v: "MTTR garantido" },
            ].map((s) => (
              <div key={s.v} className="bg-foreground/70 backdrop-blur p-6">
                <div className="text-3xl md:text-4xl font-extrabold text-primary-glow">{s.k}</div>
                <div className="text-sm font-medium text-primary-foreground/90 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">O que você recebe</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-2 max-w-xl">Tudo que sua operação exige.</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Infraestrutura empresarial real — não internet residencial vendida como business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { i: Zap, t: "100% Dedicada", d: "Sua largura de banda é só sua. Zero compartilhamento. Velocidade garantida 24/7." },
              { i: Shield, t: "Redundância Ativa", d: "Múltiplas rotas. Falha de uma linha não afeta seu negócio. Failover automático." },
              { i: Headphones, t: "Suporte 24/7", d: "NOC especializado. Atende em minutos. Técnicos que entendem seu negócio." },
              { i: Activity, t: "SLA 99.9%", d: "Uptime comprovado. Crédito automático se violarmos. Internet é custo previsível." },
              { i: Rocket, t: "Implementação Ágil", d: "Ligado em dias, não meses. Técnicos que entendem o urgente." },
              { i: Lock, t: "Segurança Total", d: "Infraestrutura isolada. Zero vulnerabilidades de compartilhamento." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="group p-7 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <Icon size={22} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section id="casos" className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Quem confia em nós</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-12 max-w-2xl">
            Empresas reais. Resultados reais.
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                badge: "💰 R$ 500k economizados / 12 meses",
                quote: "Downtime custava caro. Com SLA robusto e crédito automático, internet virou custo previsível. Suporte que entende negócio.",
                who: "Diretor de Infraestrutura",
                meta: "SaaS B2B • 45 linhas • São Paulo",
              },
              {
                badge: "⏱️ Zero downtime há 14 meses",
                quote: "Mudamos de provider sem downtime. Redundância funciona de verdade. MTTR <4h é real. Suporte responde em minutos.",
                who: "Gerente de TI",
                meta: "E-commerce • 80 linhas • Goiás",
              },
            ].map((c) => (
              <div key={c.who} className="bg-card p-8 rounded-3xl border border-border shadow-[var(--shadow-card)]">
                <span className="inline-block px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">{c.badge}</span>
                <p className="mt-6 text-xl leading-relaxed font-medium">"{c.quote}"</p>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="font-bold">{c.who}</div>
                  <div className="text-sm text-muted-foreground">{c.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="planos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Planos empresariais</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Escolha seu plano</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Startup", speed: "50 Mbps", price: "Por mês", featured: false,
                features: ["Fibra 100% dedicada", "SLA 99.9%", "Suporte 24/7", "NOC monitorado"], cta: "Solicitar" },
              { name: "Growth", speed: "150 Mbps", price: "Por mês", featured: true,
                features: ["Fibra 100% dedicada", "SLA 99.9%", "Suporte prioritário", "Redundância ativa"], cta: "Solicitar" },
              { name: "Enterprise", speed: "Custom", price: "Conforme demanda", featured: false,
                features: ["Fibra 100% dedicada", "SLA 99.99%", "Suporte 24/7 dedicado", "Multi-rota redundância"], cta: "Conversar" },
            ].map((p) => (
              <div key={p.name}
                className={`relative p-8 rounded-3xl border transition-all ${
                  p.featured
                    ? "bg-foreground text-background border-foreground shadow-[var(--shadow-glow)] md:-translate-y-3"
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                    Mais escolhido
                  </span>
                )}
                <h3 className={`text-2xl font-bold ${p.featured ? "" : ""}`}>{p.name}</h3>
                <div className={`mt-6 text-5xl font-extrabold ${p.featured ? "text-primary-glow" : "text-primary"}`}>{p.speed}</div>
                <div className={`text-sm mt-1 ${p.featured ? "text-white/60" : "text-muted-foreground"}`}>{p.price}</div>

                <ul className="mt-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 size={18} className={p.featured ? "text-primary-glow" : "text-primary"} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a href="#contato" className={`mt-8 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition ${
                  p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"
                }`}>
                  {p.cta} <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] p-12 md:p-16 text-center text-background relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(circle at 30% 20%, oklch(0.78 0.18 140 / 0.4), transparent 50%)" }} />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-tight">
              Pronto para conectividade que <span className="text-primary-glow">funciona?</span>
            </h2>
            <p className="mt-5 text-white/70 max-w-xl mx-auto">
              Conversa com nosso time em menos de 2 horas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="https://wa.me/5535998423386" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-[var(--shadow-glow)] transition">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href="tel:08002823258" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-background font-semibold hover:bg-white/15 transition">
                <Phone size={18} /> 0800 282 3258
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ───────────────────────── B2C ───────────────────────── */

function ResidentialLanding() {
  const [cep, setCep] = useState("");

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              Preço fixo até Jan/2028
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-extrabold leading-[1.05]">
              A internet fibra <span className="text-primary">que entrega tudo</span> que promete.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Eleita a internet fixa mais confiável do Brasil. Velocidade real, suporte humano, preço travado.
            </p>

            {/* CEP form */}
            <form
              onSubmit={(e) => { e.preventDefault(); document.getElementById("planos-residencial")?.scrollIntoView({ behavior: "smooth" }); }}
              className="mt-8 bg-card p-3 rounded-2xl border border-border shadow-[var(--shadow-card)] flex flex-col sm:flex-row gap-2"
            >
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP"
                className="flex-1 px-4 py-3 rounded-xl bg-surface border border-transparent focus:border-primary outline-none text-base"
              />
              <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                Verificar <ArrowRight size={16} />
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">Será que a VBZ chegou aí?</p>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="aspect-square rounded-[2.5rem] p-10 relative overflow-hidden"
              style={{ background: "var(--gradient-primary)" }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white, transparent 50%)" }} />
              <div className="relative h-full flex flex-col justify-end items-end">
                <div className="text-primary-foreground text-right">
                  <div className="text-7xl font-extrabold">1<span className="text-3xl">Giga</span></div>
                  <div className="mt-2 text-primary-foreground/80">Wi-Fi 6 + Mesh incluído</div>
                </div>
              </div>
              <div className="absolute top-10 left-10">
                <Wifi size={72} className="text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl border border-border shadow-[var(--shadow-card)] flex items-center gap-3">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}</div>
              <div>
                <div className="text-sm font-bold">4.9/5</div>
                <div className="text-xs text-muted-foreground">Mais de 10 mil avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos-residencial" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold max-w-2xl mb-3">
            Tem VBZ Fibra disponível pro seu endereço.
          </h2>
          <p className="text-muted-foreground text-lg mb-12">Escolha seu plano ideal:</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Essencial", speed: "500 Mega", price: "100", card: "90",
                feats: ["Internet de 500 Mega", "Roteador Wi-Fi 5"], featured: false },
              { name: "Super", speed: "700 Mega", price: "130", card: "120",
                feats: ["Streaming Plus 12 meses", "Internet de 700 Mega", "Roteador Wi-Fi 6"], featured: true },
              { name: "Ultra", speed: "1 Giga", price: "160", card: "150",
                feats: ["Streaming Plus 12 meses", "Internet de 1 Giga", "1 Ponto Extra Wi-Fi 6 Mesh", "Roteador Wi-Fi 6"], featured: false },
            ].map((p) => (
              <div key={p.name}
                className={`p-7 rounded-3xl border transition-all hover:-translate-y-1 ${
                  p.featured ? "bg-foreground text-background border-foreground shadow-[var(--shadow-glow)]" : "bg-card border-border"
                }`}
              >
                <div className={`text-sm ${p.featured ? "text-white/60" : "text-muted-foreground"}`}>VBZ Fibra</div>
                <h3 className="text-3xl font-extrabold">{p.name}</h3>

                <div className={`mt-6 p-5 rounded-2xl ${p.featured ? "bg-white/5" : "bg-surface-soft"}`}>
                  <ul className="space-y-3">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm font-medium">
                        <Wifi size={16} className={p.featured ? "text-primary-glow" : "text-primary"} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-semibold ${p.featured ? "text-white/60" : "text-muted-foreground"}`}>R$</span>
                    <span className="text-5xl font-extrabold">{p.price}</span>
                    <span className={p.featured ? "text-white/60" : "text-muted-foreground"}>/mês</span>
                  </div>
                  <div className={`text-xs mt-1 ${p.featured ? "text-white/50" : "text-muted-foreground"}`}>
                    ou R$ {p.card}/mês no cartão de crédito
                  </div>
                </div>

                <button className={`mt-6 w-full py-3.5 rounded-full font-semibold transition ${
                  p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"
                }`}>
                  Eu quero
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold max-w-3xl mb-12">
            Por que escolher a VBZ Fibra
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Internet mais confiável do Brasil", d: "Conecte e conclua tarefas online em múltiplos dispositivos sem instabilidade." },
              { t: "Streaming Plus 12 meses por nossa conta", d: "A partir do plano Super, com velocidade de 700 Mega." },
              { t: "Cobertura Wi-Fi 6 ampliada", d: "Nos planos Super e Ultra, máxima performance em toda a casa." },
            ].map((b) => (
              <div key={b.t} className="p-7 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                  <CheckCircle2 size={22} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{b.t}</h3>
                <p className="text-muted-foreground text-sm">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Quem tem VBZ Fibra, recomenda</h2>
          <p className="text-muted-foreground mb-12">Depoimentos sobre estabilidade, atendimento e experiência.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { q: "A VBZ entregou tudo o que prometeu. Mantiveram a qualidade e ainda ofereceram valores fixos por mais de dois anos. Serei cliente por muitos anos.", n: "Luiz Pinto", d: "21/02/2026" },
              { q: "Contratei a VBZ após outra operadora me deixar na mão por 4 dias. Mesmo com chuva forte, não cai. Super indico, 500 mega impecável.", n: "Ametyysta de Souza", d: "05/02/2026" },
              { q: "Sinal excelente com alta tecnologia. Custo-benefício ótimo, atendimento e suporte nota 1000.", n: "Mariah Leandro", d: "06/01/2026" },
              { q: "Na minha região, não tenho do que reclamar — sempre atenciosos. Hoje não penso em trocar de operadora.", n: "Marcelo", d: "27/12/2025" },
              { q: "A VBZ é realmente excelente, eficiente e bem prática. Vale a pena aderir.", n: "Evanice Francisca", d: "08/12/2025" },
              { q: "Internet estável o dia inteiro pra home office. Reuniões sem travamento, suporte responde rápido.", n: "Carolina M.", d: "02/11/2025" },
            ].map((t) => (
              <div key={t.n} className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}</div>
                <p className="mt-4 text-sm leading-relaxed">"{t.q}"</p>
                <div className="mt-5 pt-4 border-t border-border flex justify-between text-xs">
                  <span className="font-bold">{t.n}</span>
                  <span className="text-muted-foreground">{t.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B cross-sell */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden text-background"
          style={{ background: "var(--gradient-hero)" }}>
          <div className="grid md:grid-cols-2 gap-10 items-center relative">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
                <Building2 size={13} /> VBZ pra empresas
              </span>
              <h3 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight">
                Internet que <span className="text-primary-glow">acelera</span> seu negócio.
              </h3>
              <p className="mt-4 text-white/70">Fibra dedicada, SLA 99.9% e suporte que entende urgência.</p>
            </div>
            <div className="md:text-right">
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-[var(--shadow-glow)] transition">
                Conhecer planos empresariais <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  const cols = [
    { t: "Produtos", l: ["VBZ Fibra pra empresa", "Internet com Streaming", "Internet Gamer", "Home Office", "Wi-Fi 6"] },
    { t: "Ajuda", l: ["Segunda via", "Suporte técnico", "Mudar plano", "Cancelamento", "Central de ajuda"] },
    { t: "Atendimento", l: ["WhatsApp 35 9 9842 3386", "0800 001 1000", "Casa: 0800 031 0453", "Empresas: 0800 282 3258"] },
    { t: "Legal", l: ["Termo de Consentimento", "Política de Privacidade", "Termos e contratos", "Trabalhe conosco"] },
  ];
  return (
    <footer className="bg-foreground text-background pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 bg-white/95 rounded-lg p-2 w-fit">
              <img src={vbzLogo} alt="VBZ" width={140} height={40} className="h-9 w-auto" />
            </div>
            <p className="text-sm text-background/60 mt-4">Internet fibra dedicada que sua empresa precisa — e a confiabilidade que sua casa merece.</p>
          </div>
          {cols.map((c) => (
            <div key={c.t}>
              <div className="font-bold mb-4">{c.t}</div>
              <ul className="space-y-2.5 text-sm text-background/60">
                {c.l.map((i) => {
                  let href = "#";
                  if (i.includes("WhatsApp")) href = "https://wa.me/5535998423386";
                  else if (i.includes("0800")) href = `tel:${i.replace(/\D/g, "")}`;
                  else if (i.includes("Termo")) href = "/termo-consentimento";
                  return <li key={i}><a href={href} target={href.startsWith("https") ? "_blank" : undefined} rel={href.startsWith("https") ? "noopener noreferrer" : undefined} className="hover:text-background transition">{i}</a></li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-background/10 pt-6 flex flex-wrap justify-between gap-4 text-xs text-background/50">
          <span>© {new Date().getFullYear()} VBZ Telecom · vbz.com.br</span>
          <span>CNPJ 00.000.000/0001-00 · Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}
