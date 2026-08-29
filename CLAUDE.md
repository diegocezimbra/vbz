
<!-- boas-praticas-consolidadas -->
> 📐 **Boas Práticas Consolidadas (OBRIGATÓRIO - ler antes de qualquer trabalho não-trivial)**
> Padrão ÚNICO de engenharia de todas as aplicações: regras absolutas · planejamento & plan doc · TDD · qualidade de testes · Clean Code · SOLID · arquitetura (Clean/Hexagonal/DIP/DDD) · convenções de backend · API REST · frontend · **Design System First** · mobile-first & acessibilidade · segurança & LGPD · performance · robustez & concorrência · observabilidade & auditoria · documentação como contrato · quality gates & DoD · checklist exaustivo de code review.
> **Canônico:** `~/Documents/00-claude-knowledge/agents/tech/boas-praticas-consolidadas.md` (este projeto não guarda cópia).
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
- **O contrato do CRM é `.strict()`: campo que ele não conhece derruba o lead inteiro
  com 400.** Por isso, mudança de payload sai em DUAS entregas e nesta ordem: primeiro
  a API do CRM passa a aceitar o campo E VAI PRO AR, só depois a landing começa a
  mandar. Em 29/08 eu inverti - subi a landing mandando `cep`/`enderecoCompleto` antes
  de deployar o CRM, e **todo lead da landing passou a tomar 400** até eu reverter.
  A landing deploya sozinha no push; o CRM **não** (lá o deploy é `scripts/deploy-api.sh`),
  então o push que parece inofensivo aqui é o que chega primeiro em produção.
- **Cobertura:** `VBZ_COVERAGE_CITIES` casa por CIDADE. Incluir "São Paulo" faria a zona
  oeste receber "temos fibra aí" também - por isso a zona leste está fora até haver
  correspondência por bairro.


## 🔭 Observabilidade — como investigar este projeto

> Credenciais em `~/.claude/secrets/ohanax-infra/observability-acessos-equipe.txt`.
> **NUNCA** cole senha em código, commit ou doc. Exporte na sessão antes de usar:
> `export OBS_AUTH="usuario:senha"`

**Deste projeto** — apps no Loki: `vbz-landing`, `vbz-landing-nova`, `vbz-blog`

Endpoints sondados a cada 30s:
- `https://vbz.com.br`

### 1. Logs — primeira parada quando algo quebra (Loki)

Cobre **todo** container automaticamente, sem instrumentar nada no código.

```bash
# ultimas linhas deste projeto (janela de 1h)
curl -s -u "$OBS_AUTH" -G 'https://loki.ohanax.com/loki/api/v1/query_range' \
  --data-urlencode 'query={app="vbz-landing"}' \
  --data-urlencode 'limit=100' \
  --data-urlencode "start=$(date -u -d '1 hour ago' +%s)000000000" \
  | jq -r '.data.result[].values[][1]'

# so os erros, em todos os componentes do projeto
curl -s -u "$OBS_AUTH" -G 'https://loki.ohanax.com/loki/api/v1/query_range' \
  --data-urlencode 'query={app=~"vbz-landing|vbz-landing-nova|vbz-blog"} |~ "(?i)error|exception|fatal"' \
  --data-urlencode 'limit=50' \
  --data-urlencode "start=$(date -u -d '6 hours ago' +%s)000000000" \
  | jq -r '.data.result[].values[][1]'
```

O label `app` vem de `coolify.resourceName`; `servico` traz o serviço do compose.
`https://loki.ohanax.com` **não tem interface** — abrir no navegador devolve 404, e está certo.
Para navegar visualmente use o Grafana → **Explore** → datasource Loki.

### 2. Está no ar? (Prometheus + blackbox)

```bash
# 1 = no ar, 0 = fora
curl -s -u "$OBS_AUTH" -G 'https://prometheus.ohanax.com/api/v1/query' \
  --data-urlencode 'query=probe_success{instance="https://vbz.com.br"}' | jq -r '.data.result[].value[1]'

# uptime dos ultimos 7 dias de todos os endpoints deste projeto
curl -s -u "$OBS_AUTH" -G 'https://prometheus.ohanax.com/api/v1/query' \
  --data-urlencode 'query=avg_over_time(probe_success{instance=~"https://vbz.com.br"}[7d])' \
  | jq -r '.data.result[] | "\(.metric.instance) \(.value[1])"'
```

