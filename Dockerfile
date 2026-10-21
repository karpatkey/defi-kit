FROM node:24-alpine as base

# node:*-alpine ships only ca-certificates-bundle, as of the image build.
# --upgrade pulls Alpine's current store: 20261020-r0 dropped emSign ECC Root
# CA - G3, whose intermediates' keys leaked in October 2026.
RUN apk add --no-cache --upgrade ca-certificates ca-certificates-bundle

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/sdk/node_modules ./sdk/node_modules
COPY --from=deps /app/playground/node_modules ./playground/node_modules

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn setup
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# Verify TLS against the Alpine store above, not Node's bundled roots, which
# still hold emSign ECC Root CA - G3 until a Node 24.x release carries
# nodejs/node#66871.
ENV NODE_OPTIONS=--use-openssl-ca

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone/app ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]