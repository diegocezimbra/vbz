# Boas Práticas Consolidadas — Padrão Único de Engenharia

> **Fonte canônica:** `~/Documents/00-claude-knowledge/agents/tech/boas-praticas-consolidadas.md`
> **Cópia em cada projeto:** `docs/boas-praticas/boas-praticas-consolidadas.md`, referenciada no `CLAUDE.md` do projeto.
>
> Compilado de TODOS os `CLAUDE.md` da suíte (`~/Documents/00-projetos/`), dos agentes de engenharia
> (`agents/tech/*`), dos `engineering-guide.md` / `engineering-best-practices.md` de cada projeto e dos
> checklists nascidos de code review real (wellbi, CRM, chat). **Nada aqui é opinião nova**: cada regra
> veio de um documento existente ou de um problema que já custou caro em produção.
>
> **Alterou este arquivo? Replique na canônica E em todas as cópias na mesma leva.** Divergência entre
> cópias é o pior defeito possível: cada projeto passa a decidir por uma regra diferente sem saber.
>
> Este é doc canônico — **exceção ao gate de 300 linhas**.

---

## 0. Como usar · hierarquia de precedência

Aplique **na ordem**; o primeiro que responder vence:

1. **Regras absolutas** (§1) — nunca cedem, nem sob pedido de escopo/tempo.
2. **`CLAUDE.md` do próprio projeto** — regra específica de projeto vence a geral (stack, thresholds, nomes).
3. **Este documento** — o padrão comum da suíte.
4. **`engineering-directives.md`** (3 pilares) e os agentes em `agents/tech/*` — a raiz teórica de onde tudo aqui derivou.

Quando duas regras conflitam e nenhuma é absoluta: **pergunte**, não escolha em silêncio.

> **Antes de tarefa não-trivial**, leia também: `engineering-directives.md` (pilares) ·
> `organizacao-por-dominios.md` (em qual app a funcionalidade nasce) · `10-tdd.md` (spec completa de TDD).

---

## 1. Regras absolutas (não-negociáveis)

### 1.1 🚨 Nunca operação destrutiva em banco de PRODUÇÃO sem aprovação explícita do Diego

Proibido sem OK dele: `pg_resetwal`, `DROP DATABASE/TABLE/TYPE/COLUMN`, `TRUNCATE`, `DELETE`/`UPDATE`
sem `WHERE`, cirurgia em `pg_catalog`, `ALTER DATABASE RENAME`, reset/rollback de migrations.

**Banco de prod fora do ar → PARE.** Faça backup, notifique via Telegram, apresente as opções com o risco
de cada uma, e **espere**. Ficar mais uma hora fora do ar é MUITO melhor que perder dado de cliente de
forma irreversível. NÃO "conserte" sozinho com ferramenta destrutiva.

- **Por quê (2026-07-16):** `pg_resetwal -f` no Postgres do Billify botou a DB de pé MAS perdeu
  silenciosamente linhas commitadas — **9 subscriptions de clientes reais**, 5 plans, 1 project.
- `pg_resetwal` **NÃO** é "seguro após shutdown limpo". Último recurso, só com aprovação, e SEMPRE
  tentar antes: restore de backup lógico, recuperação forense, réplica.
- **Diagnóstico e leitura** podem ser autônomos; **escrita destrutiva, não.** Em dúvida se é destrutivo → **é**.
- Após qualquer recuperação: auditar FKs `convalidated=t` contra órfãos reais — órfão sob FK validada é
  **prova de perda de linhas**.

### 1.2 A alternativa correta, nunca a mais fácil

**TEMOS QUE ESCOLHER A MELHOR E MAIS COMPLETA OPÇÃO, SEMPRE, SEM ATALHOS.** Definição operacional de "melhor":
mais correta tecnicamente (sem dívida embutida) · mais escalável (10× a carga sem rewrite) · mais segura
(LGPD + security by design) · mais completa (cobre TODOS os casos, não só o feliz) · mais alinhada com os
padrões do projeto e da indústria · defensável em 5 anos.

**Proibido sem aprovação explícita:** atalho "pra ganhar tempo" · hack pra contornar escolha errada ·
gambiarra · "MVP degradado" como entrega definitiva · "resolvo agora, melhoro depois" (depois nunca chega) ·
escolher tech só por familiaridade quando outra é objetivamente melhor · reusar código velho ruim só porque
"já tá pronto".

Melhor opção não é óbvia? **Pergunte antes de escolher**, com alternativas e trade-offs honestos.
Melhor opção é cara? **Apresente o trade-off explícito** antes de cortar escopo — não corte calado.

### 1.3 Trabalho direto na `main` (revoga workspaces e PRs — Diego, 2026-07-16)

- Todo trabalho no **checkout local do projeto, direto na branch `main`**. NUNCA workspace/clone/worktree
  isolado, NUNCA branch de feature, **NUNCA abrir PR** — push direto na `main`.
- `git pull --rebase origin main` antes de começar e antes de pushar.
- **Checkout é compartilhado** entre sessões/agentes: **nunca toque em mudança que não é sua** (staged,
  unstaged ou untracked). Commit é sempre **seletivo** (`git add <seus arquivos>`) — proibido `git add .` /
  `git commit -a`. Na dúvida de quem é a mudança, **pare e pergunte**.
- Commit/push só com **quality gates verdes** (§18).
- **NUNCA adicionar `Co-Authored-By`** na mensagem de commit — em nenhuma circunstância.
- ⚠️ Rebase por plumbing (`update-ref` sem `reset --mixed`) faz o commit seguinte reverter a origin —
  auditar `git show --stat` de todo commit.

### 1.4 Notificação obrigatória (Telegram `@cezimbra_claude_bot`)

Qualquer iteração do Diego (aprovação, decisão, esclarecimento, teste manual, autorização de ação destrutiva)
**ou** final de implementação completa (testes + build + commit + push + deploy OK) → **notifique antes de
parar esperando resposta**. Silêncio é pior que ruído. Curl pronto: `00-claude-knowledge/CLAUDE.md`.

### 1.5 Segredos

- **NUNCA** hardcodar segredo em código, commit ou doc. Local: `.credentials/` ou `~/.claude/secrets/`.
  Runtime: env var no Coolify do projeto. **Segredo vazado = rotacionar imediatamente.**
- Segredo **nunca** com prefixo `VITE_`/`REACT_APP_` (vai pro bundle do browser). Key `service_role`,
  token de provider e chave de API **só no backend**.
- `.env` / `.secrets/` sempre gitignored. Config validada no boot (fail-fast) — §8.6.

### 1.6 Outras regras de usuário

- **NUNCA criar arquivo temporário** — rode o comando direto via CLI (`aws`, `jq`, `python -c`, `psql`…).
- **NUNCA hardcodar dado no frontend** — todo dado vem de API do backend.
- **NUNCA mexer em status de anúncio (Meta/ads) sem perguntar.**
- **Máscaras de input obrigatórias**: CEP, CPF, CNPJ, telefone.
- **Não cachear chamada com erro** — "sucesso vazio" é erro tipado, não cache.
- **Edit cirúrgico, nunca reescrever o arquivo inteiro.**
- **Nunca traduzir nome próprio cadastrado** (marca, razão social) nas telas — `<html lang>` real +
  `translate="no"` em todo nome vindo do banco.

### 1.7 Escopo: só o projeto em que você está

Mesmo recebendo curl, screenshot, log ou stacktrace de **outro** projeto da suíte, **NÃO mexa no código do
outro projeto**. **Pause e pergunte.**

- **Aceitável:** investigar, diagnosticar, explicar, apontar o arquivo e a correção.
- **Inaceitável:** editar, commitar ou pushar fora do diretório do projeto atual.
- Bug que é claramente do vizinho → descreva o diagnóstico e **peça autorização** para trocar de projeto.
- Vale também para a fronteira de produto: "no SellPipe só roda coisa do SellPipe" (Diego 2026-07-22) — se o
  dado/cron/tela pertence a outro domínio, ele nasce **lá** (§7.8).

### 1.8 Deploy não é seu — você entrega verde e PEDE

Fluxo: **build → verify → commit → push → PEÇA ao Diego para deployar.**

- **NUNCA rode `docker build`/`push`/deploy por conta própria.** Onde o deploy é automático (GitHub Actions
  → API do Coolify, Amplify no push), acompanhe até a saúde confirmar; onde é manual, pare e peça.
- Deploy acompanhado significa: job/action verde **e** container `Running` **e** healthcheck do endpoint
  produtivo respondendo 2xx. Antes disso, a entrega não está concluída (§18).

### 1.9 Validação visual é do Diego (Playwright MCP proibido onde o projeto declara)

Regra ABSOLUTA no **SellPipe e Prospecção** (Diego 2026-06-24), e o default seguro nos demais até que o
projeto diga o contrário: **proibido usar `mcp__playwright__*`** para "conferir a tela".

