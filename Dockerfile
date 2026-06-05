FROM node:20-alpine AS base

# ── Stage 1: install dependencies ──────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ─────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept NEXT_PUBLIC_* as build-args (CI / docker build --build-arg).
# When supplied they take precedence over any .env.local in the context.
# When omitted the .env.local copied above is used (local dev).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

RUN if [ -n "$NEXT_PUBLIC_API_URL" ]; then \
      printf 'NEXT_PUBLIC_API_URL=%s\nNEXT_PUBLIC_FIREBASE_API_KEY=%s\nNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%s\nNEXT_PUBLIC_FIREBASE_PROJECT_ID=%s\nNEXT_PUBLIC_FIREBASE_APP_ID=%s\n' \
        "$NEXT_PUBLIC_API_URL" \
        "$NEXT_PUBLIC_FIREBASE_API_KEY" \
        "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
        "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
        "$NEXT_PUBLIC_FIREBASE_APP_ID" \
      > .env.local; \
    fi

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: production runner ──────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
