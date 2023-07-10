FROM node AS ui

COPY ui /app
WORKDIR /app
RUN yarn install
RUN yarn workspace @pccontrol/ui prod


FROM docker.io/library/php:8.1-fpm-buster AS app

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && apt-get install --no-install-recommends --no-install-suggests -y unzip iputils-ping

COPY --from=docker.io/library/composer:latest /usr/bin/composer /usr/bin/composer

COPY web /app
WORKDIR /app
RUN composer install


FROM docker.io/library/nginx AS web

COPY --from=ui /app/packages/ui/dist /var/www
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