- Para validar frontend sem browser: leitura/`grep` do markup, `node --check`, inspeção do CSS, `curl` para
  HTTP/headers/HTML.
- **Validação visual real → peça ao Diego conferir no browser dele** (§1.4, Telegram com URL + checklist).
- ⚠️ **Não confunda:** isso é sobre o **MCP** (agente dirigindo browser). **Playwright como framework de
  teste E2E no repositório continua recomendado** (§4, pirâmide de testes).

---

## 2. Planejamento e análise profunda (antes da primeira linha)

> Toda feature, refactor ou bug fix não-trivial passa por aqui **antes** do código de produção.
> Objetivo: evitar retrabalho, escopo perdido, reinvenção paralela e decisão de arquitetura/UX sob pressão.

**2.1 Pense fundo** — leia o prompt duas vezes; enuncie o problema com suas palavras (atores, entradas,
saídas, critérios de sucesso); liste **"premissas a confirmar"** e traga ao usuário antes de fechar o plano;
mapeie a **jornada ponta-a-ponta** (toda tela, clique, caminho de erro) — jornada primeiro, UI depois, código
por último; pense no que **não foi pedido**: estados vazio/loading/erro, permissão, auditoria,
observabilidade, mobile, acessibilidade, i18n, limites de plano/billing, rate limit, retry, idempotência,
LGPD, escopo multi-tenant.

**2.2 Descoberta no código** — `grep` por features adjacentes e **leia-as**; liste os reutilizáveis
(services, DS, hooks, utils) em que o novo trabalho vai compor; marque violações a corrigir de passagem
(Boy Scout) como "drive-by", sem inflar escopo em silêncio.

**2.3 Pesquisa externa** (quando relevante) — benchmark da classe de problema com 2-3 referências e URLs;
compare padrões, não copie cego; justifique desvios.

**2.4 Arquitetura** — defina **ports primeiro**, depois os adapters; identifique pontos de extensão (OCP);
respeite camadas; **modelo de dados primeiro** (tabelas, colunas, índices, FKs, enums, nome do arquivo de
migration); **contratos primeiro** (DTOs, request/response, códigos de erro, paginação) — back e front
concordam no papel.

**2.5 UX/UI** — inventário de primitivos do DS que a tela vai usar; para o que faltar, decida "estende o DS"
vs "cria no DS"; **wireframe mobile-first** (menor viewport primeiro); cobertura de estados (vazio, loading,
parcial, erro, sucesso, otimista, offline); **cada botão com comportamento documentado** (label, ícone, ação,
rota/mutation, desabilitado quando, confirma?, destrutivo?, gera audit?); acessibilidade listada no plano,
não descoberta em QA.

**2.6 Gap analysis** — o que o prompt não cobriu mas o sistema precisa; trade-offs explícitos
("Opção A vs B: custo, risco, reversibilidade") e pergunta ao usuário quando não for óbvio.

**2.7 Documento de plano** — `docs/features/<nome>.md` (ou `docs/refactors/`, `docs/bugs/`) **antes do
primeiro commit**, com: problema & objetivo (+ não-objetivos) · jornada ponta-a-ponta · pesquisa externa ·
arquitetura (módulos, ports/adapters, dados, migrations) · contratos de API · spec de UX/UI (wireframe,
componentes do DS, botão a botão, todos os estados) · **mapa de reuso** (o que exatamente será composto) ·
boas práticas aplicadas · plano passo-a-passo com **checkpoints de TDD** (spec → código, cada passo ≤ 1 dia) ·
riscos & mitigação (rollback, feature flag, segurança da migration) · questões abertas.

**2.8 História de produto** — toda feature/bug tem User Story ("Como / eu quero / para que") + critérios
**Given-When-Then** + DoR + DoD antes do dev. Os critérios GWT viram a primeira leva de casos de teste.
Spec: `agents/operations/44-product-owner.md`.

**Anti-padrões (review reprova):** codar sem plan doc quando a task cruza mais de um arquivo/camada · plan
doc que lista arquivos mas pula jornada, auditoria de DS e mapa de reuso · "descubro a UX enquanto codo" ·
forkar feature quase-idêntica em vez de grep-then-extend · inventar abstração que sobrepõe uma existente ·
plano sem estados de erro/vazio/loading, sem acessibilidade, sem mobile, sem auditoria.

---

## 3. TDD — regra suprema

**"Nenhuma linha de código de produção existe sem um teste falhando que a justifique."**
Testes ANTES do código. SEMPRE. SEM EXCEÇÕES. INEGOCIÁVEL.

- **Ciclo Red-Green-Refactor literal:** escreva UM teste → **veja falhar (Red)** → código MÍNIMO para
  passar (Green; não antecipe, não otimize, não embeleze) → refatore com tudo verde. Ciclos < 5 min.
  **Nunca pule o Red** — teste que passa sem código novo é teste ruim.
- **Ordem de arquivos (obrigatória):** `*.spec.ts(x)` → `*.ts(x)`. **Nunca o contrário.** No diff, o spec
  aparece antes/junto da produção.
- **Três leis (Uncle Bob):** (1) sem teste falhando, sem produção; (2) só o suficiente do teste para falhar;
  (3) só o suficiente de produção para passar.
- **Bug fix começa por teste de regressão** que reproduz o defeito (vermelho); commite spec + fix juntos.
- **Refactor:** testes existentes passam antes E depois.
- **Ordem inside-out (Nest):** DTO → Entity/VO → Service/UseCase → Controller → integração; cada um com
  spec antes do código.
- **Teste nunca é alterado só para passar.** Só muda quando a **regra** mudou — e aí a mudança do teste é
  obrigatória e reflete a nova regra. Suíte quebrou depois de uma mudança? Investigue a causa e **pergunte
  se corrijo ou se a mudança foi intencional** — nunca silencie o teste.
- **Nunca commitar com teste falhando.**

**Coberturas mínimas** (piso; cada projeto pode subir — o `CLAUDE.md` do projeto manda):

| Onde | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| **Default da suíte** | 80% | 70% | 80% | 80% |
| SellPipe / Prospectain | 98% | 86% | — | — |
| Chat Omnichannel (ratchet) | 80% | 78% | 75% | 80% |
| Clínica (+ mutation score) | 80% | 70% | mutation > 60% | — |

Cobertura é **gate**, não meta. **0% de teste flaky.**

**Anti-padrões proibidos:** test-after (escrever código e depois teste — isso NÃO é TDD) · teste que nunca
falha · implementar além do necessário · refatorar com teste vermelho · escrever teste e código
simultaneamente (pula o Red) · teste vago (`it('works')`, `toBeTruthy()`).

---

## 4. Qualidade de testes

**Pirâmide** — ~70% unitário (<10ms), ~20% integração (<1s), ~10% E2E.
Unit: service/mapper/VO/DTO, hooks e models puros do React. Integração: `Test.createTestingModule` com
fake/in-memory ou DB de teste, queries do ORM, `process()` de fila. E2E: Supertest/Playwright nos fluxos
centrais. Integração/E2E de verdade sobem container (Postgres) — não mocke o que precisa ser verificado.

**AAA, um Act por teste.** Nome `should [resultado] when [condição]`. Assert **específico** (`toBe(35)`,
`toHaveLength(0)`), nunca `toBeTruthy()`. Assert por **identidade estável** (role / test-id / nome
acessível), nunca por texto frágil (`getByText('4')`). Assert **forte**: valide o valor/conteúdo, não só a
presença ou o tamanho da coleção. Estado mutável (timer, contador) assertado em **todas** as transições,
inclusive "não mudou".

**Test doubles:** **Fake** (in-memory funcional — preferido) · **Mock** (verifica chamada) · **Stub**
(retorno fixo) · **Spy** (observa). **Proibido `jest.mock()` de infra interna para testar regra de
domínio** — se o teste precisa disso, o SUT depende de concreção: injete a porta e passe um fake.

**Cobertura por camada:** Service → happy path, not-found, inválido, não-autorizado, edge (vazio/null/zero/
boundary), efeitos colaterais (evento emitido, audit gravado). Controller → delegação, extração do user,
mapeamento de params, status correto. Guard/Middleware → token válido/inválido/expirado/ausente, roles.
DTO → válido passa, obrigatório ausente falha, limite excedido falha, formato inválido falha.
CRUD → create (válido/duplicado/inválido/defaults), read (por id/not found/paginação/filtros),
update (existe/não existe/parcial/validação), delete (soft/not found/cascade).

**Regras extras nascidas de review:**
- **Cada ramo condicional coberto** — inclusive cada operando de `||`, fallback de ternário, guards, branches
  de `catch`. Testes **RED-prováveis**: se a mutação não derruba o teste, o teste não vale.
