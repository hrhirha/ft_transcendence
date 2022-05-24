FROM node:16-alpine3.14

RUN apk update && apk upgrade

WORKDIR /usr/app
COPY . .
RUN cd /usr/app/backend && npm i
# RUN cd /usr/app/frontend && npm i

CMD cd /usr/app/backend && npm run start
# CMD while [ 1 ]; do echo; done
