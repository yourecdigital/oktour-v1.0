# Tour DevOps Telegram Bot

A comprehensive Telegram bot for managing the Tour platform's DevOps operations, including deployment, backup, monitoring, and alerting.

## Features

### 🚀 Deployment Management
- **Manual Deployment**: Trigger GitHub Actions workflows
- **Deployment Status**: Check current deployment status
- **Real-time Updates**: Get notified about deployment progress

### 💾 Backup Operations
- **On-demand Backup**: Start backup process immediately
- **Backup Status**: Check backup completion status
- **Backup History**: List recent backups with details

### 📊 System Monitoring
- **Real-time Status**: Get system health overview
- **Grafana Snapshots**: Generate dashboard snapshots
- **Dashboard Access**: View specific monitoring dashboards

### 🔔 Notifications
- **GitHub Webhooks**: Receive deployment and CI/CD notifications
- **System Alerts**: Get notified about system issues
- **Custom Alerts**: Configure custom alert rules

## Commands

### Deployment Commands
```
/deploy          - Trigger manual deployment
/deploy-status   - Check deployment status
```

### Backup Commands
```
/backup          - Start on-demand backup
/backup-status   - Check backup status
/backup-list     - List recent backups
```

### Monitoring Commands
```
/status          - Get system status and snapshot
/dashboard <id>  - Get specific dashboard snapshot
/dashboards      - List available dashboards
```

### Utility Commands
```
/help            - Show help message
/ping            - Check bot connectivity
```

## Setup

### 1. Environment Variables

Create a `.env` file with the following variables:

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# GitHub
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=oktour-v1.0
GITHUB_OWNER=yourecdigital

# Services
GRAFANA_URL=http://localhost:3000
GRAFANA_USERNAME=admin
GRAFANA_PASSWORD=admin123

# Webhook
WEBHOOK_SECRET=your_webhook_secret_here_min_32_chars
```

### 2. Telegram Bot Setup

1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add the bot to your chat/group
4. Get the chat ID using [@userinfobot](https://t.me/userinfobot)

### 3. GitHub Integration

1. Create a GitHub Personal Access Token with the following permissions:
   - `repo` (for private repositories)
   - `workflow` (to trigger GitHub Actions)
   - `read:org` (if using organization repositories)

2. Set up webhook in your GitHub repository:
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/webhook/github`
   - Select events: `workflow_run`, `check_run`, `deployment`, `deployment_status`
   - Set webhook secret

### 4. Running the Bot

#### Development
```bash
cd packages/bot
npm install
npm run dev
```

#### Production with Docker
```bash
docker-compose -f docker-compose.observability.yml up -d bot
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram      │    │   Bot Service   │    │   GitHub API    │
│   Users         │───▶│                 │───▶│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Webhook       │
                       │   Server        │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Services      │
                       │                 │
                       │ • Grafana       │
                       │ • Prometheus    │
                       │ • Backup        │
                       └─────────────────┘
```

## Services Integration

### GitHub Actions
- Triggers CI/CD workflows
- Monitors deployment status
- Sends notifications on completion/failure

### Grafana
- Generates dashboard snapshots
- Provides system status
- Monitors application metrics

### Prometheus
- Collects system metrics
- Provides alerting data
- Monitors service health

### Backup System
- Triggers backup workflows
- Monitors backup status
- Provides backup history

## Security

### Authentication
- Only authorized users can use commands
- Webhook signature verification
- Environment variable validation

### Authorization
- Chat ID whitelist
- Command-level permissions
- Audit logging

### Data Protection
- Encrypted environment variables
- Secure webhook handling
- Log sanitization

## Monitoring

### Health Checks
- Bot connectivity: `/ping`
- Service health: `/status`
- Webhook endpoint: `/health`

### Logging
- Structured logging with Winston
- Error tracking and reporting
- Performance monitoring

### Metrics
- Command usage statistics
- Response time tracking
- Error rate monitoring

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check bot token validity
   - Verify chat ID
   - Check network connectivity

2. **GitHub integration fails**
   - Verify GitHub token permissions
   - Check repository access
   - Validate webhook configuration

3. **Grafana snapshots fail**
   - Check Grafana credentials
   - Verify dashboard IDs
   - Check network connectivity

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development npm run dev
```

### Logs

View bot logs:
```bash
docker-compose logs -f bot
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
