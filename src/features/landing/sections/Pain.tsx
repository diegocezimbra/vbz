import { Contratacao } from "../contratacao/Contratacao";

/**
 * Seção de DOR + formulário lado a lado. É o par que converte: o texto nomeia o
 * problema que a pessoa já vive e o formulário fica na mesma dobra, sem novo clique.
 */
export function Pain() {
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
        <Contratacao />
      </div>
    </section>
  );
}