- **Toda função/helper de produção nova nasce com spec próprio** — cobertura indireta via consumidor não basta.
- **Toda rota nova testada**, incluindo `index`/redirect e estado ativo no nav.
- **Fixtures tipadas e nomeadas** (`Partial<SomeDto>`), nunca placeholder irreal.
- **Sem cobertura duplicada** — não re-teste o primitivo do DS dentro do consumidor.
- **Determinismo**: proibido `Date.now()`/`Math.random()`/wall-clock no teste **e** no caminho de produção
  que precisa ser reproduzível — use seed/relógio injetável.
- **Migrations testadas**: com `synchronize:false` o SQL é a fonte única — amarre literais SQL (CHECK/enum)
  às constantes de domínio por teste (drift guard); entity ↔ migration 1:1.
- **Contract spec FE↔BE recursivo** — valide sub-objetos aninhados e **tipos**, não só chaves de topo.
- **Reuso de teste**: `XFactory.build({overrides})`, `InMemory*Repository`, `renderWithProviders(ui)`
  compartilhados em `test/fakes` / `__fixtures__`. Não redeclare o mesmo mock em cada spec.
- Testes **independentes de ordem** (estado novo no `beforeEach`).

_"Teste o comportamento, não a implementação."_

---

## 5. Clean Code

### 5.1 Tamanho é gate, não sugestão

| Alvo | Limite | Estourou → |
|---|---|---|
| Arquivo | **300 linhas** | quebra em módulos (controller/service/mapper/dto separados) |
| Função/método | **20-30 linhas** | extrai sub-funções com nome de intenção |
| Classe | **200-300 linhas** | extrai responsabilidade (SRP → novo provider) |
| Parâmetros | **≤ 3-4** | agrupa num Command/objeto |
| Aninhamento | **≤ 3-4** | early-return / guard clauses |
| Complexidade ciclomática | **≤ 10** | decompõe |
| Largura de linha | ≤ 120 | quebra |

Vale para **TODO** código: produção, testes, configs, scripts, seed. **Exceção:** docs canônicos
(`CLAUDE.md`, specs, este arquivo) podem passar de 300 linhas. Verifique a cada arquivo salvo.

### 5.2 Nomes revelam intenção, não implementação

`scheduleNextPost`, não `runStep2`. Booleanos como predicado (`isActive`, `hasCredits`). Async com verbo
(`fetchUser`). Hooks `useXxx`; handlers `handleSaveUser`. Proibido `a/b/x/temp/data`, abreviação obscura,
`handler1/handler2`, notação húngara, número no nome. Convenção consistente: camelCase (TS),
snake_case (colunas de DB). `data` solto do React Query → renomeie (`const { data: companies } = ...`).

### 5.3 Comentários

Código diz **O QUÊ**, comentário diz **POR QUÊ**. Default = sem comentário (troque por nome melhor ou
extraia função). Comente só constraint/invariante não-óbvia ou workaround com link da issue. Comente as
**partes principais** para quem mantém depois — e **evite comentário genérico de IA** que repete o código.
Zero código comentado, zero TODO abandonado, zero import/param morto. JSDoc/comentário que mente é pior que
nenhum. **Boy Scout Rule:** deixe o arquivo mais limpo do que encontrou.

### 5.4 DRY / KISS / YAGNI

- **DRY** — 1ª e 2ª ocorrência podem ficar inline; a **3ª obriga extrair** (Regra de Três). Copy-paste de
  service/componente "pra tweakar" é proibido. Mas **não force DRY** em trechos coincidentemente parecidos
  com razões de mudar diferentes — isso é um split futuro, não duplicação.
- **KISS** — o design mais simples que passa nos testes e cobre os casos conhecidos.
- **YAGNI** — sem flag/generic/strategy especulativa "pro futuro". Generalize na chegada do **segundo caller real**.

### 5.5 Hierarquia de reuso (antes da 1ª linha)

1. `grep` o conceito/entidade/operação em `backend/src`, `frontend/src`, `admin/src`, `common/`, `shared/`.
2. Ordem: **usar como está** > **estender** (nova prop/método, sem breaking) > **refatorar em base +
   especialização** (OCP) > **criar abstração nova** (último recurso).
3. **Reuse a plataforma primeiro** — Auth/Authify, Billing/Billify, Logger, AuditService, HTTP client/BFF,
   Storage, Cache, Design System. Versão paralela é proibida.
4. Cross-feature → `backend/src/common/` e `frontend/src/shared/`. Interno → `features/{nome}/`.
5. **Testes reusam também**: fixtures, factories, builders e helpers compartilhados.
6. Padrão visual repetido em **2+ telas** é dívida até virar componente do DS.

### 5.6 Anti-patterns proibidos

God Object/Class · Spaghetti · Golden Hammer · Lava Flow (código morto) · Boat Anchor · Copy-Paste
Programming · Magic Numbers/Strings · Hard Coding · modelo anêmico onde devia haver comportamento ·
fat controller · otimização prematura · número mágico de mock/Figma sem regra de negócio ou origem no
backend · **controle morto** (opção de UI que não chega ao backend nem tem efeito — remova).

---

## 6. SOLID

- **S — Single Responsibility.** Uma razão para mudar. Controller só orquestra HTTP; Service/UseCase só
  regra; Repository só persistência; validação no DTO. Descreveu com "e"? Divide. Sintoma: arquivo >300
  linhas, função >30.
- **O — Open/Closed.** Comportamento novo via handler/strategy num `Map`, nunca crescendo `switch(type)`.
  Tipo novo = nova classe + 1 linha no array de providers. Sintoma: cadeia de `switch` que cresce todo sprint.
- **L — Liskov.** Subtipo é drop-in do contrato base: sem override que lança `NotImplemented`, sem
  pré-condição fortalecida nem pós-condição enfraquecida. Provider sem um recurso modela via
  `capabilities`, não com `throw`.
- **I — Interface Segregation.** Interfaces pequenas por papel. Use-case que só lê não depende de porta com
  `save/delete` — quebre em `XReader` / `XWriter` com tokens separados.
- **D — Dependency Inversion.** Módulo de alto nível não depende de baixo nível; ambos dependem de
  **abstração**. Ver §7.3 — não-negociável.

---

## 7. Arquitetura

### 7.1 Regra de dependência (Clean Architecture)

**Dependências apontam apenas para DENTRO.**

```
src/<module>/
  domain/          # entities, value objects, regras, PORTS + tokens, erros de domínio — TS puro
  application/     # use cases (1 caso = 1 classe com execute())
  infrastructure/  # repos ORM, adapters externos, controllers, mappers
  shared/          # utils, types
```

- **`domain/` é TypeScript puro** — proibido importar `@nestjs`, `typeorm`, `mongoose`, `ioredis`, `axios`,
  `express`, `pg`, SDK de AWS/Authify/Billing. Anotações `@Entity/@Column` vivem em
  `infrastructure/persistence/` (entity ORM ≠ entity de domínio) com **Mapper** entre elas.
- **Application** nunca importa conceito de HTTP nem retorna apresentação.
- **Controller só adapta** HTTP → Command → UseCase. Zero regra de negócio no controller.
- **Controller nunca chama repositório direto** — sempre via use case.
- Enforce com ESLint (`no-restricted-imports` / `no-restricted-paths`) barrando infra em `domain/`.

### 7.2 Hexagonal (Ports & Adapters)

- **Primary ports (entrada)** = use cases; **primary adapters (driving)** = controllers REST, CLI, BFF.
- **Secondary ports (saída)** = `XxxRepository`, `XxxClient`, `XxxGateway`, `XxxNotifier`;
  **secondary adapters (driven)** = `TypeOrmXxxRepository`, `HttpXxxClient`, `BullMqXxxQueue`.
- Cada adapter é **substituível**; trocar provider = novo adapter, zero mudança no domínio.
- **Testes usam adapters in-memory.**

### 7.3 DIP — o detalhe não-negociável

**Backend**
- Port declarado no `domain/` (interface ou abstract class) + **token de injeção** (`Symbol`/const).
  Adapter em `infrastructure/`. Wire no módulo com `useClass`/`useFactory`.
- **Injeção por construtor apenas.** Proibido `new ConcreteAdapter()` dentro de service/use-case.
- **Todo SDK de terceiro atrás de um client port** — OpenAI/Anthropic, Stripe, AWS, Meta, LinkedIn,
  Twilio, Authify, Billing. Testes trocam por fake in-memory.
- **Efeito colateral atrás de porta** — `Clock`, `IdGenerator`, `Randomizer`, `Sleeper`, `FileStore`, cache,
  fila. **Proibido `Date.now()` / `new Date()` / `Math.random()` / `randomUUID()` inline em regra de negócio.**
- Escolha de adapter em runtime = **factory provider**, nunca service-locator (`moduleRef.get` espalhado).
- Providers são singletons **sem estado mutável compartilhado**; request-scope só para contexto real
  (tenant/correlation), ciente do custo.

**Frontend**
- Componente depende de hook/context, **nunca de `fetch`/`axios` direto**. Dados vivem em `services/` e são
  consumidos por hooks de query/mutation.
