FROM node:18-alpine 

WORKDIR /app

COPY ./app/package.production.json ./package.json
COPY ./app/.next ./.next

RUN yarn install --production

EXPOSE 3000

CMD yarn next start
