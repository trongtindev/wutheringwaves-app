# build-stage
FROM oven/bun:1.1.25 AS build-stage
ENV CI=1
WORKDIR /app

## copy source
COPY . .

### install and build
RUN bun i --frozen-lockfile
ENV NITRO_PRESET=bun
RUN bun run build

# run-stage
FROM oven/bun:1.1.25
ENV CI=1
WORKDIR /app
EXPOSE 3000

## copy .output
COPY --from=build-stage /app/.output /app/.output

## run
CMD [ "bun", "/app/.output/server/index.mjs" ]
# CMD ["tail","-f","/dev/null"]