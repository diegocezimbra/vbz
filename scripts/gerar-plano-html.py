#!/usr/bin/env python3
"""Gera static/plano-anuncios-provedor.html a partir de anuncios/plano-anuncios-provedor.md.

O HTML e DERIVADO: nao edite ele na mao. Mudou o MD, rode este script de novo:

    python3 scripts/gerar-plano-html.py

Escrever o HTML a mao faria as duas versoes divergirem em silencio - alguem le a
pagina, decide por um numero velho, e ninguem descobre ate dar errado.
"""
import html
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "anuncios" / "plano-anuncios-provedor.md"
DESTINO = RAIZ / "static" / "plano-anuncios-provedor.html"


def inline(txt: str) -> str:
    """Negrito, italico e codigo. Escapa ANTES para nao injetar HTML do markdown."""
    t = html.escape(txt)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", t)
    return t


def converter(md: str) -> str:
    linhas = md.split("\n")
    out, i = [], 0
    lista_aberta = None  # "ul" | "ol" | None

    def fechar_lista():
        nonlocal lista_aberta
        if lista_aberta:
            out.append(f"</{lista_aberta}>")
            lista_aberta = None

    while i < len(linhas):
        ln = linhas[i]

        if ln.startswith("```"):
            fechar_lista()
            i += 1
            bloco = []
            while i < len(linhas) and not linhas[i].startswith("```"):
                bloco.append(html.escape(linhas[i]))
                i += 1
            out.append("<pre><code>" + "\n".join(bloco) + "</code></pre>")
            i += 1
            continue

        # tabela: linha de cabecalho seguida do separador |---|
        if ln.startswith("|") and i + 1 < len(linhas) and re.match(r"^\|[\s:|-]+\|$", linhas[i + 1]):
            fechar_lista()
            cels = [c.strip() for c in ln.strip("|").split("|")]
            out.append("<div class='tabela-rolavel'><table><thead><tr>"
                       + "".join(f"<th>{inline(c)}</th>" for c in cels)
                       + "</tr></thead><tbody>")
            i += 2
            while i < len(linhas) and linhas[i].startswith("|"):
                cels = [c.strip() for c in linhas[i].strip("|").split("|")]
                out.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cels) + "</tr>")
                i += 1
            out.append("</tbody></table></div>")
            continue

        if re.match(r"^#{1,4} ", ln):
            fechar_lista()
            n = len(ln) - len(ln.lstrip("#"))
            texto = ln[n:].strip()
            # id no heading para o indice lateral funcionar
            slug = re.sub(r"[^a-z0-9]+", "-", texto.lower()).strip("-")
            out.append(f'<h{n} id="{slug}">{inline(texto)}</h{n}>')
            i += 1
            continue

        if ln.strip() == "---":
            fechar_lista()
            out.append("<hr>")
            i += 1
            continue

        if ln.startswith("> "):
            fechar_lista()
            bloco = []
            while i < len(linhas) and linhas[i].startswith(">"):
                bloco.append(linhas[i].lstrip(">").strip())
                i += 1
            out.append("<blockquote>" + inline(" ".join(bloco)) + "</blockquote>")
            continue

        m_ul = re.match(r"^[-*] (.*)", ln)
        m_ol = re.match(r"^\d+\. (.*)", ln)
        if m_ul or m_ol:
            tipo = "ul" if m_ul else "ol"
            if lista_aberta != tipo:
                fechar_lista()
                out.append(f"<{tipo}>")
                lista_aberta = tipo
            out.append(f"<li>{inline((m_ul or m_ol).group(1))}</li>")
            i += 1
            continue

        if not ln.strip():
            fechar_lista()
            i += 1
            continue

        # paragrafo: junta linhas ate a proxima em branco ou estrutura
        fechar_lista()
        bloco = []
        while i < len(linhas) and linhas[i].strip() and not re.match(
            r"^(#{1,4} |[-*] |\d+\. |\||>|```|---$)", linhas[i]
        ):
            bloco.append(linhas[i].strip())
            i += 1
        if bloco:
            out.append("<p>" + inline(" ".join(bloco)) + "</p>")

    fechar_lista()
    return "\n".join(out)


def indice(md: str) -> str:
    itens = []
    for ln in md.split("\n"):
        if ln.startswith("## "):
            t = ln[3:].strip()
            slug = re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")
            itens.append(f'<a href="#{slug}">{html.escape(t)}</a>')
    return "\n".join(itens)


