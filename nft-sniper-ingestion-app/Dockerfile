# syntax=docker/dockerfile:1
FROM node:19-buster AS build
WORKDIR /app

COPY package* yarn.lock .yarnclean ./
COPY node_modules ./node_modules
RUN yarn install --network-timeout 600000
RUN yarn autoclean --force
COPY tsconfig* nest-cli.json ./
COPY prisma ./prisma
COPY src ./src
RUN yarn prisma generate
RUN yarn build

FROM node:19-alpine
COPY prisma ./prisma
RUN yarn prisma generate
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist