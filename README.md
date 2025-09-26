# 🚀 Tour Monorepo 2025

[![Node.js](https://img.shields.io/badge/Node.js-18.17.0-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.15.0-orange.svg)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/Turbo-1.13.0-blue.svg)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Modern travel booking platform built with cutting-edge monorepo architecture.

## 🏗️ Architecture

```
tour-monorepo-2025/
├── apps/
│   ├── web/old-src/      # React frontend (legacy)
│   ├── api/old-src/      # Express.js backend (legacy)
│   └── admin/            # Admin dashboard
├── packages/
│   └── shared/           # Shared utilities & types
├── infra/
│   └── docker/           # Docker configurations
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # pnpm workspace config
├── turbo.json           # Turbo build system
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0+
- pnpm 8.0.0+

### Installation
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Run tests
pnpm test
```

## 📦 Workspaces

- **apps/web** - React frontend application
- **apps/api** - Express.js backend API
- **apps/admin** - Admin dashboard
- **packages/shared** - Shared utilities and types

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Styled Components
- **Backend**: Node.js, Express.js, SQLite
- **Monorepo**: pnpm workspaces + Turbo
- **Infrastructure**: Docker, Nginx

## 📝 Legacy Code Migration

Legacy code has been preserved in:
- `apps/web/old-src/` - Original React application
- `apps/api/old-src/` - Original Express.js server

## 🔧 Development

```bash
# Install pnpm globally
npm install -g pnpm@8.15.0

# Install dependencies
pnpm install

# Start all services
pnpm dev

# Build for production
pnpm build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.