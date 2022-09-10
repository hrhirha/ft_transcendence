#!/bin/sh

cd /usr/app/backend && npm ci
cd /usr/app/frontend && npm ci

cd /usr/app/backend && npm start&
cd /usr/app/frontend && npm run build && npx serve -s build
