# Landing VBZ — reconstrução para conversão

> Plan doc. Status: em implementação (2026-08-18).

## 1. Objetivo

Transformar a landing atual (duas abas B2B/B2C, CTAs que só rolavam a tela) numa
página de conversão: header com menus dropdown, hero em carrossel, formulário de
viabilidade que **manda o lead pro CRM (Qualificou)**, chat flutuante e as seções
de persuasão. Mensagem-mãe:

> **"Esta vai ser a última vez que você vai procurar por um serviço de Internet."**

## 2. Referências analisadas

| Fonte | O que foi extraído |
|---|---|
| airbroker.com.br | Header: `logo · 4 menus dropdown · idioma · 0800 · Entrar · Criar conta`. Hero **não** é slider lá — o slider veio do pedido do Diego. |
| cenvia.com.br (`13-chatomnichannel/admin/src/features/landing`) | **DS a seguir**: `landing.config.ts` como fonte única de conteúdo + `sections/*` finas + `landing.css` escopado em `.lp` (`lp-btn`, `lp-hero`, `lp-eyebrow`, `lp-stat`, `lp-feat`, `lp-cmp`, `lp-plan`, `lp-faq`, `lp-ctabox`, `lp-footer`). Regra herdada: **só número verificável** e `translate="no"` no nome da marca. |
| posttou.com.br | Ordem de seções (dor → como funciona → diferenciais → prova → casos → FAQ → CTA), oferta com escassez datada, WhatsApp como canal persistente. |
| Pesquisa de conversão | Contraste do CTA > cor do CTA (Von Restorff); um único CTA principal repetido 2-5x; form curto; urgência só se real. |

### Decisão de cor (importante)
**Paleta 100% VBZ** — decisão do Diego (18/08): nenhuma cor de fora entra, nem no CTA.
A pesquisa diz que o que move conversão é *contraste*, não matiz; então o contraste vem
por **luminosidade dentro do próprio verde**: `--cta` é o verde claro da marca
(`oklch(0.78 0.18 140)`) com tinta quase preta por cima, e é o **único** elemento
preenchido com ele na tela — no hero escuro salta por ser claro, nas seções claras por
ser o único bloco sólido entre botões de contorno. `--cta` não aparece em enfeite
nenhum; repetir a cor de ação mataria o efeito de isolamento.

> Histórico: a 1ª versão usava âmbar como cor de ação (isolamento por matiz).
> Revertido a pedido do Diego — a marca vence a otimização.

## 3. Arquitetura de informação do header

Dropdowns (padrão airbroker), com atalho pra todas as áreas:

- **Planos** — Residencial · Empresarial (link dedicado) · Wi-Fi 6 · Streaming · Gamer
- **Empresas** — Link dedicado com SLA · Redundância · IP fixo · Suporte NOC
- **Cobertura** — Consultar viabilidade · Cidades atendidas
- **Ajuda** — 2ª via · Suporte técnico · Mudar de plano · Mudança de endereço · Cancelamento

À direita: **0800 987 9009 → WhatsApp** · **Entrar** (área do cliente) · **CTA primário**.

## 4. Seções da página

1. Hero com **carrossel** (uma funcionalidade por slide, texto + arte SVG própria)
2. Faixa de números (só verificável)
3. **Dor + formulário de viabilidade** ("Cansou de ter problemas com a Internet da sua casa?")
4. Comparativo dor × VBZ
5. Planos
6. Como funciona (3 passos)
7. Prova social
8. Garantia / reversão de risco
9. FAQ
10. CTA final
11. Footer + **chat flutuante** ("Oi! Como podemos te ajudar?" → WhatsApp)

## 5. Lead → CRM (Qualificou)

Contrato existente (`09-crm`, `POST /api/v1/inbound/leads`, corpo `.strict()`),
idempotente por `(source, externalId)`; **a API key define o tenant**.

- Tenant **VBZ já existe**: `d159f041-4848-40fd-b1a7-c6e6c627782d`. Faltava a chave — emitida nesta leva.
- Envio é **server-side** (`createServerFn` do TanStack Start): a chave nunca vai pro browser.
- `phone` é NOT NULL no Qualificou → o telefone é obrigatório no formulário (é, de todo jeito, o campo que o time de vendas usa).
- **Endereço/cidade não têm campo próprio no contrato** (`.strict()` recusa chave desconhecida). Vão em `tags` (`endereco:…`, `cidade:…`, limite de 60 chars por tag) e no texto do WhatsApp. O certo a médio prazo é um campo `endereco`/`observacao` opcional no inbound do CRM — proposto, não feito aqui (é outro repo/deploy).

## 6. Fora de escopo / pendências do Diego

- Números reais (clientes, cidades, uptime medido) — os campos existem em `landing.config.ts` marcados como `PENDENTE`.
- Depoimentos reais (nome, foto, cidade).
- URL da área do cliente ("Entrar") e das páginas de ajuda (2ª via etc.).
- Confirmar que o 0800 987 9009 está registrado no WhatsApp Business.
