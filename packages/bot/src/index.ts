import { Telegraf, Context } from 'telegraf';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './env';
import logger from './logger';
import { webhookApp } from './webhook';

// Import commands
import { handleDeployCommand, handleDeployStatusCommand } from './commands/deploy';
import { handleBackupCommand, handleBackupStatusCommand, handleBackupListCommand } from './commands/backup';
import { handleStatusCommand, handleDashboardCommand, handleDashboardsListCommand } from './commands/status';
import { handleHelpCommand, handlePingCommand } from './commands/help';

// Initialize bot
const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

// Middleware for logging
bot.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const responseTime = Date.now() - start;
  
  logger.info('Command executed', {
    userId: ctx.from?.id,
    username: ctx.from?.username,
    command: ctx.message && 'text' in ctx.message ? ctx.message.text : 'unknown',
    responseTime
  });
});

// Command handlers
bot.command('deploy', handleDeployCommand);
bot.command('deploy-status', handleDeployStatusCommand);
bot.command('backup', handleBackupCommand);
bot.command('backup-status', handleBackupStatusCommand);
bot.command('backup-list', handleBackupListCommand);
bot.command('status', handleStatusCommand);
bot.command('dashboards', handleDashboardsListCommand);
bot.command('help', handleHelpCommand);
bot.command('ping', handlePingCommand);

// Dashboard command with parameter
bot.command('dashboard', async (ctx) => {
  const args = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ') : [];
  const dashboardId = args[1];
  
  if (!dashboardId) {
    await ctx.reply('❌ Please specify a dashboard ID. Use `/dashboards` to see available dashboards.');
    return;
  }
  
  await handleDashboardCommand(ctx, dashboardId);
});

// Error handling
bot.catch((err, ctx) => {
  logger.error('Bot error', {
    error: err.message,
    userId: ctx.from?.id,
    username: ctx.from?.username
  });
  
  ctx.reply('❌ An error occurred. Please try again later.');
});

// Start bot
async function startBot() {
  try {
    await bot.launch();
    logger.info('Telegram bot started successfully', {
      botInfo: await bot.telegram.getMe()
    });
  } catch (error: any) {
    logger.error('Failed to start bot', {
      error: error.message
    });
    process.exit(1);
  }
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Start webhook server
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN
}));

// Mount webhook routes
app.use('/webhook', webhookApp);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Start server
const server = app.listen(env.PORT, () => {
  logger.info('Webhook server started', {
    port: env.PORT,
    environment: env.NODE_ENV
  });
});

// Start bot and server
async function main() {
  await startBot();
  
  logger.info('Tour DevOps Bot started successfully', {
    port: env.PORT,
    environment: env.NODE_ENV,
    chatId: env.TELEGRAM_CHAT_ID
  });
}

main().catch((error) => {
  logger.error('Failed to start application', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

export { bot };
