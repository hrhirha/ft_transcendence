FROM node:16-alpine3.14

RUN apk update && apk upgrade

WORKDIR /usr/app
COPY . .
RUN cd backend && npm i

# ENTRYPOINT cd backend && npx prisma migrate deploy && npm run start
