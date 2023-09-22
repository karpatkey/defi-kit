FROM node:18-alpine as builder

WORKDIR /app

COPY ./app/package.production.json ./package.json

RUN yarn install --production

FROM node:18-alpine as runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY ./app/.next ./.next

EXPOSE 3000

CMD yarn next start