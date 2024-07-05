## step1
FROM node:18 as build-stage

WORKDIR /app
COPY . .
ENV NITRO_PRESET=node-server

# install pnpm
RUN npm i pnpm -g

# install deps
RUN pnpm i --prefer-offline
RUN pnpm run build

## step2
FROM node:18

ENV TZ=Asia/Ho_Chi_Minh
ENV NODE_ENV production
ENV NITRO_PRESET=node-server
ENV HOST 0.0.0.0

EXPOSE 3000

WORKDIR /app
COPY --from=build-stage /app/.output/public /app/public
COPY --from=build-stage /app/.output/server /app/server
COPY --from=build-stage /app/.output/nitro.json /app/nitro.json

# install pm2
RUN npm i pm2 -g

CMD [ "pm2-runtime", "start", "/app/server/index.mjs" ]
# CMD ["tail","-f","/dev/null"]
