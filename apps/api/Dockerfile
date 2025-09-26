# syntax=docker/dockerfile:1.7-labs

FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.npm npm ci && npm run prisma:generate && npm run -w apps/api build || true

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
USER nonroot
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api ./apps/api
COPY package.json ./package.json
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:4000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
CMD ["apps/api/src/index.js"]




