import { Context } from 'telegraf';
import { GitHubService } from '../services/github';
import logger from '../logger';

export async function handleDeployCommand(ctx: Context) {
  try {
    await ctx.reply('🚀 Starting deployment process...');

    const githubService = new GitHubService();
    
    // Trigger CI/CD workflow
    const result = await githubService.triggerWorkflow('cd.yml', 'main');
    
    if (result.success) {
      await ctx.reply(`
✅ **Deployment Started Successfully**

🔄 **Status**: Workflow triggered
📋 **Workflow**: CI/CD Pipeline
🌿 **Branch**: main
⏰ **Time**: ${new Date().toLocaleString()}

You can monitor the progress in GitHub Actions.
      `, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`
❌ **Deployment Failed**

🚨 **Error**: ${result.message}
📋 **Status**: ${result.status}

Please check the GitHub repository for more details.
      `, { parse_mode: 'Markdown' });
    }
  } catch (error: any) {
    logger.error('Deploy command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`
❌ **Deployment Error**

🚨 **Error**: ${error.message}
⏰ **Time**: ${new Date().toLocaleString()}

Please try again later or contact the administrator.
    `, { parse_mode: 'Markdown' });
  }
}

export async function handleDeployStatusCommand(ctx: Context) {
  try {
    await ctx.reply('🔍 Checking deployment status...');

    const githubService = new GitHubService();
    
    // Get recent workflow runs
    const result = await githubService.listWorkflows();
    
    if (result.success) {
      const workflows = result.workflows;
      const cdWorkflow = workflows.find((w: any) => w.name === 'CD - Continuous Deployment');
      
      if (cdWorkflow) {
        await ctx.reply(`
📊 **Deployment Status**

🔄 **Workflow**: ${cdWorkflow.name}
📋 **State**: ${cdWorkflow.state}
⏰ **Updated**: ${new Date(cdWorkflow.updated_at).toLocaleString()}

🔗 **View Details**: [GitHub Actions](${cdWorkflow.html_url})
        `, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('❌ CD workflow not found');
      }
    } else {
      await ctx.reply(`❌ Failed to get deployment status: ${result.message}`);
    }
  } catch (error: any) {
    logger.error('Deploy status command failed', {
      error: error.message,
      userId: ctx.from?.id
    });

    await ctx.reply(`❌ Error checking deployment status: ${error.message}`);
  }
}
