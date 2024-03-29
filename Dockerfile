FROM node:latest

EXPOSE 80
EXPOSE 443

RUN npm i -g pnpm
WORKDIR /cyclershub
COPY ./package.json /cyclershub/
COPY . /cyclershub/


CMD ["pnpm", "run", "build:production"]