import { Context } from 'telegraf';

export async function handleHelpCommand(ctx: Context) {
  const helpMessage = `
🤖 **Tour DevOps Bot Commands**

**🚀 Deployment**
\`/deploy\` - Trigger manual deployment
\`/deploy-status\` - Check deployment status

**💾 Backup**
\`/backup\` - Start on-demand backup
\`/backup-status\` - Check backup status
\`/backup-list\` - List recent backups

**📊 Monitoring**
\`/status\` - Get system status and snapshot
\`/dashboard <id>\` - Get specific dashboard snapshot
\`/dashboards\` - List available dashboards

**ℹ️ Information**
\`/help\` - Show this help message
\`/ping\` - Check bot connectivity

**🔧 Examples**
\`/deploy\` - Deploy to production
\`/backup\` - Create backup now
\`/status\` - System overview
\`/dashboard node\` - Node.js metrics
\`/dashboard react\` - React app metrics
\`/dashboard nginx\` - Nginx metrics

**📱 Notifications**
The bot will automatically notify you about:
• Deployment failures
• Backup completions
• System alerts
• Critical errors

**🛡️ Security**
Only authorized users can use these commands.
All actions are logged for audit purposes.
  `;

  await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
}

export async function handlePingCommand(ctx: Context) {
  const startTime = Date.now();
  
  await ctx.reply('🏓 Pong!');
  
  const responseTime = Date.now() - startTime;
  
  await ctx.reply(`
📊 **Bot Status**

🟢 **Status**: Online
⏱️ **Response Time**: ${responseTime}ms
⏰ **Uptime**: ${process.uptime().toFixed(0)}s
🔄 **Version**: 1.0.0
  `, { parse_mode: 'Markdown' });
}
