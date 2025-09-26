# Stage 1: Build the Admin application
FROM node:22-alpine AS builder

WORKDIR /app/apps/admin

COPY package.json pnpm-lock.yaml ./
COPY turbo.json ./
COPY packages /app/packages
COPY apps/admin/package.json ./
COPY apps/admin/tsconfig.json ./
COPY apps/admin/src /app/apps/admin/src
COPY apps/admin/public /app/apps/admin/public
COPY apps/admin/index.html /app/apps/admin/

RUN corepack enable
RUN pnpm install --frozen-lockfile

RUN pnpm --filter admin build

# Stage 2: Serve the Admin application
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# Copy custom nginx config for admin
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]