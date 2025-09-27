import express from 'express';
import { env } from './env';
import logger from './logger';
import { sendNotification } from './notifications';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GitHub webhook handler
app.post('/webhook/github', async (req, res) => {
  try {
    const { body, headers } = req;
    
    // Verify webhook signature (in production)
    const signature = headers['x-hub-signature-256'];
    if (signature && !verifySignature(body, signature)) {
      logger.warn('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = headers['x-github-event'];
    const action = body.action;

    logger.info('GitHub webhook received', {
      event,
      action,
      repository: body.repository?.full_name
    });

    // Handle different webhook events
    switch (event) {
      case 'workflow_run':
        await handleWorkflowRun(body);
        break;
      case 'check_run':
        await handleCheckRun(body);
        break;
      case 'deployment':
        await handleDeployment(body);
        break;
      case 'deployment_status':
        await handleDeploymentStatus(body);
        break;
      default:
        logger.info('Unhandled webhook event', { event });
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error('Webhook processing failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle workflow run events
async function handleWorkflowRun(payload: any) {
  const { workflow_run } = payload;
  const { name, status, conclusion, html_url } = workflow_run;

  if (status === 'completed') {
    const emoji = conclusion === 'success' ? '✅' : '❌';
    const message = `
${emoji} **Workflow ${conclusion === 'success' ? 'Completed' : 'Failed'}**

📋 **Workflow**: ${name}
🔄 **Status**: ${conclusion}
🔗 **Details**: [View Run](${html_url})
⏰ **Time**: ${new Date().toLocaleString()}
    `;

    await sendNotification(message);
  }
}

// Handle check run events
async function handleCheckRun(payload: any) {
  const { check_run } = payload;
  const { name, status, conclusion, html_url } = check_run;

  if (status === 'completed' && conclusion !== 'success') {
    const message = `
❌ **Check Run Failed**

📋 **Check**: ${name}
🔄 **Status**: ${conclusion}
🔗 **Details**: [View Run](${html_url})
⏰ **Time**: ${new Date().toLocaleString()}
    `;

    await sendNotification(message);
  }
}

// Handle deployment events
async function handleDeployment(payload: any) {
  const { deployment } = payload;
  const { ref, environment, description } = deployment;

  const message = `
🚀 **Deployment Started**

🌿 **Branch**: ${ref}
🌍 **Environment**: ${environment}
📝 **Description**: ${description || 'No description'}
⏰ **Time**: ${new Date().toLocaleString()}
  `;

  await sendNotification(message);
}

// Handle deployment status events
async function handleDeploymentStatus(payload: any) {
  const { deployment_status } = payload;
  const { state, description, target_url } = deployment_status;

  const emoji = state === 'success' ? '✅' : '❌';
  const message = `
${emoji} **Deployment ${state === 'success' ? 'Succeeded' : 'Failed'}**

🔄 **Status**: ${state}
📝 **Description**: ${description || 'No description'}
🔗 **Details**: [View Status](${target_url})
⏰ **Time**: ${new Date().toLocaleString()}
  `;

  await sendNotification(message);
}

// Verify webhook signature
function verifySignature(payload: any, signature: string): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', env.WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  const providedSignature = signature.replace('sha256=', '');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(providedSignature, 'hex')
  );
}

export { app as webhookApp };
