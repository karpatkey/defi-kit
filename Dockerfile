FROM node:20.2-alpine as deps

WORKDIR /app

COPY ./app/package.production.json ./package.json

RUN yarn install --production

FROM deps as runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --chown=nextjs:nodejs /app/.next/standalone/app ./
COPY --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]