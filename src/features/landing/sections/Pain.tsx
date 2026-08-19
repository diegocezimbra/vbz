import { useState } from "react";

import { Contratacao } from "../contratacao/Contratacao";
import type { ViabilityForm } from "../lead/payload";
import { ViabilidadeCurta } from "./ViabilidadeCurta";

/**
 * Seção de DOR + formulário lado a lado. É o par que converte: o texto nomeia o
 * problema que a pessoa já vive e o formulário fica na mesma dobra, sem novo clique.
 */
export function Pain() {
  // O formulário curto registra o lead com o que a pessoa sabe de cabeça; o fluxo
  // completo só aparece depois, já preenchido. Quem desistir no meio já virou lead.
  const [dados, setDados] = useState<ViabilityForm | null>(null);

  return (
    <section className="lp-sec lp-sec--alt" id="viabilidade">
      <div className="lp__wrap lp-split">
        <div>
          <span className="lp-sec__eyebrow">Viabilidade</span>
          <h2>Cansou de ter problemas com a Internet da sua casa?</h2>
          <p className="lp-sec__sub">
            Quem troca pra VBZ quase sempre chega pelo mesmo motivo: cansou. Cansou do “até
            300 Mega”, da queda toda noite, do suporte que é um menu sem fim e da fatura que
            sobe sozinha no terceiro mês. A gente resolve isso de um jeito simples — entrega
            o que está no contrato e atende com gente de verdade.
          </p>
          <ul className="lp-slide__list" style={{ color: "var(--t2)", gap: "var(--s3)" }}>
            <li><strong>Sem multa de cancelamento</strong> e sem fidelidade — se um dia quiser sair, é só avisar.</li>
            <li><strong>Instalação e equipamento sem custo</strong> de adesão. Você paga a mensalidade, e só.</li>
            <li>Você contrata inteiro por aqui: disponibilidade, plano, análise e contrato assinado.</li>
            <li>Se ainda não chegamos aí, a gente fala isso na cara — e avisa quando chegar.</li>
          </ul>
        </div>
        {dados ? (
          <Contratacao inicial={{ nome: dados.nome, telefone: dados.telefone, cidade: dados.cidade }} />
        ) : (
          <ViabilidadeCurta onContinuar={setDados} />
        )}
      </div>
    </section>
  );
}
