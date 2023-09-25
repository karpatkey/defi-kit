FROM node:20.2-alpine as runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --chown=nextjs:nodejs /app/.next/standalone ./
COPY --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]