- Colaboradores (formatter, validator, navigator, analytics) chegam por prop/context, não por import de topo.
- **Zero lógica de negócio no componente** — componente renderiza; hook decide; service fala com a rede.

**Consequência nos testes:** unit test usa fake das portas — sem `nock`, sem DB, sem rede, sem timer real.

### 7.4 Separe decisão de efeito

Regra de negócio é **função pura dos inputs** (testável sem infra); o efeito é injetado. Invariante mora no
domínio: **Value Object rejeita estado inválido no construtor** (`Email`, `Money`, `CPF`, `PlanTier`), não
no service. VO valida invariante de domínio; DTO valida payload HTTP na borda — coexistem.

### 7.5 DDD / CQRS / Event Sourcing — quando aplicar

- **Bounded context + linguagem ubíqua definidos ANTES de codar.** Cada contexto = 1 módulo com fronteira
  clara; comunicam por ID / integration event. Payload cru de provider externo entra por
  **Anti-Corruption Layer** e vira VO/evento interno — nunca propague o JSON do provider para o core.
- **DDD tático só no core rico em regra:** comportamento **dentro** da aggregate root (proibido
  `entity.status = 'x'` fora da classe — modelo anêmico é o anti-pattern nº1) · aggregates pequenos
  (**1 transação = 1 aggregate**, coleção grande não é array dentro do aggregate) · VOs imutáveis ·
  repositório no boundary da aggregate root, recebendo/devolvendo aggregates (não entities de ORM).
- **Domain event** (interno, fino) para reação que tolera consistência eventual (audit, métrica,
  notificação). **Integration event** (contrato estável) para cross-context/cross-system.
- **Efeito que NÃO pode se perder** (cobrança, sync de terceiro, webhook pro cliente) → **Transactional
  Outbox**: grave o evento na mesma transação do dado; worker publica e marca `sent`; idempotência no
  consumidor por event id. Não use outbox para todo evento interno (overhead).
- **CQRS light por default** nos módulos DDD (separa Command de Query, mesmo banco). **CQRS full com read
  model denormalizado só onde a leitura é gargalo medido.**
- **Event Sourcing NÃO é default.** Só onde histórico append-only é a fonte da verdade e há requisito real de
  auditoria completa/replay/temporal query. Audit log append-only já cobre auditoria sem ES.
- **Adoção incremental** (modular monolith / strangler), nunca big rewrite.

### 7.6 Arquitetura por valor, não por dogma (anti-over-engineering)

Aplique 4 camadas / ports / mappers **só** onde há invariante, orquestração multi-passo ou integração
volátil. **CRUD de apoio** (settings, tags, activity log, preferências) fica simples: módulo + service +
repository, sem use-case anêmico. **Decida por módulo e documente a escolha** no plan doc.

### 7.7 Saga para operação multi-sistema

Operação que toca 2+ sistemas externos (ex.: ativação de cliente = RADIUS + ACS + OLT + billing) **DEVE** ser
saga atômica: cada step com retry exponencial + **idempotency key**; rollback explícito se step crítico
falha; persistência em fila com observabilidade; status em tempo real para a UI.

### 7.8 Fronteira entre apps da suíte

Antes de decidir **onde** a funcionalidade nasce, aplique o teste de decisão de
`organizacao-por-dominios.md` (dado → resultado → eixo → pluralidade → **venda**). Nenhuma app pode passar a
exigir outra para funcionar. Nenhuma camada chama outra fora de API explícita — reação a evento é por
publicação/assinatura, versionada e observada.

---

## 8. Backend — convenções

### 8.1 Módulos e fronteiras
Módulo = bounded context. Exponha só a superfície pública via `exports[]`; outro módulo injeta o provider
exportado, **nunca importa `*.service.ts` por caminho relativo profundo**. `@Global()` só para infra
cross-cutting real (Config/Database/Cache/Logger).

### 8.2 Validação na borda
`ValidationPipe` global com `whitelist: true, forbidNonWhitelisted: true, transform: true`. Todo input
externo entra por **DTO com class-validator** (ou zod `.strict()` fora do Nest). Toda propriedade precisa de
decorator, **inclusive query de listagem — que exige DTO próprio**, senão vira 400. Frontend espelha os
mesmos limites (min/max/length/enum) com contador de caracteres.

### 8.3 DTO ≠ Entity
Mapeie DTO → domínio → persistência com mappers. **Nunca exponha entity do ORM na resposta** nem persista
DTO cru. Aqui acontece a tradução `snake_case`(DB) ↔ `camelCase`(TS) e `UPPERCASE`(enum DB) ↔
`lowercase`(tipo do front).

### 8.4 Persistência (TypeORM/ORM)
- **Sempre `@Column({ name: 'snake_case' })` explícito.**
- **Toda entity nova registrada** no `database.module.ts` (e no `data-source.ts` quando existir).
- **Migration obrigatória** para toda tabela nova e toda mudança estrutural (coluna, índice, constraint,
  rename). **`synchronize: true` é PROIBIDO em produção** — nunca confie em DDL de startup.
- Migration **com rollback, não destrutiva, versionada**, sem lock de tabela em prod.
- **Toda FK tem índice** — o Postgres indexa só o lado referenciado; o lado que referencia é o que o JOIN e o
  `DELETE` do pai varrem. **Migration que cria FK cria o índice junto.**
- Sem transação cross-store (Postgres ↔ Mongo) — coordene por evento/outbox.

### 8.5 Rotas
Específicas **antes** das parametrizadas (`@Get('actions')` antes de `@Get(':id')`).

### 8.6 Config tipada, fail-fast no boot
`ConfigModule` com validação (Joi/class-validator) que **crasha se faltar var**. Acesse só via
`ConfigService`/`registerAs`, nunca `process.env` espalhado. Resolução de ambiente para controle de segurança
(rate limit, cookie `secure`) é **fail-closed**: default = produção; só afrouxa em `development`/`test`
explícito.

### 8.7 Erros
Erro de negócio = **exceção de domínio pura** (sem dependência de framework), traduzida por filter global
para HTTP no envelope `{ error: { code, message, details[], traceId } }`. Não lance `HttpException` no
domínio nem vaze stack/SDK ao cliente.

### 8.8 Transações
Dirigidas pela aplicação, **curtas**, atômicas, com `release()` no `finally`. Efeito colateral só **após
commit**. Operação com múltiplas escritas (ex.: sessão + crédito de pontos) roda em **UMA** transação — sem
check-then-act não-atômico.

### 8.9 Eventos vs fila
`EventEmitter`/EventBus para desacoplamento interno não-crítico (audit, métrica). **Fila (BullMQ)** para o
que não pode se perder: `attempts` + backoff exponencial + `jobId` determinístico (reentrega = no-op).
Teste o `process()` isolado do Redis.

### 8.10 Crypto-at-rest de credenciais (OBRIGATÓRIO)
Toda credencial sensível (senha de provider, shared secret, API key de equipamento, token de gateway,
certificado) é cifrada com **AES-256-GCM** antes de persistir. **NUNCA `JSON.stringify(secret)` direto.**
Sempre checar `isEncrypted()` antes de decifrar (linhas legadas podem estar em plaintext). `GET` devolve
placeholder (`***configurado***`), nunca o payload.

### 8.11 Feature flags e configuração dinâmica

- **Flag é server-driven**: um endpoint (`GET /feature-flags`) entrega o estado; o front consome por hook
  (`useFeatureFlags()`). Nada de flag compilada no bundle que exija rebuild para ligar.
- **Default: dev = ON, produção = OFF.** Liga em prod por env (`FF_*=true`) **sem rebuild**.
- **Preview por usuário**: lista de e-mails (`FEATURE_PREVIEW_*`) libera as flags só para quem testa —
  inclusive furando gates de build.
- **Flag é temporária por natureza.** Quando a feature vira default, **remova a flag e o caminho morto** —
  flag esquecida vira ramo não testado. Flag que sobreviveu a um teardown e não gateia mais nada deve sair
  do código, mesmo que fique no contrato do endpoint por compatibilidade — e isso precisa estar escrito.

### 8.12 Módulo `@Global`: injete o serviço, não importe o módulo

Módulo marcado `@Global()` (Config, Cache, Logger, Audit, Cost/Ledger, data layer) tem seus providers
disponíveis em toda a app: **injete o serviço direto no construtor**. Reimportar o módulo no feature module
duplica provider, cria instância paralela e quebra estado compartilhado (pool, cache, contador).

### 8.13 Escalar de ORM para query builder só com gatilho declarado

O ORM é o default (~95% do código). Subir para query builder tipado (Kysely/knex) ou SQL só nos gatilhos
que o ORM realmente não cobre: `UNION`/`UNION ALL` · `DISTINCT ON` · `LATERAL JOIN` · CTE
(`WITH`/`WITH RECURSIVE`) · window function · comparação de tupla (cursor pagination) · materialized view.
Fora disso, repositório do ORM. **Raw SQL só em migration (DDL).** **Nunca abra pool novo** (`new Pool()`) —
reuse o pool existente. Tipos gerados por codegen não se editam à mão.