PAGINA = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plano de Anuncios - VBZ</title>
<!-- Documento interno: fora do indice de busca. -->
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/assets/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<style>
:root{--roxo:265 85% 58%;--rosa:330 90% 62%;--rosa-escuro:330 85% 46%;
  --ink:#1a1020;--fg:#4a4356;--muted:#6b6478;--linha:#e6e0ee;--bg:#fcfbfe}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
  font:16px/1.7 Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.topo{background:#121212;color:#fff;padding:22px clamp(20px,5vw,56px);
  display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:10}
.topo img{height:26px}
.topo span{font:700 14px/1 Inter,sans-serif;color:hsl(0 0% 100% / .6);letter-spacing:.4px}
.wrap{display:grid;grid-template-columns:1fr;gap:40px;
  padding:clamp(24px,4vw,52px) clamp(20px,5vw,56px);max-width:1400px}
nav.indice{display:none}
main{min-width:0;max-width:80ch}
h1{font:800 clamp(28px,4vw,42px)/1.15 'Plus Jakarta Sans',sans-serif;color:var(--ink);
  letter-spacing:-1.2px;margin:0 0 18px}
h2{font:800 clamp(21px,2.6vw,28px)/1.25 'Plus Jakarta Sans',sans-serif;color:var(--ink);
  letter-spacing:-.7px;margin:52px 0 14px;padding-top:14px;border-top:2px solid hsl(var(--rosa-escuro) / .25)}
h3{font:700 18px/1.35 'Plus Jakarta Sans',sans-serif;color:var(--ink);margin:32px 0 10px}
h4{font:700 15.5px/1.4 'Plus Jakarta Sans',sans-serif;color:var(--ink);margin:24px 0 8px}
p{margin:0 0 14px}
strong{color:var(--ink);font-weight:700}
a{color:hsl(var(--rosa-escuro))}
code{background:hsl(var(--roxo) / .08);color:hsl(265 70% 40%);padding:2px 6px;
  border-radius:5px;font:600 13.5px/1 ui-monospace,monospace}
pre{background:#121212;color:#f2eefb;padding:18px 20px;border-radius:12px;overflow-x:auto}
pre code{background:none;color:inherit;font-size:13.5px;line-height:1.65;padding:0}
blockquote{margin:0 0 22px;padding:16px 20px;background:hsl(var(--roxo) / .06);
  border-left:4px solid hsl(var(--roxo));border-radius:0 10px 10px 0;color:var(--fg)}
ul,ol{margin:0 0 16px;padding-left:22px}
li{margin-bottom:7px}
li::marker{color:hsl(var(--rosa-escuro));font-weight:700}
hr{border:0;border-top:1px solid var(--linha);margin:34px 0}
.tabela-rolavel{overflow-x:auto;margin:0 0 22px;border:1px solid var(--linha);border-radius:12px}
table{border-collapse:collapse;width:100%;font-size:14.5px}
th{background:hsl(var(--roxo) / .07);color:var(--ink);font-weight:700;text-align:left;
  padding:12px 14px;border-bottom:1px solid var(--linha);white-space:nowrap}
td{padding:11px 14px;border-bottom:1px solid var(--linha);vertical-align:top}
tr:last-child td{border-bottom:0}
@media (min-width:1040px){
  .wrap{grid-template-columns:250px 1fr}
  nav.indice{display:block;position:sticky;top:96px;align-self:start;max-height:calc(100vh - 130px);
    overflow-y:auto;font-size:13.5px;border-right:1px solid var(--linha);padding-right:18px}
  nav.indice a{display:block;padding:6px 0;color:var(--muted);text-decoration:none;line-height:1.4}
  nav.indice a:hover{color:hsl(var(--rosa-escuro))}
}
</style>
</head>
<body>
<header class="topo">
  <img src="/assets/vbz-logo-rosa.png" alt="VBZ">
  <span>DOCUMENTO INTERNO</span>
</header>
<div class="wrap">
  <nav class="indice">__INDICE__</nav>
  <main>__CORPO__</main>
</div>
</body>
</html>
"""

md = ORIGEM.read_text(encoding="utf-8")
DESTINO.write_text(
    PAGINA.replace("__CORPO__", converter(md)).replace("__INDICE__", indice(md)),
    encoding="utf-8",
)
print(f"gerado: {DESTINO.relative_to(RAIZ)} ({DESTINO.stat().st_size} bytes)")
