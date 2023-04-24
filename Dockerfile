FROM node:19.8-alpine3.16

EXPOSE 80
EXPOSE 443

RUN npm i -g pnpm
WORKDIR /cyclershub
COPY ./package.json ./
COPY . .


CMD ["pnpm", "run", "build:production"]