---

## 9. API REST

- **URL é substantivo no plural**, verbo é o HTTP. `POST /companies` — nunca `/createCompany`.
  Aninhados: `GET /users/:id/orders`.
- **Status exato:** `200` leitura/atualização com body · `201` POST que cria · `204` DELETE/PATCH sem body ·
  `400` validação · `401` sem token · `403` autenticado sem permissão · `404` não existe (ou não é seu) ·
  `409` conflito · `422` semântica inválida · `500` inesperado · `503` indisponível. Nunca 200 genérico.
- **Envelope consistente:** sucesso `{ data, meta: { page, pageSize, total, hasMore } }`;
  erro `{ error: { code, message, details: [{ field, message }] } }`. Datas em ISO.
- **Versione por URL desde o 1º endpoint público** (`/api/v1`). Nunca quebre a v1 — breaking change vira v2.
  Deprecation policy: anuncia, mantém, remove.
- **Idempotência** em POST com efeito colateral e em **todo webhook**: `Idempotency-Key` ou id determinístico
  do provider com unique constraint.
- **OpenAPI/Swagger gerado dos DTOs**, atualizado, com exemplos e erros, atrás de auth fora de dev.
- Paginação, filtro e ordenação em toda listagem: `?status=active&sort=createdAt:desc&page=2&pageSize=20`.

---

## 10. Frontend

- **Feature-based autocontida:** `features/{nome}/{components,hooks,services,models,types.ts}`. Global
  (`shared/`) só para o genuinamente cross-feature. Fronteira via `index.ts` — outra feature importa
  `from 'features/x'`, nunca o caminho interno.
- **MVVM via hooks:** componente só renderiza; estado/side-effect/orquestração no hook irmão (view-model).
  Componente puramente visual não precisa de hook.
- **Três domínios de estado, ferramentas distintas:** server state → **TanStack Query, dono único** (NUNCA
  copie para `useState`) · UI local (modal, aba, filtro de tela) → `useState`/`useReducer` · UI global
  cross-tela (tema, sidebar) → store leve (Zustand). Em mutation, `invalidateQueries` — não re-setar estado.
- **Query Key Factory por feature** (keys hierárquicas tipadas; invalidar o pai invalida os filhos).
- **Service/gateway por feature (ACL):** `services/x.api.ts` isola fetch/axios, endpoints e mapeia DTO
  → domínio. A View nunca enxerga o shape bruto.
- **Domain logic em `models/`** (puro, sem React): tire ternário de negócio do JSX (`subscription.isActive`).
- **Composição > herança > prop booleana.** `<Panel><Panel.Header/></Panel>`, não
  `<Panel showClose collapsible/>`. Lógica reusável = custom hook, não HOC.
- **Suspense + Error Boundary** declarativos no topo da rota/feature pesada (Suspense não captura erro async).
- **i18n:** ZERO string de UI hardcoded — tudo por `t('namespace.key')`, inclusive placeholder, `aria-label` e
  mensagem de confirmação. Paridade pt-BR/en validada em CI. Chave dinâmica com `defaultValue` e **validada
  contra o catálogo** — nunca interpolar key crua. Cobertura **bidirecional** (catálogo ⊆ locale e sem chave
  órfã); ao remover o último consumidor, remova a chave. Não parta uma frase em múltiplos nós de DOM.
  `{{count}}` só com `_one/_other`.
- **Fonte única de nome/label:** a mesma entidade tem o mesmo texto em todas as telas.
- **Contrato FE↔BE:** o tipo do front espelha o DTO do back **campo a campo, com paridade de TIPO** (union
  fechada, não `string` solta). Mapeamento de nomenclatura entre camadas documentado
  (ex.: `projectId` no BE ↔ `companyId` no FE).
- **Cleanup sempre:** todo `useEffect` que assina algo retorna cleanup; `AbortController` ao trocar de
  rota/recurso; debounce (~300ms) em busca/digitação.
- **Sem `as unknown as X`** em componente — use generics ou type-guard no boundary externo.

---

## 11. Design System First (regra dura)

> O DS é a **única** fonte de primitivos de UI. Tela que o contorna cria drift visual, quebra dark mode /
> responsivo / acessibilidade e força N migrações futuras.

- **SEMPRE importar UI do DS do projeto**, pelo **root barrel**. **PROIBIDO sub-path import** — o layout
  interno não é API pública e quebra tree-shaking/contrato.
- ⚠️ **São DOIS design systems na casa** — confira qual o projeto consome (fonte única: o `package.json` do
  próprio consumidor):
  - **`@diegocezimbra/design-system`** (`00-consultor/08-ds-react`) — tem `npm run propagate-version`;
    consumido pela maioria dos projetos Ohanax.
  - **`@corporativasistemas-blip/crm-design-system`** (`01-ohanax/10-crm-design-system`) — **sem** script de
    propagação (bump manual em cada consumidor).
  - Projetos com **shadcn/ui local** (CRM, o-entregador) seguem a mesma regra "DS First" trocando a origem
    dos primitivos: `src/components/ui`, adicionados por `npx shadcn add`, nunca recriados na tela.
- **Faltou primitivo? Cria no DS primeiro**, publica, propaga, consome. **NUNCA forke dentro de `features/`**
  nem mantenha um `design-system/` in-house paralelo. O componente nasce no DS **para ser reutilizável por
  quem vier depois**; escrito na feature, resolve uma tela e condena a próxima ao copy-paste.
- **Push de primitivo novo contém:** (a) o componente, (b) CSS com tokens do DS, (c) teste/Storybook,
  (d) pelo menos uma tela consumidora migrada.
- **Proibido (ESLint bloqueia o merge):**

| Proibido | Use |
|---|---|
| `<input type="checkbox">` | `<Checkbox>` |
| `<input type="radio">` | `<Radio>` / `<RadioGroup>` / `<SelectableCard>` |
| `<input type="range\|color\|file">` | `<RangeSlider>` / `<ColorPicker>` / `<FileUpload>` |
| `<textarea>` | `<Textarea>` |
| `<select>` | `<Select options={[...]}>` |
| `<table>` sem `<Card>` | `<Card padding="none">` ou `<ResponsiveDataTable>` |
| `alert()` / `confirm()` / `prompt()` | `useConfirm + <ConfirmDialog>` (ou `Alert` dismissível) |
| Hex/`rgba()` hardcoded | `var(--color-*)`, `var(--bg-*)`, `var(--text-*)` |
| `px` fora de múltiplos de 4 | `var(--space-*)` |

  Exceção só em teste e na implementação interna do próprio DS, com
  `// eslint-disable-next-line -- justificativa`.
- **Nunca sobrescreva classe do DS no consumidor** (`.modal`, `.card*`, `.btn*`, `.input*`, `.sidebar-*`,
  `.tabs-*`, `.skel-*`…) — nem com `!important`, nem sem. Se o visual está errado, **o fix é no repo do DS**:
  PR, bump, publica, upgrade. Override é violação, não atalho.
- **Nunca redefina token do DS** (`--bg-*`, `--color-*`, `--space-*`, `--text-*`, `--radius-*`,
  `--border-color`). Faltou token? Abra issue no DS.
- **Pode no CSS local:** utilitário de layout **namespaced por feature** (`.os-list-row`, `.c360-grid-2col`),
  composição de grid/flex e media query da feature — sempre com tokens, sem colidir com nome do DS.
- **Exceção legítima:** composição de negócio que combina primitivos (`CompanyCard`, `DealCard`,
  `ConversationBubble`) vive na feature — mas os átomos vêm do DS.
- **`eslint-disable` de regra do DS no consumidor = falta de primitivo no DS.** Crie o primitivo, não
  silencie o linter.
- **Mock em teste sempre no root do pacote**: `vi.mock('@pkg/design-system', () => ({...}))`, só com os
  exports usados.
- **Bootstrap:** `import '<ds>/styles.css'` ANTES do CSS local no entry — sem isso os tokens não existem.
  Tema: aplicar **ambos** os contratos quando o projeto tiver legado (`<html class="dark">` **e**
  `data-theme="dark"`).
- **Versionamento pré-1.0:** toda bump pode ter breaking change — após instalar, rodar install + typecheck
  em todos os apps antes de commitar.
- **Propagação (`@diegocezimbra/design-system`):** após publicar, rode `npm run propagate-version` em
  `00-consultor/08-ds-react/`. **NUNCA bumpar manualmente projeto por projeto.**

---

## 12. Mobile-first e Acessibilidade

**Mobile-first é obrigatório em toda tela nova e todo refactor.** Tela que "funciona no desktop e fica
esquisita no mobile" é **defeito**, não polimento pendente.

