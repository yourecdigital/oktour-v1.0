# filepath: /deploy.sh
#!/bin/bash

# SochiTur Production Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    print_status "Please copy env.example to .env and configure your environment variables:"
    echo "cp env.example .env"
    echo "nano .env"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$DOMAIN" ] || [ -z "$SSL_EMAIL" ] || [ -z "$JWT_SECRET" ]; then
    print_error "Missing required environment variables!"
    print_status "Please ensure DOMAIN, SSL_EMAIL, and JWT_SECRET are set in your .env file"
    exit 1
fi

print_status "Starting SochiTur deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    print_error "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if SSL certificate exists, if not, obtain it
if [ ! -d "./certbot_certs/live/$DOMAIN" ]; then
    print_status "Obtaining SSL certificate for $DOMAIN..."
    
    # Update nginx config for Let's Encrypt challenge
    sed -i "s/example.com/$DOMAIN/g" nginx/conf.d/default.conf
    
    # Restart nginx
    docker-compose -f docker-compose.prod.yml restart nginx
    
    # Obtain certificate
    docker-compose -f docker-compose.prod.yml run --rm certbot
    
    # Restart nginx with SSL
    docker-compose -f docker-compose.prod.yml restart nginx
else
    print_status "SSL certificate already exists for $DOMAIN"
fi

# Check service health
print_status "Checking service health..."

# Check backend health
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    print_status "✓ Backend is healthy"
else
    print_warning "⚠ Backend health check failed"
fi

# Check frontend
if curl -f http://localhost/ > /dev/null 2>&1; then
    print_status "✓ Frontend is accessible"
else
    print_warning "⚠ Frontend is not accessible"
fi

# Show running containers
print_status "Running containers:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
print_status "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

print_status "Deployment completed!"
print_status "Your application should be accessible at:"
echo "  HTTP:  http://$DOMAIN"
echo "  HTTPS: https://$DOMAIN"

print_status "To view logs, run:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"

print_status "To stop the application, run:"
echo "  docker-compose -f docker-compose.prod.yml down"
