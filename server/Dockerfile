FROM node:19.7.0 as builder

RUN apt-get update -y && \
    apt-get upgrade -y && \
    yarn cache clean --all

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN yarn && yarn run generate && yarn run build

FROM node:19.6.0

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["yarn", "run", "start:prod"]