### 3. Métricas da aplicação (Prometheus)

Só aparece aqui o que a aplicação expõe em `/metrics`. Para descobrir o que existe:

```bash
curl -s -u "$OBS_AUTH" 'https://prometheus.ohanax.com/api/v1/label/__name__/values' | jq -r '.data[]' | grep -i <termo>
```

⚠️ **Armadilha:** o Prometheus reserva o label `job` para o nome do scrape. Se a aplicação
expõe uma métrica com label `job` próprio, ele é renomeado para **`exported_job`** — filtrar
por `job="..."` devolve vazio silenciosamente. Use `exported_job`.

### 4. Erro de aplicação com stack trace (GlitchTip)

`https://glitchtip.ohanax.com` — org **Ohanax**. É onde cai a exceção com stack trace, contagem
de ocorrências e usuário afetado. Se este projeto ainda não tem DSN configurada, os erros só
existem como texto no Loki (item 1).

### 5. Dashboards (Grafana)

`https://grafana.ohanax.com` — 4 pastas:
- **Aplicações** — disponibilidade, tráfego HTTP, logs, consumo por app
- **Infraestrutura** — servidores, PostgreSQL, containers
- **Operação** — backups, deploys e imagens
- **SellPipe** — dashboards específicos daquele produto

Comece por **Aplicações · Disponibilidade dos sites e APIs**.

### 6. Alertas

Regras no Prometheus → Alertmanager → **Telegram**. `EndpointDown` dispara após 3 min fora do ar;
também há alerta de certificado TLS vencendo. `https://alertmanager.ohanax.com` **vazio é o estado
saudável** — ele só lista o que está disparando agora, não histórico.

### 7. Dashboard deste produto no Grafana

**https://grafana.ohanax.com/d/prod-vbz** — pasta **11-VBZ**

Uma tela com tudo deste produto: resumo (fora do ar, uptime, erros, CPU, RAM, reinícios),
disponibilidade dos endpoints, tráfego e latência, consumo por container, erros por minuto,
logs crus e banco/backup. O seletor de tempo no topo vale para todos os painéis, e o campo
*Filtrar texto* filtra as linhas de log.

#### O que está sendo medido

- **Disponibilidade** — 1 endpoint(s) sondado(s) pelo blackbox a cada 30s (no ar/fora, latência, validade do certificado TLS). Alerta `EndpointDown` dispara após 3 min fora.
- **Recursos** — CPU, memória, rede, disco e reinícios de 3 container(es), via docker-exporter (lê a API do Docker a cada 30s).
- **Logs** — todas as linhas de stdout de todos os containers, via promtail → Loki. Não exige instrumentação.

#### O que NÃO está sendo medido (lacunas conhecidas)

- ⚠️ **Tráfego HTTP não medido** — a aplicação não expõe `http_requests_total` no `/metrics`. Os painéis *Requisições por segundo*, *Erros 5xx* e *Latência p95* ficam vazios. Para preencher, instrumentar o backend (ver `05-sellpipe`, que já faz).
- ⚠️ **3 container(es) sem `mem_limit`** — sem teto de memória definido, o alerta `ContainerHighMemory` nunca dispara para eles (não há contra o que comparar). Definir limite no Coolify.

#### Como ajustar

Tudo é provisionado por arquivo — editar pela interface do Grafana funciona, mas o
provisionador sobrescreve quando o arquivo muda. Mexa no arquivo:

| Quero... | Onde mexer (servidor `95.111.253.42`) |
|---|---|
| mudar painel deste dashboard | `/opt/observability/grafana/dashboards/11-VBZ/visao-geral.json` |
| monitorar mais um endereço | `/opt/observability/prometheus/prometheus.yml`, job `blackbox-http` |
| criar/alterar alerta | `/opt/observability/prometheus/rules/alerts.yml` (validar com `promtool check rules`) |
| mudar para onde vai o alerta | `/opt/observability/alertmanager/alertmanager.yml` (hoje: Telegram) |
| coletar métrica nova da app | expor em `/metrics` e adicionar um job no `prometheus.yml` |

Depois de editar: dashboard recarrega sozinho em 30s; Prometheus e Alertmanager precisam de
`curl -X POST http://localhost:9090/-/reload` (ou `:9093`).

⚠️ O label `app` vem de `coolify.resourceName` e **só muda no próximo deploy** do recurso.
Renomear no Coolify não basta para a métrica/log mudar de nome.
