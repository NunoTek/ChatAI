FROM node:lts-alpine

RUN apk --update add jq

RUN mkdir -p /app
WORKDIR /app

## WITHOUT RIGHTS
COPY ./dist/app .
COPY ./entrypoint.sh /entrypoint.sh

## DOCKER_BUILDKIT=1 # WITH RIGHTS
# COPY --chown=node:node --chmod=777 ./dist/app .
# COPY --chown=node:node --chmod=+x ./entrypoint.sh /entrypoint.sh
# USER node

## WITH RIGHTS
# COPY --chown=node:node ./dist/app .
# RUN chmod 755 -R /app
# COPY --chown=node:node ./entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh
# USER node

ENV NODE_ENV=production
EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]
