import { CalendarCheck, MessageCircle, Wifi } from "lucide-react";

import type { OnboardingState } from "./steps";

const TURNO_LABEL: Record<string, string> = { manha: "de manhã", tarde: "à tarde" };

/** Fecha o onboarding dizendo o que JÁ está feito e o que acontece a seguir. */
export function StepPronto({ state, whatsapp }: { state: OnboardingState; whatsapp: string }) {
  const dia = state.instalacaoData ? state.instalacaoData.split("-").reverse().join("/") : "";

  return (
    <>
      <span className="onb__kicker">Contratação concluída</span>
      <h1>Pronto, {state.nome.split(" ")[0]}. Está tudo configurado.</h1>
      <p className="onb__lead">Seu contrato está assinado e a instalação está agendada.</p>

      <div className="onb__pilares">
        <div className="onb__pilar">
          <span className="onb__ico">
            <CalendarCheck size={20} />
          </span>
          <span>
            <b>
              Instalação {dia && `em ${dia}`} {TURNO_LABEL[state.instalacaoTurno] ?? ""}
            </b>
            <span>
              {state.recebePor} recebe o técnico em {state.logradouro || "seu endereço"},{" "}
              {state.numero}. A gente confirma por WhatsApp na véspera.
            </span>
          </span>
        </div>
        <div className="onb__pilar">
          <span className="onb__ico">
            <Wifi size={20} />
          </span>
          <span>
            <b>Wi-Fi “{state.wifiNome}” já configurado</b>
            <span>
              O técnico chega com a rede e a senha que você escolheu. Plano {state.plano}.
            </span>
          </span>
        </div>
        <div className="onb__pilar">
          <span className="onb__ico">
            <MessageCircle size={20} />
          </span>
          <span>
            <b>Primeira fatura só depois de instalar</b>
            <span>
              Nada foi cobrado agora. A cobrança começa após a instalação, proporcional aos dias
              usados, por {state.pagamento || "forma escolhida"}, com vencimento no dia{" "}
              {state.vencimento}.
            </span>
          </span>
        </div>
      </div>

      <div className="onb__nav">
        <a
          className="lp-btn lp-btn--cta lp-btn--lg"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} /> Falar no WhatsApp
        </a>
        <a className="lp-btn lp-btn--outline lp-btn--lg" href="/">
          Voltar ao site
        </a>
      </div>
      <p className="onb__micro">
        O acesso à área do cliente chega por WhatsApp e e-mail depois da instalação, num link de
        primeiro acesso - é lá que você cria sua senha.
      </p>
    </>
  );
}
