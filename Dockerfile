FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV WRANGLER_WRITE_LOGS=false
ENV WRANGLER_LOG_PATH=/tmp/wrangler/logs
ENV MINIFLARE_REGISTRY_PATH=/tmp/wrangler/registry

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node_modules/.bin/vinext", "start", "--host", "0.0.0.0", "--port", "3000"]
