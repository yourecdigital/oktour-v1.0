# filepath: /README-DEPLOY.md
# SochiTur Production Deployment Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd oktour-v1.0
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   nano .env  # Edit with your values
   ```

3. **Deploy to production**
   ```bash
   ./deploy.sh
   ```

## Environment Variables

Copy `env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `DOMAIN` | Your domain name (e.g., yoursite.com) | ✅ |
| `SSL_EMAIL` | Email for Let's Encrypt SSL | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (optional) | ❌ |
| `TELEGRAM_CHAT_ID` | Telegram chat ID (optional) | ❌ |
| `AWS_ACCESS_KEY_ID` | AWS access key (optional) | ❌ |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key (optional) | ❌ |
| `AWS_REGION` | AWS region (optional) | ❌ |
| `AWS_S3_BUCKET` | AWS S3 bucket (optional) | ❌ |

## Manual Deployment

If you prefer manual deployment:

```bash
# Stop existing containers
docker-compose -f docker-compose.prod.yml down

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Obtain SSL certificate (first time only)
docker-compose -f docker-compose.prod.yml run --rm certbot

# Restart nginx with SSL
docker-compose -f docker-compose.prod.yml restart nginx
```

## Services

- **Frontend**: React app served by Nginx on port 80/443
- **Backend**: Node.js API on port 5000 (internal)
- **Database**: SQLite stored in Docker volume `sqlite_data`
- **SSL**: Let's Encrypt certificates with auto-renewal
- **Reverse Proxy**: Nginx with rate limiting and security headers

## Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Update and redeploy
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Backup database
docker cp sochitur-backend-prod:/app/server/database.sqlite ./backup.sqlite

# Stop all services
docker-compose -f docker-compose.prod.yml down
```

## Health Checks

- Backend: `http://yourdomain.com/api/health`
- Nginx: `http://yourdomain.com/health`

## SSL Certificate Renewal

Certificates are automatically renewed every 12 hours via the `certbot-renewal` container.

## Troubleshooting

1. **SSL certificate issues**: Check domain DNS settings
2. **Database issues**: Check volume mounts and permissions
3. **Upload issues**: Check upload directory permissions
4. **Performance**: Monitor with `docker stats`

## Security Notes

- Change default JWT secret in production
- Use strong passwords for admin accounts
- Regularly update Docker images
- Monitor logs for suspicious activity
- Enable firewall rules for your server

## Support

For issues, check the logs first:
```bash
docker-compose -f docker-compose.prod.yml logs
```
