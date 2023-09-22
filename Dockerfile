FROM node:18-alpine 

WORKDIR /app

COPY ./app/.next ./.next
COPY ./app/package.production.json ./package.json

RUN yarn install --production

EXPOSE 3000

CMD yarn next start