- **Breakpoints (use SEMPRE):** `≤480` smartphone · `≤640` smartphone grande · `≤768` tablet portrait ·
  `≤900` **corte tabela→cards** · `≤1024` laptop pequeno · `>1024` desktop.
- Toda tela funciona em **360px**. Tabela com ≥4 colunas → **dual-layout** (cards ≤900px + table >900px).
  Form multi-coluna colapsa para 1 coluna ≤640px. Modal vira **bottom-sheet** ≤640px. Wizard com stepper
  clicável no mobile (não só "Step X of Y"). Bulk-bar sticky no rodapé ≤640px.
- **Tap target ≥ 32px (44px ideal).** Matriz de teste: 360 / 414 / 768 / 1024 / 1440.

**Acessibilidade (WCAG 2.1 AA)** — mora no contrato do DS, não em cada consumidor:
- **Contraste:** texto ≥ **4.5:1** (≥3:1 texto grande); elemento gráfico/não-textual (série de chart, borda
  funcional) ≥ **3:1** (1.4.11). Spec de contraste resolve os tokens **na fonte** e roda nos **DOIS temas**
  (claro e escuro) — nunca só o claro.
- **Nome acessível obrigatório**: `role="img"`/`"dialog"`/`"progressbar"` exigem `aria-label`/`aria-labelledby`
  (prop **não-opcional**). Em chart, **o dado principal entra no nome acessível**; o conteúdo interno que
  duplica vira `aria-hidden`.
- Diálogo/drawer com **focus trap**, fecha no ESC, navegável por teclado, foco visível.
- **Informação nunca codificada só por cor** — use rótulo/forma além da cor (1.4.1).
- Estados sempre desenhados: loading (skeleton do DS), erro (mensagem amigável + recuperação), **vazio**
  (`EmptyState`), confirmação de ação destrutiva.

---

## 13. Segurança

### 13.1 OWASP — o essencial
- **A01 Access control / IDOR:** toda rota por `:id` inclui o tenant do JWT **no `WHERE`**, nunca filtro
  pós-busca. Não pertence → **404** (não vaza existência). `403` = autenticado sem permissão; `401` = sem
  token; `400` só para request malformado.
- **A02 Cripto:** senha com bcrypt (cost ≥12) ou argon2id; nunca MD5/SHA cru. Segredo só em env validado.
  Cripto em trânsito e em repouso.
- **A03 Injection:** query **sempre parametrizada** (`$1..$n` / `:param`), nunca template string. Filtro de
  Mongo montado a partir de DTO tipado, **nunca `req.body` cru** (atacante injeta `{ $ne: null }`); cast
  explícito de ids. Encodar segmento de path (`encodeURIComponent`) por defesa em profundidade.
- **A05 Misconfig:** sem debug em prod, sem credencial default, sem erro verboso, headers de segurança
  presentes, deps atualizadas.
- **A07 Auth:** access token curto (15min) + refresh (7d); **rate limit** em login/webhook/callback (3 tiers:
  3/s, 20/10s, 100/min); logout invalida sessão; **cache de validação de sessão invalidado no logout E na
  rotação de token** (token revogado não pode validar pelo cache); cookie httpOnly + Secure + SameSite;
  BFF com cookie, não token no localStorage.
- **XSS/CSRF:** encoding de output, sem `innerHTML`/`eval` com input, helmet (CSP/HSTS/noSniff/frameguard),
  CORS com origin explícito + `credentials: true` — **nunca `origin: '*'` com credentials**.

### 13.2 Multi-tenant (regra crítica)
**TODA query operacional filtra pelo tenant.** Sem exceção. O tenant vem **do JWT / da membership**, nunca
de body/query do cliente. `companyId` recebido em path param é **validado contra a membership** do usuário.
Empresa ativa = a selecionada pelo usuário, **nunca** de `.env`/config. Endpoint de admin exige **role**
além do guard de autenticação.

**Mapa de ownership é obrigatório — consulte ANTES de escrever query multi-tenant.** "Escopa por tenant" não
diz *qual coluna*: num mesmo projeto convivem `req.user.id` (auth), `req.user.projectId` (projeto legado) e
`company.id` (tabela de empresas) — e entidades diferentes escopam por chaves diferentes (ex.: pipeline e
atividade de CRM escopando por `user_id`, não por company; knowledge e push escopando por `company_id`
derivado do `projectId` do JWT). Cada projeto mantém a tabela "entity → coluna que escopa" em
`docs/architecture/entity-ownership.md`; **assumir a coluna errada é vazamento entre tenants que passa no
teste feliz.** Entidade nova entra na tabela no mesmo commit.

### 13.3 PII, logs e LGPD
- **Nunca logue** token, cookie, e-mail completo, documento, cartão ou payload cru de provider. Logue id e
  metadado; sanitizador mascara `password|token|apiKey|cpf|creditCard|refresh_token|*_secret` → `[REDACTED]`.
- **Dado de saúde e afins são sensíveis** (LGPD art. 11) — trate como tal em log, resposta de API e relatório.
- **Dashboard/relatório de RH ou empresa é sempre agregado** — nunca registro individual, nunca drill-down
  até a pessoa.
- **k-anonimato:** métrica agregada exige piso mínimo de N por grupo (`MIN_GROUP_SIZE`, ex. ≥5). Abaixo do
  piso, **suprimir/mascarar** (retornar `null`, front renderiza "—" + aviso). Filtro controlável pelo cliente
  (setor, período) **não pode** estreitar o recorte até re-identificar. Cobrir o ramo suprimido com teste RED.
- Exposição de identidade em ranking (nome real vs. iniciais) é **decisão de PO** — confirme antes.

### 13.4 Scripts destrutivos (seed/reset)
Guard real contra produção: **opt-in explícito** (ex.: `DEMO_RESET_CONFIRM=1`) **+ allow-list do nome/porta do
banco de dev**. NUNCA confie só no hostname — túnel SSH expõe prod em localhost. Guard com teste cobrindo
cada ramo; scripts permanecem no type-check.

---

## 14. Performance — regras nascidas de medição em produção

- **Pagine TODA listagem.** `findAndCount` + `skip/take`; cursor (`createdAt+id`) em feed de alto volume.
  Envelope `{ data, meta }`. **Proibido `find()`/`findAll()` sem `take`.**
- **Zero N+1.** Nunca consulta dentro de laço (`for (…) { await repo.findById(…) }`): busque em lote
  (`findByIds`/`IN`) + `Map` por id, ou eager loading (`relations`/`leftJoinAndSelect`). Perigo maior em
  motor de fluxo/hot path, onde o N cresce em silêncio.
- **Tela nunca monta agregado varrendo o backend.** Precisa de dados de N registros → **uma rota agregada**,
  nunca `lista.map(id => api.get(id))`. Sintoma em review: `Promise.all` sobre `.map()` que chama API, ou
  `await` dentro de laço. *(Custou 174 requisições e 32s num relatório real; virou 25 requisições.)*
- **Faltou rota no backend? Registre a lacuna e ABRA A TAREFA** — não normalize a gambiarra no front. Todo
  workaround client-side é um N+1 latente que piora conforme a base cresce.
- **Contar/somar é trabalho do banco.** Não baixe linhas para contar no cliente.
- **Mutação em lote é UM endpoint** com array + UMA transação, não N requisições.
- **Tempo real é WebSocket, não `refetchInterval` curto.** Timer de 30s em hooks de lista gerou **50 mil
  requisições/dia para ~1.000 mensagens/dia**. Se precisar de intervalo, que seja **rede de segurança longa
  (≥5 min)** + `refetchOnWindowFocus`. Antes de adicionar `refetchInterval`: **verifique se já existe evento
  de socket cobrindo aquele dado.**
- **Índices:** em toda coluna de `WHERE`/`JOIN`/`ORDER BY`; **compostos para filtro combinado** —
  `(tenant_id, created_at DESC)` cobre `WHERE tenant=$1 ORDER BY created_at DESC` numa varredura só. Use
  `CREATE INDEX CONCURRENTLY` (não trava escrita em prod).
  ⚠️ **`seq_scan` alto não é sintoma sozinho** — em tabela pequena o planejador varre porque é mais rápido.
  Meça a query real com `EXPLAIN (ANALYZE, BUFFERS)` **antes** de criar o índice. **Índice não usado é
  dívida** (pesa em todo INSERT/UPDATE): confirme `idx_scan=0` por ≥2 semanas antes de remover — o contador
  zera em restart/restore.
- **Cache** em leitura quente idempotente, com TTL e invalidação na escrita. **Nunca cacheie PII.** Nunca
  cache sem TTL/limite. **Nunca cacheie resposta de erro.**
- **Paralelize I/O independente** com `Promise.all`; empurre chamada a provedor externo para fila e responda
  rápido, com o worker atualizando o status. Nenhum `await` serial evitável no caminho quente.
