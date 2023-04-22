FROM node:19.8-alpine3.16

EXPOSE 80

RUN npm i -g pnpm
WORKDIR /cyclershub
COPY ./package.json ./
RUN pnpm install --prod
COPY . .


CMD ["pnpm", "run", "build:production"]