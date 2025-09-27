import { Telegraf } from 'telegraf';
import { env } from './env';
import logger from './logger';

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

export async function sendNotification(message: string) {
  try {
    await bot.telegram.sendMessage(env.TELEGRAM_CHAT_ID, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    logger.info('Notification sent successfully', {
      chatId: env.TELEGRAM_CHAT_ID,
      messageLength: message.length
    });
  } catch (error: any) {
    logger.error('Failed to send notification', {
      error: error.message,
      chatId: env.TELEGRAM_CHAT_ID
    });
  }
}

export async function sendAlert(alert: {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp?: string;
  source?: string;
}) {
  const emoji = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    critical: '🚨'
  }[alert.severity];

  const message = `
${emoji} **${alert.title}**

${alert.message}

${alert.source ? `📍 **Source**: ${alert.source}` : ''}
⏰ **Time**: ${alert.timestamp || new Date().toLocaleString()}
  `;

  await sendNotification(message);
}

export async function sendSystemAlert(alert: {
  service: string;
  status: 'up' | 'down' | 'degraded';
  message: string;
  metrics?: any;
}) {
  const emoji = {
    up: '🟢',
    down: '🔴',
    degraded: '🟡'
  }[alert.status];

  const statusText = {
    up: 'Online',
    down: 'Offline',
    degraded: 'Degraded'
  }[alert.status];

  let message = `
${emoji} **${alert.service} ${statusText}**

${alert.message}
  `;

  if (alert.metrics) {
    message += '\n📊 **Metrics**:\n';
    Object.entries(alert.metrics).forEach(([key, value]) => {
      message += `• ${key}: ${value}\n`;
    });
  }

  message += `\n⏰ **Time**: ${new Date().toLocaleString()}`;

  await sendNotification(message);
}

export async function sendDeploymentNotification(deployment: {
  environment: string;
  status: 'started' | 'success' | 'failed';
  branch: string;
  commit?: string;
  author?: string;
  duration?: number;
  url?: string;
}) {
  const emoji = {
    started: '🚀',
    success: '✅',
    failed: '❌'
  }[deployment.status];

  const statusText = {
    started: 'Started',
    success: 'Completed',
    failed: 'Failed'
  }[deployment.status];

  let message = `
${emoji} **Deployment ${statusText}**

🌍 **Environment**: ${deployment.environment}
🌿 **Branch**: ${deployment.branch}
  `;

  if (deployment.commit) {
    message += `📝 **Commit**: \`${deployment.commit.substring(0, 7)}\`\n`;
  }

  if (deployment.author) {
    message += `👤 **Author**: ${deployment.author}\n`;
  }

  if (deployment.duration) {
    message += `⏱️ **Duration**: ${deployment.duration}s\n`;
  }

  if (deployment.url) {
    message += `🔗 **Details**: [View Deployment](${deployment.url})\n`;
  }

  message += `⏰ **Time**: ${new Date().toLocaleString()}`;

  await sendNotification(message);
}

export async function sendBackupNotification(backup: {
  status: 'started' | 'completed' | 'failed';
  type: 'full' | 'incremental';
  size?: string;
  duration?: number;
  location?: string;
  error?: string;
}) {
  const emoji = {
    started: '💾',
    completed: '✅',
    failed: '❌'
  }[backup.status];

  const statusText = {
    started: 'Started',
    completed: 'Completed',
    failed: 'Failed'
  }[backup.status];

  let message = `
${emoji} **Backup ${statusText}**

📦 **Type**: ${backup.type}
  `;

  if (backup.size) {
    message += `💾 **Size**: ${backup.size}\n`;
  }

  if (backup.duration) {
    message += `⏱️ **Duration**: ${backup.duration}s\n`;
  }

  if (backup.location) {
    message += `📍 **Location**: ${backup.location}\n`;
  }

  if (backup.error) {
    message += `🚨 **Error**: ${backup.error}\n`;
  }

  message += `⏰ **Time**: ${new Date().toLocaleString()}`;

  await sendNotification(message);
}
