# FROM node:lts-alpine as runner

# WORKDIR /application

# COPY . .

# RUN yarn install && \
#     yarn setup && \
#     yarn build

# # Expose the necessary port
# EXPOSE 3000

# # Start the app
# CMD yarn start


FROM node:lts-alpine as builder

WORKDIR /application

COPY . .

RUN yarn install && \
    yarn setup && \
    yarn build

FROM node:lts-alpine as runner

WORKDIR /application

COPY --from=builder /application/package.json ./
COPY --from=builder /application/yarn.lock ./
COPY --from=builder /application/node_modules ./node_modules
COPY --from=builder /application/app ./app
COPY --from=builder /application/playground ./playground
COPY --from=builder /application/sdk ./sdk

EXPOSE 3000

CMD yarn start
