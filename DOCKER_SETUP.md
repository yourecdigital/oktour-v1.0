# 🐳 Docker Development Setup

## Quick Start

```bash
# 1. Generate environment file
npm run setup:dev

# 2. Start all services
npm run docker:dev

# 3. View logs
npm run docker:logs

# 4. Stop services
npm run docker:down
```

## Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Web** | 3000 | http://localhost:3000 | React frontend |
| **API** | 5000 | http://localhost:5000 | Express backend |
| **Admin** | 3001 | http://localhost:3001 | Admin dashboard |
| **MariaDB** | 3306 | localhost:3306 | Database |
| **Redis** | 6379 | localhost:6379 | Cache |
| **MinIO** | 9000/9001 | http://localhost:9001 | S3 Storage |
| **Nginx** | 80 | http://localhost | Reverse proxy |

## Features

### 🔥 Hot Reload
- **Web**: Volume mounted for instant React updates
- **API**: Volume mounted for instant Node.js updates
- **Admin**: Volume mounted for instant admin updates

### 🏥 Health Checks
- All services have health check endpoints
- Automatic restart on failure
- Dependency management between services

### 💾 Persistent Data
- **db_data**: MariaDB database
- **redis_data**: Redis cache
- **s3_data**: MinIO object storage

### 🔧 Environment
- Auto-generated `.env` file
- Secure random passwords
- Domain configuration

## Development Commands

```bash
# Start development environment
npm run docker:dev

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f web
docker-compose -f docker-compose.dev.yml logs -f api

# Rebuild specific service
docker-compose -f docker-compose.dev.yml build web
docker-compose -f docker-compose.dev.yml up -d web

# Access service shell
docker-compose -f docker-compose.dev.yml exec api sh
docker-compose -f docker-compose.dev.yml exec web sh

# Clean up everything
docker-compose -f docker-compose.dev.yml down -v
docker system prune -f
```

## Troubleshooting

### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# Kill processes
sudo kill -9 $(lsof -t -i:3000)
sudo kill -9 $(lsof -t -i:5000)
```

### Database Issues
```bash
# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker volume rm tour_db_data
npm run docker:dev
```

### Cache Issues
```bash
# Clear Redis cache
docker-compose -f docker-compose.dev.yml exec redis redis-cli FLUSHALL
```

## Production Deployment

For production deployment, use the production Dockerfiles:

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```