- **Frontend:** code-splitting/lazy por rota, `memo`/`useMemo`/`useCallback` contra re-render, debounce em
  input de alta frequência, imagem otimizada. **Nada pesado no caminho crítico** — biblioteca grande usada em
  poucas telas entra por `import()` dinâmico + prefetch no ocioso.
  ⚠️ Declarar o pacote em `manualChunks` o **prende ao grafo estático** e o bundler volta a pré-carregá-lo,
  anulando o import dinâmico.
- **Meça antes e depois, com número.** Rede: `performance.getEntriesByType('resource')` na tela real.
  Banco: `seq_scan` × `idx_scan` em `pg_stat_user_tables` + `EXPLAIN ANALYZE`. **"Parece mais rápido" não é
  evidência.**

---

## 15. Robustez e concorrência

**Memory leaks** — front: todo `useEffect` que assina (listener, `setInterval`, subscription,
`ResizeObserver`) **retorna cleanup**; `AbortController` em fetch que pode desmontar; não reter ref grande em
closure de vida longa. Back: feche connections/streams, remova listeners, concurrency limitada na fila,
nunca acumule em `Map`/cache sem TTL ou limite.

**Race conditions** — **check-then-act vira atômico**: troque "SELECT depois INSERT" por unique constraint +
`upsert`/`ON CONFLICT` (`.orUpdate([...], ['conflict_col'])`). Webhook/POST com efeito = `Idempotency-Key` /
id do provider único / `jobId` determinístico. Seção crítica entre réplicas (provisionar, debitar cota,
incrementar contador) usa **lock distribuído** (Redis `SET NX PX`) ou transação com isolamento adequado.
Front: `abort()` no request anterior ao trocar de rota + guard de **stale response**; `submit()`/mutation com
**guard de requisição in-flight** e tratamento de resposta fora de ordem; optimistic update **sempre com
rollback** no erro.

**Edge cases (happy path não é Done — cada um vira um teste)** — vazio / zero / um / muitos ·
`null`/`undefined` · string vazia ou só espaço · negativo/overflow · datas (timezone, DST, fim de mês) ·
última página da paginação · lista vazia na UI · rede falha/timeout/retry · provider externo fora do ar ·
payload de webhook malformado.

**Datas & timezone** — "dia"/"semana"/streak/carência usam o **DIA LOCAL** (`America/Sao_Paulo` via `Intl`),
**NUNCA** `new Date().toISOString().slice(0,10)` (UTC). Toda lógica de fuso com teste de **borda**
(meia-noite, virada de mês/ano), sem stub de `today()` que mascare a conversão real.

**Null-safety e erros lógicos** — TS `strict` + `strictNullChecks` ON; **zero `any`** (tipar com interface,
generic, enum ou `unknown` + type guard); `?.`/`??`; compare com `===` (cuidado com truthiness de `0`/`''`);
off-by-one em slice/loop; **não confie em ordem de array vinda do banco sem `ORDER BY`**; ordenação/desempate
determinístico (`localeCompare` com locale explícito). **Proibido `as` que mascara o shape real** — valide ou
normalize; cast só quando a fonte é API externa, **com teste validando o mapeamento**. Guard defensivo +
teste para beco-sem-saída latente.

**Error handling** — **nunca** `catch` vazio/silencioso; re-throw preservando causa
(`new DomainError(msg, { cause: e })`); erro tipado mapeado a HTTP no filter; log com correlation id e **sem
PII**; **nunca use exceção para controle de fluxo**. Falha de integração externa best-effort (auditada e não
derruba a persistência local) é **decisão explícita por caso**, nunca default silencioso.

---

## 16. Observabilidade, auditoria e operação

- **`AuditService` é obrigatório e já existe — NUNCA crie tabela/endpoint de log próprio.**
  **Regra de ouro:** toda operação que (a) modifica estado, (b) dispara processo automatizado, (c) decide
  sobre dados do usuário ou (d) é executada por IA **DEVE** chamar `auditService.log()`. Sem exceção.
- **Sempre auditar:** destrutivas (DELETE/REJECT/PAUSE/REVOKE/ARCHIVE), operação em lote, disparo manual de
  job, cron com efeito visível, mudança de config, ação com custo de IA, ação em rede social/rede física,
  billing, auth, compliance. `source`: `api` / `cron` / `worker` / `ai_*`. Padrão **fire-and-forget**
  (`try/catch` silencioso — auditoria **nunca** bloqueia a request), append-only, campos sensíveis mascarados.
- **Logs estruturados** (`{ traceId, tenantId, userId, action, ...payload }`), nível certo, sem PII, sem
  `console.log` — use o Logger do projeto.
- **Métricas** Prometheus em `/metrics` (protegido), histogramas de duração de request; **traces**
  (OpenTelemetry) com span manual em chamada externa; **health** `/health` (+ `/ready`, `/live`).
- Exporter com fonte lenta coleta em **thread/background**, nunca no caminho do scrape.
- **Métrica que não emite é pior que métrica ausente** — painel zerado passa por "está tudo calmo". Ao
  remover um domínio, anote quais séries deixaram de existir e quais painéis ficaram vazios.

### 16.1 Armadilhas operacionais recorrentes (custaram caro pelo menos uma vez)

- **Auto-deploy por webhook nativo falha em silêncio** — app fica com código velho e ninguém percebe.
  Prefira **CI → API do deployer** (GitHub Actions → `/api/v1/deploy?uuid=...`), disparando só os apps cujos
  paths mudaram, com o token no secret do repositório.
- **UUID de container muda a cada deploy** — nunca hardcode o nome completo em runbook/script; resolva com
  `docker ps -qf name=<uuid-base>`.
- **Label de métrica de cron colide com o label do scrape** — `job` costuma ser o *target* (ex.:
  `app-worker`) e o nome real do cron vai para `exported_job`. Query por cron usa `exported_job=~"..."`;
  usar `job` devolve tudo ou nada.
- **Let's Encrypt HTTP-01 falha com Cloudflare em modo proxied** (orange cloud): o CF intercepta
  `/.well-known/acme-challenge/*` e devolve 404. Fix: DNS-only (grey cloud) até o cert emitir; voltar a
  proxied só em modo **Full (não strict)**.
- **Porta do app ≠ label do proxy = 502.** Nunca setar `PORT` como env var para "resolver" — corrija o label.
- **Restart não re-injeta env var** — mudança de env exige redeploy, e deploy rolling mantém o container
  velho atendendo até a troca.
- Um serviço que precisa falar com outro **na mesma máquina** usa a **rede interna** (alias do container),
  não a URL pública.

---

## 17. Documentação é contrato

> Doc que mente sobre o código é pior que doc ausente — induz dev/agente a reimplementar o que existe ou a
> manter o que não roda. **Em conflito doc ↔ código, o código é a verdade** e a doc é corrigida imediatamente.

- **Atualize no MESMO commit da mudança** — nunca "depois". Doc desatualizada por causa da task faz parte da
  Definition of Done: sem isso, não fecha.
- **Gatilhos → o que atualizar:** estado de feature → README/tabela de status · rota nova ou alterada →
  doc de endpoints + collection Postman · schema/migration → doc de modelo de dados · fluxo/arquitetura →
  doc de arquitetura · env var → `.env.example` + seção de env do `CLAUDE.md` · stack/deploy/infra →
  `CLAUDE.md` + docs de operação · regra de engenharia → **este arquivo (canônico primeiro, depois as cópias)**.
- **Valor único tem UMA fonte de verdade citada** (ex.: nome do pacote do DS = `package.json` do consumidor).
  Nunca duplique o literal em N docs sem apontar a fonte.
- **Boy Scout da doc:** achou doc desatualizada de passagem, conserte (ou registre).
- **Antes de fechar a task**, rode uma checagem de coerência do que você tocou
  (`grep -rn '<conceito-alterado>' docs/ CLAUDE.md`) e alinhe o que divergiu.
- **PR/commit com corpo descritivo** — o que entrega, escopo, e por que mudanças tangenciais entraram junto.

### 17.1 Como manter o `CLAUDE.md` do projeto

O `CLAUDE.md` carrega em **toda sessão** — cada linha custa contexto por turno. O padrão da suíte é
**arquivo enxuto + ponteiro para o registro canônico em `docs/`**:

- **Fica inline** só o que muda a decisão do primeiro minuto: regras absolutas, stack, quality gates,
  convenções que se aplicam a quase todo commit, gotchas que fazem perder horas.
- **Vai para `docs/`** (com resumo de 1-3 linhas + link inline): tratado de engenharia, runbook, catálogo do
  DS, inventário de infra, histórico, integrações, análises.
- **Enxugar NUNCA é deletar.** O conteúdo sai do inline **verbatim** para `docs/` e o `CLAUDE.md` registra
  "nada foi perdido nesta enxugada (data)". Termine o arquivo com um índice **Referências (registro
  canônico — leia sob demanda)** listando cada doc e quando lê-lo.
