# syntax=docker/dockerfile:1.7-labs

FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.npm npm ci && npm run build

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl brotli
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1




