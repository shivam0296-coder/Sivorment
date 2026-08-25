FROM node:24-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.tests.json ./
COPY server ./server
COPY lib ./lib
COPY data ./data
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm api:build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY package.json ./
USER node
EXPOSE 4000
CMD ["node", "server/dist/server/src/index.js"]
