FROM node:16-alpine3.14

RUN apk update && apk upgrade

WORKDIR /usr/app
COPY srcs/ .
RUN cd /usr/app/backend && npm i
RUN cd /usr/app/frontend && npm i

# CMD cd /usr/app/backend && npm start cd /usr/app/frontend && npm start
