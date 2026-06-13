import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Building2, Home, MessageCircle, Phone } from "lucide-react";
import vbzLogo from "@/assets/vbz-logo.png";

export const Route = createFileRoute("/termo-consentimento")({
  head: () => ({
    meta: [
      { title: "Termo de Consentimento LGPD — VBZ" },
      { name: "description", content: "Termo de Consentimento para Tratamento de Dados Pessoais conforme LGPD." },
    ],
  }),
  component: TermoConsentimento,
});

type Mode = "b2b" | "b2c";

function TermoConsentimento() {
  const [mode] = React.useState<Mode>("b2b");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header mode={mode} />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <a href="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition mb-8">
          <ArrowLeft size={18} /> Voltar
        </a>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-5xl font-extrabold mb-3">Termo de Consentimento</h1>
          <p className="text-muted-foreground text-lg mb-12">Para Tratamento de Dados Pessoais conforme LGPD</p>

          <div className="space-y-8 text-justify">
            <section>
              <p className="leading-relaxed text-foreground/90">
                Este documento visa registrar a manifestação livre, informada e inequívoca pela qual o Titular dos dados concorda, expressamente, com o tratamento de seus dados pessoais para a finalidade específica, em conformidade com a Lei n.º 13.709/2018 – Lei Geral de Proteção de Dados – LGPD.
              </p>
              <p className="leading-relaxed text-foreground/90 mt-4">
                Ao manifestar sua concordância para com o presente Termo, o Titular consente e concorda que a empresa <strong>CONEXÃO INOVE TELECOMUNICAÇÕES LTDA.</strong>, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº <strong>19.444.380/0001-81</strong>, com sede na Rua Major Querino n.º 85, Residencial Santa Rita, Município de Pouso Alegre, Estado de Minas Gerais, CEP 37.558-735, neste ato representada na forma de seus Estatutos Sociais, doravante denominada <strong>Controladora</strong>, tome decisões referentes ao tratamento de seus dados pessoais, dados referentes as empresas em que atuem os usuários ou dados necessários ao uso dos serviços ofertados pela INOVE, bem como realize o tratamento de tais dados, envolvendo operações como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Dados Pessoais</h2>
              <p className="leading-relaxed text-foreground/90 mb-4">
                A Controladora fica autorizada a tomar decisões referentes ao tratamento e a realizar o tratamento dos seguintes dados pessoais do Titular:
              </p>
              <ul className="space-y-2 text-foreground/90 ml-4">
                {[
                  "Nome completo",
                  "Nome empresarial",
                  "Data de nascimento",
                  "Número e imagem da Carteira de Identidade (RG)",
                  "Número e imagem do Cadastro de Pessoas Físicas (CPF)",
                  "Número e imagem da Carteira Nacional de Habilitação (CNH)",
                  "Número do Cadastro Nacional de Pessoas Jurídicas (CNPJ)",
                  "Fotografia e selfie 3x4",
                  "Dados biométricos",
                  "Estado Civil",
                  "Nível de instrução e escolaridade",
                  "Endereço completo",
                  "Números de telefone, Whatsapp e endereços de e-mail",
                  "Banco, agência e número de contas bancárias",
                  "Bandeira, número, validade, código de cartões de crédito",
                  "Nome de usuário e senha específicos para uso dos serviços do Controlador",
                  "Comunicação, verbal e escrita, mantida entre o Titular e o Controlador",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed text-foreground/90 mt-6">
                Além disso, a Controladora fica autorizada a tomar decisões referentes ao tratamento e a realizar o tratamento dos seguintes dados inseridos pelo Titular, com a intenção de obter a prestação dos serviços ofertados por ela.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Finalidade do Tratamento dos Dados</h2>
              <p className="leading-relaxed text-foreground/90 mb-4">
                O tratamento dos dados pessoais listados nesse termo tem as seguintes finalidades:
              </p>
              <ul className="space-y-2 text-foreground/90 ml-4">
                {[
                  "Possibilitar que a Controladora identifique e entre em contato com o Titular para fins de relacionamento comercial, podendo hospedar citadas informações em data center localizado no Brasil e/ou exterior",
                  "Possibilitar que a Controladora elabore contratos comerciais e emita cobranças contra o Titular, incluindo intermediadoras de pagamento e fintechs",
                  "Possibilitar que a Controladora estruture, teste, promova e faça propaganda de produtos e serviços, personalizados ou não ao perfil do Titular",
                  "Possibilitar que a Controladora utilize tais dados para emissão de Notas Fiscais, Faturas e documentos financeiros correlatos",
                  "Possibilitar que a Controladora utilize tais dados para facilitar a prestação de serviços diversos além dos primariamente contratados, desde que o cliente também demonstre interesse em contratar novos serviços",
                  "Possibilitar que a Controladora utilize tais dados para inscrições em cadastros de inadimplência – proteção ao crédito, tais como: SPC/SERASA",
                  "Possibilitar que a Controladora utilize tais dados em Pesquisas de Mercado",
                  "Possibilitar que a Controladora utilize tais dados na inscrição, divulgação, premiação dos interessados participantes de Eventos, Prêmios ou Concursos",
                  "Possibilitar que a Controladora utilize tais dados na elaboração de catálogos",
                  "Possibilitar que a Controladora utilize tais dados na elaboração de relatórios e emissão de produtos e serviços",
                  "Possibilitar que a Controladora utilize tais dados para suas peças de Comunicação",
                  "Possibilitar que a Controladora utilize tais dados para manter banco de dados de profissionais do mercado e ramos de atuação para facilitar o contato em futuros convites para eventos",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Compartilhamento de Dados</h2>
              <p className="leading-relaxed text-foreground/90">
                A Controladora fica autorizada a compartilhar os dados pessoais do Titular com outros agentes de tratamento de dados, caso seja necessário para as finalidades listadas neste termo, observados os princípios e as garantias estabelecidas pela Lei n.º 13.709/2018 – LGPD.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Segurança dos Dados</h2>
              <p className="leading-relaxed text-foreground/90 mb-4">
                A Controladora responsabiliza-se pela manutenção de medidas de segurança, técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.
              </p>
              <p className="leading-relaxed text-foreground/90">
                Em conformidade ao art. 48 da Lei n.º 13.709/2018, o Controlador comunicará ao Titular e à Autoridade Nacional de Proteção de Dados (ANPD) a ocorrência de incidente de segurança que possa acarretar risco ou dano relevante ao Titular.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Término do Tratamento dos Dados</h2>
              <p className="leading-relaxed text-foreground/90 mb-4">
                A Controladora poderá manter e tratar os dados pessoais do Titular durante todo o período em que eles forem pertinentes ao alcance das finalidades listadas neste Termo. Dados pessoais anonimizados, sem possibilidade de associação ao indivíduo, poderão ser mantidos por período indefinido.
              </p>
              <p className="leading-relaxed text-foreground/90 mb-4">
                O Titular poderá solicitar via e-mail ou correspondência ao Controlador, a qualquer momento, que sejam eliminados os dados pessoais não anonimizados do Titular. O Titular fica ciente de que poderá ser inviável ao Controlador continuar o fornecimento de produtos e serviços ao Titular a partir da eliminação dos dados pessoais. Caso exista legislação em vigor determinando que o Controlador deverá manter os dados em arquivo, estes não serão eliminados.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Direitos do Titular</h2>
              <p className="leading-relaxed text-foreground/90 mb-4">
                O Titular tem o direito a obter da Controladora, em relação aos dados por ela tratados, a qualquer momento e mediante requisição:
              </p>
              <ol className="space-y-2 text-foreground/90 ml-4 list-decimal">
                {[
                  "Confirmação da existência de tratamento",
                  "Acesso aos dados",
                  "Correção de dados incompletos, inexatos ou desatualizados",
                  "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto na Lei n.º 13.709/2018",
                  "Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa e observados os segredos comercial e industrial, de acordo com a regulamentação do órgão controlador",
                  "Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa, de acordo com a regulamentação da autoridade nacional, observados os segredos comercial e industrial",
                  "Eliminação dos dados pessoais tratados com o consentimento do Titular, exceto nas hipóteses previstas no art. 16 da Lei n.º 13.709/2018",
                  "Informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados",
                  "Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa",
                  "Revogação do consentimento nos termos do § 5º do art. 8º da Lei n.º 13.709/2018",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-4">Direito de Revogação do Consentimento</h2>
              <p className="leading-relaxed text-foreground/90">
                Este consentimento poderá ser revogado pelo Titular, a qualquer momento, mediante solicitação via e-mail ou correspondência ao Controlador.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

import React from "react";

function Header({ mode }: { mode: "b2b" | "b2c" }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src={vbzLogo} alt="VBZ" width={140} height={40} className="h-9 w-auto" />
        </a>
        <a href="/" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition">
          ← Voltar ao site
        </a>
      </div>
    </header>
  );
}

function Footer() {
  const cols = [
    { t: "Produtos", l: ["VBZ Fibra pra empresa", "Internet com Streaming", "Internet Gamer", "Home Office", "Wi-Fi 6"] },
    { t: "Ajuda", l: ["Segunda via", "Suporte técnico", "Mudar plano", "Cancelamento", "Central de ajuda"] },
    { t: "Atendimento", l: ["WhatsApp 35 9 9842 3386", "0800 001 1000", "Casa: 0800 031 0453", "Empresas: 0800 282 3258"] },
    { t: "Legal", l: ["Termo de Consentimento", "Política de Privacidade", "Termos e contratos", "Trabalhe conosco"] },
  ];
  return (
    <footer className="bg-foreground text-background pt-20 pb-10 px-6 mt-20">
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
