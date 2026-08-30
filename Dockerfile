FROM node:20-slim AS deps
WORKDIR /usr/src/app
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci


FROM node:20-slim AS builder
WORKDIR /usr/src/app
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run lint
RUN npm run build

ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force


FROM node:20-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

USER node

COPY --chown=node:node --from=builder /usr/src/app/.next/standalone ./
COPY --chown=node:node --from=builder /usr/src/app/.next/static ./.next/static
COPY --chown=node:node --from=builder /usr/src/app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]