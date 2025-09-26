#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function generateEnv() {
  console.log('🚀 Tour Monorepo Environment Generator\n');
  
  // Get domain from user
  const domain = await question('Enter your domain (e.g., localhost, yourdomain.com): ');
  
  if (!domain.trim()) {
    console.log('❌ Domain is required!');
    process.exit(1);
  }

  // Generate random secrets
  const generateSecret = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const envContent = `# Tour Monorepo Environment Configuration
# Generated on ${new Date().toISOString()}

# Domain Configuration
DOMAIN=${domain.trim()}

# Database Configuration
DB_ROOT_PASSWORD=${generateSecret()}
DB_NAME=tour_db
DB_USER=tour_user
DB_PASSWORD=${generateSecret()}

# JWT Configuration
JWT_SECRET=${generateSecret()}

# MinIO S3 Configuration
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=${generateSecret()}

# Redis Configuration (optional overrides)
REDIS_URL=redis://redis:6379

# API Configuration
API_URL=http://${domain.trim()}:5000
WEB_URL=http://${domain.trim()}:3000
ADMIN_URL=http://${domain.trim()}:3001

# Development Configuration
NODE_ENV=development
VITE_API_URL=http://${domain.trim()}:5000
VITE_DOMAIN=${domain.trim()}

# Docker Configuration
COMPOSE_PROJECT_NAME=tour-monorepo
`;

  // Write .env file
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment file generated successfully!');
  console.log(`📁 Location: ${envPath}`);
  console.log('\n🔧 Next steps:');
  console.log('1. Review the .env file');
  console.log('2. Run: docker-compose -f docker-compose.dev.yml up -d');
  console.log('3. Access your services:');
  console.log(`   - Web: http://${domain.trim()}:3000`);
  console.log(`   - API: http://${domain.trim()}:5000`);
  console.log(`   - Admin: http://${domain.trim()}:3001`);
  console.log(`   - MinIO: http://${domain.trim()}:9001`);
  
  rl.close();
}

generateEnv().catch(console.error);
