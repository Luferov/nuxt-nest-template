FROM node:19.6.0 as builder

ENV HOST 0.0.0.0

RUN apt-get update -y && \
    apt-get upgrade -y && \
    yarn cache clean --all

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN yarn && \
    yarn run codegen-schema && \
    yarn run build && \
    rm -rf $(ls -A | grep -v .output)


FROM node:19.6.0

COPY --from=builder /usr/src/app/.output ./.output

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
