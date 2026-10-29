FROM node:22.22.3-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22.22.3-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=2000

COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 2000
CMD ["node", ".output/server/index.mjs"]
