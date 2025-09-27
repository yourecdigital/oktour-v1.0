#!/bin/bash

# Tour Monorepo Development Setup Script

echo "🚀 Setting up Tour Monorepo Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Generate environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Generating environment file..."
    node scripts/generate-env.js
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p server/uploads
mkdir -p infra/nginx/conf.d
mkdir -p infra/docker/mariadb/init

# Set permissions
chmod +x scripts/generate-env.js

echo "✅ Development environment setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Review the .env file"
echo "2. Start services: docker-compose -f docker-compose.dev.yml up -d"
echo "3. View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "4. Stop services: docker-compose -f docker-compose.dev.yml down"

