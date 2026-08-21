FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# O Vite assa a env do navegador no bundle: sem ARG, VITE_SENTRY_DSN nao chega
# ao build e o rastreamento do lado cliente nasce morto. (Do lado servidor a
# DSN e lida de process.env em runtime, por isso nao entra aqui.)
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_RELEASE
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN \
    VITE_SENTRY_RELEASE=$VITE_SENTRY_RELEASE

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY server-entry.mjs server-static.mjs ./
COPY static ./static

EXPOSE 3000

CMD ["node", "--experimental-detect-module", "server-entry.mjs"]
