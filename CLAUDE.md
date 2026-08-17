
<!-- boas-praticas-consolidadas -->
> 📐 **Boas Práticas Consolidadas (OBRIGATÓRIO — ler antes de qualquer trabalho não-trivial)**
> Padrão ÚNICO de engenharia de todas as aplicações: regras absolutas · planejamento & plan doc · TDD · qualidade de testes · Clean Code · SOLID · arquitetura (Clean/Hexagonal/DIP/DDD) · convenções de backend · API REST · frontend · **Design System First** · mobile-first & acessibilidade · segurança & LGPD · performance · robustez & concorrência · observabilidade & auditoria · documentação como contrato · quality gates & DoD · checklist exaustivo de code review.
> **Cópia deste projeto:** [`docs/boas-praticas/boas-praticas-consolidadas.md`](docs/boas-praticas/boas-praticas-consolidadas.md) · **Canônico:** `~/Documents/00-claude-knowledge/agents/tech/boas-praticas-consolidadas.md`
> Regra específica deste projeto vence a geral em conflito. **Alterou uma cópia? Replique na canônica e em todas as outras na mesma leva.**


## Infra — megamigração 2026-07 (Cenário B)
- **Produção nova (prod-ohanax)**: 80.190.72.190 — Contabo VDS L (12 cores dedicados EPYC 7282 · 48 GB · 348 GB NVMe, US (região americana); IPv6 IPv6: ver painel Contabo). SSH pubkey-only; credenciais completas em `.credentials/infra-migracao-2026.md` (NUNCA commitar segredos).
- **Topologia**: 1 Coolify único (control plane no servidor ops, a provisionar) gerencia prod + ops + data (Contabo 95.111.253.42 — só master-cpf/leads-clickhouse).
- **Cutover**: DNS Cloudflare SÓ vira com 100% migrado/validado + sync final de dados antes do flip. Plano canônico: `~/Documents/00-projetos/01-ohanax/00-migration/`.
