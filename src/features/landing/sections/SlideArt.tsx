import type { SlideArt as ArtKey } from "../landing.config";

/**
 * Arte de cada slide do hero. SVG inline em vez de foto: não temos banco de imagem da
 * VBZ e foto de banco genérica ("família feliz no sofá") é justamente o que faz uma
 * landing de provedor parecer com a de todo mundo. Herda a cor do contexto via
 * currentColor, então funciona no hero escuro sem versão alternativa.
 */
const G = "oklch(0.78 0.18 140)";

export function SlideArt({ art }: { art: ArtKey }) {
  const common = { viewBox: "0 0 400 260", role: "img", "aria-hidden": true } as const;

  if (art === "fibra") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="vbz-fib" x1="0" x2="1">
            <stop offset="0" stopColor={G} stopOpacity=".15" />
            <stop offset="1" stopColor={G} stopOpacity=".95" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M10 ${70 + i * 40} C 140 ${70 + i * 40}, 180 130, 390 130`} fill="none"
            stroke="url(#vbz-fib)" strokeWidth="3" strokeLinecap="round" opacity={0.35 + i * 0.2} />
        ))}
        <circle cx="390" cy="130" r="12" fill={G} />
        <circle cx="390" cy="130" r="22" fill={G} opacity=".22" />
        <text x="20" y="46" fill="currentColor" opacity=".55" fontSize="13" fontWeight="700">Central VBZ</text>
        <text x="286" y="182" fill="currentColor" opacity=".55" fontSize="13" fontWeight="700">Sua casa</text>
      </svg>
    );
  }

  if (art === "wifi") {
    return (
      <svg {...common}>
        <rect x="150" y="176" width="100" height="34" rx="10" fill="currentColor" opacity=".14" />
        <circle cx="200" cy="193" r="5" fill={G} />
        {[34, 66, 98, 130].map((r, i) => (
          <path key={r} d={`M ${200 - r} 186 A ${r} ${r} 0 0 1 ${200 + r} 186`} fill="none" stroke={G}
            strokeWidth="6" strokeLinecap="round" opacity={0.85 - i * 0.18} />
        ))}
      </svg>
    );
  }

  if (art === "suporte") {
    return (
      <svg {...common}>
        <rect x="42" y="52" width="196" height="120" rx="18" fill="currentColor" opacity=".1" />
        <rect x="64" y="80" width="120" height="12" rx="6" fill={G} opacity=".8" />
        <rect x="64" y="104" width="152" height="12" rx="6" fill="currentColor" opacity=".3" />
        <rect x="64" y="128" width="88" height="12" rx="6" fill="currentColor" opacity=".3" />
        <rect x="176" y="126" width="150" height="86" rx="18" fill={G} opacity=".9" />
        <rect x="196" y="150" width="110" height="10" rx="5" fill="oklch(0.22 0.04 155)" opacity=".65" />
        <rect x="196" y="172" width="74" height="10" rx="5" fill="oklch(0.22 0.04 155)" opacity=".45" />
      </svg>
    );
  }

  if (art === "streaming") {
    return (
      <svg {...common}>
        <rect x="56" y="44" width="288" height="160" rx="16" fill="currentColor" opacity=".12" />
        <rect x="56" y="44" width="288" height="160" rx="16" fill="none" stroke={G} strokeWidth="2" opacity=".5" />
        <path d="M178 104 l52 30 -52 30 z" fill={G} />
        <rect x="150" y="220" width="100" height="8" rx="4" fill="currentColor" opacity=".25" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M60 150 L200 60 L340 150" fill="none" stroke={G} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="96" y="150" width="208" height="76" rx="12" fill="currentColor" opacity=".12" />
      <rect x="176" y="182" width="48" height="44" rx="6" fill={G} opacity=".85" />
      <circle cx="292" cy="88" r="20" fill={G} opacity=".2" />
      <path d="M283 88 l7 7 14 -16" fill="none" stroke={G} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
