FROM node:26.13.1-alpine3.24 AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:26.13.1-alpine3.24
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /home/node/app

COPY --chown=node package.json ./
COPY --chown=node public ./public
COPY --from=build --chown=node /app/node_modules ./node_modules
COPY --from=build --chown=node /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "--enable-source-maps", "."]
