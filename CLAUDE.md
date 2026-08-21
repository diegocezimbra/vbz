
<!-- boas-praticas-consolidadas -->
> 📐 **Boas Práticas Consolidadas (OBRIGATÓRIO - ler antes de qualquer trabalho não-trivial)**
> Padrão ÚNICO de engenharia de todas as aplicações: regras absolutas · planejamento & plan doc · TDD · qualidade de testes · Clean Code · SOLID · arquitetura (Clean/Hexagonal/DIP/DDD) · convenções de backend · API REST · frontend · **Design System First** · mobile-first & acessibilidade · segurança & LGPD · performance · robustez & concorrência · observabilidade & auditoria · documentação como contrato · quality gates & DoD · checklist exaustivo de code review.
> **Cópia deste projeto:** [`docs/boas-praticas/boas-praticas-consolidadas.md`](docs/boas-praticas/boas-praticas-consolidadas.md) · **Canônico:** `~/Documents/00-claude-knowledge/agents/tech/boas-praticas-consolidadas.md`
> Regra específica deste projeto vence a geral em conflito. **Alterou uma cópia? Replique na canônica e em todas as outras na mesma leva.**


## Infra - megamigração 2026-07 (Cenário B)
- **Produção nova (prod-ohanax)**: 80.190.72.190 - Contabo VDS L (12 cores dedicados EPYC 7282 · 48 GB · 348 GB NVMe, US (região americana); IPv6 IPv6: ver painel Contabo). SSH pubkey-only; credenciais completas em `.credentials/infra-migracao-2026.md` (NUNCA commitar segredos).
- **Topologia**: 1 Coolify único (control plane no servidor ops, a provisionar) gerencia prod + ops + data (Contabo 95.111.253.42 - só master-cpf/leads-clickhouse).
- **Cutover**: DNS Cloudflare SÓ vira com 100% migrado/validado + sync final de dados antes do flip. Plano canônico: `~/Documents/00-projetos/01-ohanax/00-migration/`.

## 🖥️ Telas ocupam a LARGURA INTEIRA

Toda tela usa todo o espaço disponível e redimensiona com a janela. **Proibido**
`maxWidth` + `margin: 0 auto` em container de página. A única exceção é medida de
texto (parágrafo corrido, ~60-75 caracteres) - nunca o container da tela.
Regra completa: `~/Documents/00-claude-knowledge/agents/tech/engineering-directives.md`.

## 🚀 Deploy - automático por webhook (2026-08-20)

**Push na `main` deploya sozinho.** Não chame mais a API de deploy na mão.

- App Coolify **`vbz-landing-nova`** - uuid `z14oa5ig778e5ol4ige1h0dv`, projeto `11-prod-vbz`,
  builda de `diegocezimbra/vbz` (branch `main`, Dockerfile, porta **3000**).
  Serve `vbz.com.br`, `www.vbz.com.br` e `novo.vbz.com.br`.
- Webhook no repo: id `668249544`, evento **push** apenas, apontando para
  `https://server.ohanax.com/webhooks/source/github/events/manual`, `content_type: json`.
  **Todos os apps da instância usam essa mesma URL - quem identifica o app é o secret**
  (`manual_webhook_secret_github`, gravado via `PATCH /api/v1/applications/{uuid}`).
- **`watch_paths` preenchido, e não é opcional:** `static/**`, `src/**`, `server-entry.mjs`,
  `server-static.mjs`, `Dockerfile`, `package.json`, `package-lock.json`, `vite.config.ts`,
  `tsconfig.json`. Vazio = deploya em QUALQUER push; numa instância compartilhada isso já
  gerou 403 deploys em 24h (92% do volume da instância inteira). Push só em `docs/` ou
  `CLAUDE.md` **não** deploya - comportamento validado.

**Token:** use `~/.claude/secrets/ohanax-infra/coolify-api-token.env`. O
`coolify-token-rw.env` estava inválido (401) e foi apagado em 20/08.

**Quando quebrar, o sintoma diz qual é o erro:**

| Erro | Sintoma |
|---|---|
| Secret divergente entre Coolify e GitHub | entrega falha na assinatura; deploy nunca acontece, em silêncio |
| `watch_paths` vazio | deploya em todo push, inclusive doc |
| URL errada | pode voltar 200 se o host existir, mas o Coolify não vê nada |
| Push em rajada | 429 numa entrega = aquele push não deploya; conferir após vários commits seguidos |

`HTTP 200` na entrega só diz que o Coolify **recebeu**. Confirme que o container subiu:
`gh api repos/diegocezimbra/vbz/hooks/668249544/deliveries` e o status do deploy na fila.

**A fila é serializada por servidor.** Um deploy pendurado em `in_progress` trava os de
todos os outros projetos. Em 20/08 dois do `credire` presos desde 00:19 empilharam 22 jobs.
Diagnóstico: `select status, application_name, created_at from application_deployment_queues
where status in ('queued','in_progress')` no container `coolify-db` (95.111.253.42).
Cancelar deploy alheio precisa de OK do Diego.

## 🖥️ A landing é HTML estático, NÃO React

`/` é servido por **`static/index.html`** pelo próprio Node, antes do SSR - ver
`server-entry.mjs`. **Editar a landing é editar esse HTML.** A rota React `/`
(`src/routes/index.tsx`) existe só para a árvore do router e nunca renderiza.

Por quê: a landing reusa o CSS da landing do Qualificou (`09-crm/landing`), e remontar
aquela marcação em componentes fazia o HTML divergir do que o CSS espera - o comparativo
embaralhava porque `.cmp` exige 3 colunas (dor | VS | resposta) com `.cmp-pair` em
`display:contents`. Com o HTML no controle, marcação e CSS não brigam.

- O **onboarding** (`/lp/onboarding`) continua React e usa `src/features/landing/`
  (`contratacao/{Field,contrato,cobertura,credito}`, `lead/*`) e os tokens de `landing.css`.
  **Não apague a camada de compatibilidade** no fim do `landing.css` (`--s*`, `--b`,
  `--ground`, `.lp-btn`, `.lp-field`): já derrubei ela uma vez e as duas telas ficaram
  respondendo 200 **sem estilo nenhum** em produção.
- **Lead do formulário:** `POST /api/lead` no próprio domínio; o Node acrescenta a chave
  do CRM (env `QUALIFICOU_INBOUND_*`). A chave NUNCA vai pro browser - numa landing
  pública ela viraria porta de entrada pra injetar lead na base.
- **Cobertura:** `VBZ_COVERAGE_CITIES` casa por CIDADE. Incluir "São Paulo" faria a zona
  oeste receber "temos fibra aí" também - por isso a zona leste está fora até haver
  correspondência por bairro.
