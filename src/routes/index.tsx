import { createFileRoute } from "@tanstack/react-router";

/**
 * A landing de `/` é HTML estático (static/index.html), servido pelo Node antes do
 * SSR — ver server-entry.mjs. Esta rota existe só para a árvore do router ficar
 * completa; ela nunca chega a renderizar em produção. Editar a landing é editar o
 * HTML, não este arquivo.
 */
export const Route = createFileRoute("/")({
  component: () => null,
});
