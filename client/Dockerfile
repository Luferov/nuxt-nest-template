FROM node:19.6.0

ENV HOST 0.0.0.0

RUN apt-get update -y \
    && apt-get upgrade -y && \
    yarn cache clean --all

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN yarn && \
    yarn run codegen-schema && \
    yarn run build && \
    rm -rf $(ls -A | grep -v .output)

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
