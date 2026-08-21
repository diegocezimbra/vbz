# VBZ - Operação do provedor FTTH (notas 2026-07-24)

Decisões operacionais ditadas pelo Diego em 2026-07-24. Complementam o pedido de material
de `orcamentos/pedido-ftth-2026-07-23.html`.

## Decisões

1. **Mão de obra técnica: terceirizada.** Instalação/manutenção via técnico terceirizado,
   sem contratação CLT. Consequência direta: todo material que sai da base com técnico
   precisa ficar rastreado (ver controle de estoque abaixo).

2. **Base física: já existe e comporta estoque.** O estoque de material FTTH fica
   centralizado na base - sem custo adicional de galpão/depósito.

3. **Controle de estoque: `estoque/controle-estoque.html`** (ferramenta local, mesmo
   padrão do pedido - HTML único, dados no navegador + backup/restauração em JSON).
   - Itens já semeados com a lista do pedido FTTH de 23/07 (drop, conectores APC/UPC,
     esticador, ONT ZTE 6201b, ONU Fiberhome, roteador EX141) + botão de novo item.
   - Movimentações: **entrada** (compra), **saída** (instalação - exige o nome do
     técnico terceirizado), **ajuste** (contagem física).
   - Saldo com estoque mínimo por item e alerta de reposição ("repor").

4. **Cobrança: PENDENTE DE DECISÃO.** Mensalidade recorrente dos assinantes. Opções
   naturais dentro da casa:
   - **Billify** (api-billing.ohanax.com) - billing SaaS já usado pelos produtos Ohanax;
     assinatura recorrente, Stripe. Integração padrão documentada em
     `~/Documents/00-projetos/docs/integrations/billify.md`.
   - **ispipe** - o ERP de provedor da casa (RADIUS/AAA, OLT/ONU, Cliente360); se o VBZ
     vai rodar dentro do ispipe, a cobrança deveria nascer lá (boleto/Pix é o meio
     dominante em assinante FTTH de interior, não cartão).
   - Aguardando direção do Diego (pergunta enviada via Telegram em 2026-07-24).

## Notas soltas (brain dump - só anotar, executar apenas quando o Diego pedir)

- 2026-07-24: técnico terceirizado · base própria comporta estoque · controle de estoque · cobrança
