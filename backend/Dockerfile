FROM node:21.6.1-alpine as node-package


WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

FROM node-package AS build

WORKDIR /app

COPY . /app

RUN npm run build

FROM node-package as node-prod

WORKDIR /app

FROM node:16-alpine

WORKDIR /app

COPY --from=node-prod /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

COPY package.json /app

EXPOSE 3000
ENV NODE_ENV production
CMD node dist/server.js
