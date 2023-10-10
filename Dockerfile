FROM node:alpine3.18 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html
