FROM node:slim

ENV APP_MODE=prod

ARG APP_PORT
ENV APP_PORT=${APP_PORT}

ARG BASE_DOMAIN
ENV BASE_DOMAIN=${BASE_DOMAIN}

WORKDIR /app/teddy-test
COPY . /app/teddy-test

RUN yarn global add typescript @nestjs/cli ts-node
RUN yarn add -D @types/node
RUN yarn build

CMD ["yarn", "start:prod"]
EXPOSE ${APP_PORT}