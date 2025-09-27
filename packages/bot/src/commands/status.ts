import { Context } from 'telegraf';
import { GrafanaService } from '../services/grafana';
import logger from '../logger';

export async function handleStatusCommand(ctx: Context) {
  try {
    await ctx.reply('📊 Getting system status...');

    const grafanaService = new GrafanaService();
    
    // Get system status
    const statusResult = await grafanaService.getSystemStatus();
    
    if (statusResult.success) {
      await ctx.reply(`
📊 **System Status**

🟢 **Grafana**: Online
⏰ **Timestamp**: ${statusResult.timestamp}
📈 **Status**: ${statusResult.status.database || 'OK'}

Generating dashboard snapshot...
      `, { parse_mode: 'Markdown' });
      
      // Get dashboard snapshot
      const snapshotResult = await grafanaService.getDashboardSnapshot('system');
      
      if (snapshotResult.success) {
        await ctx.reply(`
📸 **Dashboard Snapshot**

🔗 **Link**: [View Snapshot](${snapshotResult.snapshotUrl})
⏰ **Expires**: 1 hour
        `, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply(`⚠️ Could not create snapshot: ${snapshotResult.message}`);
      }
    } else {
      await ctx.reply(`❌ Failed to get system status: ${statusResult.message}`);
    }
  } catch (error: any) {
    logger.error('Status command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`❌ Error getting system status: ${error.message}`);
  }
}

export async function handleDashboardCommand(ctx: Context, dashboardId: string) {
  try {
    await ctx.reply(`📊 Getting dashboard: ${dashboardId}...`);

    const grafanaService = new GrafanaService();
    
    const result = await grafanaService.getDashboardSnapshot(dashboardId);
    
    if (result.success) {
      await ctx.reply(`
📸 **Dashboard Snapshot**

🔗 **Link**: [View ${dashboardId} Dashboard](${result.snapshotUrl})
⏰ **Expires**: 1 hour
📊 **Dashboard**: ${dashboardId}
      `, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`❌ Failed to create dashboard snapshot: ${result.message}`);
    }
  } catch (error: any) {
    logger.error('Dashboard command failed', {
      error: error.message,
      userId: ctx.from?.id,
      dashboardId
    });

    await ctx.reply(`❌ Error getting dashboard: ${error.message}`);
  }
}

export async function handleDashboardsListCommand(ctx: Context) {
  try {
    await ctx.reply('📋 Getting available dashboards...');

    const grafanaService = new GrafanaService();
    
    const result = await grafanaService.getDashboardList();
    
    if (result.success) {
      const dashboards = result.dashboards;
      let message = '📋 **Available Dashboards**\n\n';
      
      dashboards.forEach((dashboard: any, index: number) => {
        message += `${index + 1}. **${dashboard.title}**\n`;
        message += `   🆔 ID: \`${dashboard.uid}\`\n`;
        message += `   📁 Folder: ${dashboard.folderTitle || 'General'}\n\n`;
      });
      
      message += '💡 Use `/dashboard <id>` to get a snapshot of a specific dashboard.';
      
      await ctx.reply(message, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`❌ Failed to get dashboard list: ${result.message}`);
    }
  } catch (error: any) {
    logger.error('Dashboards list command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`❌ Error getting dashboard list: ${error.message}`);
  }
}
