# syntax=docker/dockerfile:1
FROM node:19-buster AS build
WORKDIR /app

COPY package* yarn.lock ./
RUN yarn install --network-timeout 600000
COPY tsconfig* nest-cli.json ./
COPY prisma ./prisma
COPY src ./src
RUN yarn prisma generate
RUN yarn build

FROM node:19-buster
COPY package* ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
RUN yarn prisma generate
COPY --from=build /app/dist ./dist
