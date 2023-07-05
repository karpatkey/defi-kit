FROM node:lts-alpine as runner

WORKDIR /application

COPY . .

RUN yarn install

RUN yarn setup

# RUN yarn build

# Expose the necessary port
EXPOSE 3000

# Start the app
CMD yarn dev
