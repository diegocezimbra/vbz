# Node 22: o @tanstack/react-start exige >= 22.12 (engines) — em node 20 o build roda com aviso e o
# runtime fica fora do suporte. Decisão do Diego (24/09/2026). A CI roda os portões na MESMA imagem.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

# O Vite assa a env do navegador no bundle: sem ARG, VITE_SENTRY_DSN nao chega
# ao build e o rastreamento do lado cliente nasce morto. (Do lado servidor a
# DSN e lida de process.env em runtime, por isso nao entra aqui.)
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_RELEASE
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN \
    VITE_SENTRY_RELEASE=$VITE_SENTRY_RELEASE

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

# A base chega com CVEs HIGH já corrigidas no Alpine: o scan da CI (trivy, HIGH/CRITICAL
# corrigíveis) reprova sem o upgrade. O runtime é `node server-entry.mjs`: npm, npx, corepack e yarn
# da imagem base não rodam em produção e trazem as próprias dependências (tar, minimatch,
# cross-spawn…) — saem no mesmo RUN que usou o npm pela última vez.
COPY package*.json ./
RUN apk upgrade --no-cache \
    && npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
              /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
              /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

COPY --from=builder /app/dist ./dist
COPY server-entry.mjs server-static.mjs ./
COPY static ./static

EXPOSE 3000

CMD ["node", "--experimental-detect-module", "server-entry.mjs"]
