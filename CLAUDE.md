
## Infra — megamigração 2026-07 (Cenário B)
- **Produção nova (prod-ohanax)**: 80.190.72.190 — Contabo VDS L (12 cores dedicados EPYC 7282 · 48 GB · 348 GB NVMe, US (região americana); IPv6 IPv6: ver painel Contabo). SSH pubkey-only; credenciais completas em `.credentials/infra-migracao-2026.md` (NUNCA commitar segredos).
- **Topologia**: 1 Coolify único (control plane no servidor ops, a provisionar) gerencia prod + ops + data (Contabo 95.111.253.42 — só master-cpf/leads-clickhouse).
- **Cutover**: DNS Cloudflare SÓ vira com 100% migrado/validado + sync final de dados antes do flip. Plano canônico: `~/Documents/00-projetos/01-ohanax/00-migration/`.