- **Documente o que SAIU do escopo, não só o que entrou.** Depois de um teardown/rebrand/migração, escreva
  as **consequências que valem lembrar antes de "consertar" algo** (o que deixou de existir, qual fallback
  morreu, qual endpoint recusa de propósito, o que continua no banco e por quê). Sem isso, o próximo agente
  "conserta" de volta o que foi removido de propósito.
- **Migration existente nunca é apagada** — o histórico roda do zero em ambiente novo. Remoção de tabela é
  migration nova.
- Renomeou produto/domínio? Registre **o que ficou com o nome antigo DE PROPÓSITO** (tabela, prefixo de
  storage, env var, container) — senão alguém "padroniza" e quebra produção.

---

## 18. Quality Gates e Definition of Done

**Ordem obrigatória ANTES de todo commit** (pare no primeiro que falhar):

1. `npm run lint` → **0 erros, 0 warnings** (`--max-warnings 0`)
2. `npx tsc --noEmit` → **0 erros** (produção **e** specs compilam)
3. `npm test` / `npx jest --no-coverage` → **todos passando**
4. `npm run test:cov` → **cobertura ≥ threshold do projeto**
5. Só então: `git add <seus arquivos>` → `git commit` → `git push` (direto na `main`)

- **NUNCA `any`. NUNCA `eslint-disable`.** Regra do linter reclamando = correção no **código**, não no config.
- **Nunca commitar com teste falhando.** Toda alteração de produção tem teste correspondente.

**Definition of Done:** história com critérios Given-When-Then (viraram testes) · TDD seguido (spec antes) ·
suíte verde + cobertura no threshold · limites de tamanho OK · DS-first · sem segredo/PII vazando · sem
`console.log` · migration criada e testada (não `synchronize`) · Swagger/OpenAPI atualizado · documentação
atualizada no mesmo commit · quality gates verdes · plan doc atualizado.

---

## 19. Code Review — checklist exaustivo

> Revisão **rigorosa e impiedosa** por design: ache TODOS os problemas e priorize.
> Severidade: 🔴 crítico (bug/segurança/crash) · 🟠 alto · 🟡 médio · 🟢 baixo · 🔵 info.

**1. Arquitetura & Design** — SOLID (SRP/OCP/LSP/ISP/DIP) · regra de dependência apontando pra dentro ·
entity sem ORM · use case sem HTTP · domínio isolado, ports de entrada e saída, adapters intercambiáveis ·
padrões onde ajudam; anti-patterns ausentes · View sem regra, ViewModel sem referência à View concreta.

**2. Clean Code** — tamanho (função ≤30, classe ≤300, **arquivo ≤300 — 🔴 se >1000**, complexidade ≤10,
aninhamento ≤4, params ≤4) · nomes com intenção · função faz 1 coisa, 1 nível de abstração, sem efeito
oculto/flag arg · comentários úteis e atuais, zero código comentado/TODO abandonado · DRY/KISS/YAGNI.

**3. Segurança (OWASP)** — injection · auth quebrada · dado sensível em log/URL/erro · XSS/CSP ·
access control (IDOR, tenant no WHERE, authz por role, CORS) · misconfig · CSRF · **zero secret no código**.

**4. Performance** — sem N+1, sem `SELECT *`, índices certos, paginação sempre, transação curta · sem leak,
cache com limite · timeout+retry com backoff, requests independentes em paralelo · bundle/lazy, sem
re-render desnecessário · cache com TTL/invalidação/anti-stampede.

**5. Tratamento de erros** — sem catch genérico/silenciado · sem exceção como fluxo · re-throw preserva
stack · mensagem sem stack/PII ao usuário · log estruturado com correlation id · null safety · validação no
backend (não só no front).

**6. Concorrência & async** — race conditions, check-then-act atômico · sem deadlock · `async` correto
(sem `async` sem await, toda Promise tratada, cancelamento).

**7. Banco** — normalização, constraints e FKs, tipos e defaults · índices certos (e sem índice morto) ·
transação onde precisa, unicidade, integridade · **migration com rollback, não destrutiva, versionada;
`synchronize:true` proibido em prod**.

**8. API** — verbo/URL/versão/status corretos, paginação/filtro/sort · request validado por DTO, envelope
consistente, datas ISO · Swagger atualizado, webhook idempotente.

**9. Testes** — unit+integração+e2e, ≥ thresholds, caminhos críticos + edge + erro · testa comportamento,
não implementação; não-flaky; isolado; AAA; 1 conceito por teste · dependências injetáveis (sem singleton/
`new` interno que impeça o fake) · **TDD: spec antes da produção**.

**10. UX/UI & Design System** — a11y (alt/label, contraste, ARIA, teclado, foco visível) · estados
(loading/erro/vazio/confirmação destrutiva) · responsivo 360px, tap ≥32px · i18n sem string hardcoded ·
**DS: zero cor/spacing/tipografia hardcoded, zero fork de primitivo, dark mode suportado**.

**11. Manutenibilidade** — estrutura clara, sem dependência circular, boundaries de módulo · config por
ambiente, validada no boot, sem secret · deps atualizadas, sem vuln, **sem dependência morta**, lock file
commitado, **bump não-relacionado não entra em PR de feature** · sem TODO/FIXME acumulado, sem código morto.

**12. Infra & DevOps** — CI com teste+lint, deploy automatizado, rollback, secrets não expostos · imagem
enxuta multi-stage, non-root, healthcheck, sem secret no Dockerfile · métricas, logs centralizados, uptime,
tracing, dashboards, alertas.

**13. Stack (TS/React/Nest)** — sem `any`, `strict` ON, `===`, toda Promise tratada · `useEffect` com
cleanup, `key` em lista, server-state no Query, sem mutação de prop/estado · módulos coesos, DI por token
(sem service-locator), DTO + ValidationPipe, ports&adapters nas integrações, ConfigModule validado.

**Saída do review** (por arquivo): 🔴/🟠/🟡/🟢 com `arquivo:linha`, impacto e correção concreta (código atual
→ sugerido). Feche com **resumo executivo**: score por categoria + TOP 5 críticos + roadmap por fase + quick
wins. **Formato do veredito:**

```
TDD Compliance: PASS — tests-before: YES | regression test: YES | coverage 84%/72%: YES
Size/SOLID/DS/Security/Perf: PASS
```

---

## 20. Anexo — o que varia por projeto

Estas são as dimensões em que os projetos **legitimamente divergem**. Consulte o `CLAUDE.md` do projeto; ele
vence este arquivo nesses pontos.

| Dimensão | Onde confirmar |
|---|---|
| **Design System consumido** | `package.json` do próprio consumidor (é a fonte única) |
| **Thresholds de cobertura** | `jest.config` / `vitest.config` do projeto + `CLAUDE.md` |
| **Stack de teste** | Jest (backend) · Vitest (front/admin) · `go test` (Go) |
| **Nome do tenant** | `companyId` · `contextId` · `projectId` · `empresaId` · `tenantId` (documente o mapeamento FE↔BE) |
| **Data layer** | TypeORM default; query builder tipado só nos gatilhos do §8.13; raw SQL só em migration |
| **Coluna que escopa cada entity** | `docs/architecture/entity-ownership.md` do projeto (§13.2) — nunca assuma |
| **Feature flags ativas** | endpoint `GET /feature-flags` + `docs/features/feature-flags.md` do projeto |
| **Escopo da app / o que saiu** | seção de escopo do `CLAUDE.md` do projeto (§17.1) — leia antes de "consertar" |
| **Playwright MCP** | proibido onde o projeto declara (SellPipe/Prospecção); framework E2E no repo é outra coisa (§1.9) |
| **Idioma do domínio** | EN por padrão; PT-BR no domínio quando o projeto declara (v8pipe: domínio PT-BR, técnico EN) |
| **Deploy** | Coolify / Amplify / Firebase / AWS — ver `CLAUDE.md` + docs de operação do projeto |

---

## 21. Referências canônicas

- `agents/tech/engineering-directives.md` — os 3 pilares (princípios · planejamento · direto na main)
- `agents/tech/organizacao-por-dominios.md` — em qual app a funcionalidade nasce
- `agents/tech/10-tdd.md` · `10-tdd-patterns.md` — spec completa de TDD
- `agents/tech/01-solid.md` · `02-clean-code.md` · `03-clean-architecture.md` · `04-hexagonal.md`
- `agents/tech/05-security.md` · `06-performance.md` · `07-testing.md` · `08-api-design.md` · `09-code-review.md`
- `agents/tech/11-mobile-testing.md` · `14-android-testing.md` — mobile
- `agents/tech/12-server-management.md` — infra, Docker, Coolify, backup, hardening
- `agents/tech/13-new-project-setup.md` — scaffolding de projeto novo
- `agents/tech/15-use-case-spec.md` — padrão de caso de uso
- `agents/operations/44-product-owner.md` — user story, GWT, DoR/DoD
- `00-claude-knowledge/CLAUDE.md` — diretrizes globais, MCPs, Telegram
