import { Context } from 'telegraf';
import { BackupService } from '../services/backup';
import logger from '../logger';

export async function handleBackupCommand(ctx: Context) {
  try {
    await ctx.reply('💾 Starting backup process...');

    const backupService = new BackupService();
    
    const result = await backupService.triggerBackup();
    
    if (result.success) {
      await ctx.reply(`
✅ **Backup Started Successfully**

🔄 **Status**: ${result.message}
⏰ **Time**: ${result.timestamp}

The backup process is running in the background.
You'll be notified when it completes.
      `, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`
❌ **Backup Failed**

🚨 **Error**: ${result.message}
⏰ **Time**: ${new Date().toLocaleString()}

Please try again later or contact the administrator.
      `, { parse_mode: 'Markdown' });
    }
  } catch (error: any) {
    logger.error('Backup command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`
❌ **Backup Error**

🚨 **Error**: ${error.message}
⏰ **Time**: ${new Date().toLocaleString()}

Please try again later or contact the administrator.
    `, { parse_mode: 'Markdown' });
  }
}

export async function handleBackupStatusCommand(ctx: Context) {
  try {
    await ctx.reply('🔍 Checking backup status...');

    const backupService = new BackupService();
    
    const result = await backupService.getBackupStatus();
    
    if (result.success) {
      await ctx.reply(`
📊 **Backup Status**

🔄 **Status**: ${result.status}
📅 **Last Backup**: ${new Date(result.lastBackup).toLocaleString()}
📅 **Next Backup**: ${new Date(result.nextBackup).toLocaleString()}
💾 **Size**: ${result.size}
📍 **Location**: ${result.location}
      `, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`❌ Failed to get backup status: ${result.message}`);
    }
  } catch (error: any) {
    logger.error('Backup status command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`❌ Error checking backup status: ${error.message}`);
  }
}

export async function handleBackupListCommand(ctx: Context) {
  try {
    await ctx.reply('📋 Getting backup list...');

    const backupService = new BackupService();
    
    const result = await backupService.listBackups();
    
    if (result.success) {
      const backups = result.backups;
      let message = '📋 **Recent Backups**\n\n';
      
      backups.forEach((backup: any, index: number) => {
        message += `${index + 1}. **${backup.id}**\n`;
        message += `   📅 ${new Date(backup.date).toLocaleString()}\n`;
        message += `   💾 ${backup.size}\n`;
        message += `   ✅ ${backup.status}\n`;
        message += `   📦 ${backup.type}\n\n`;
      });
      
      await ctx.reply(message, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`❌ Failed to get backup list: ${result.message}`);
    }
  } catch (error: any) {
    logger.error('Backup list command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`❌ Error getting backup list: ${error.message}`);
  }
}
