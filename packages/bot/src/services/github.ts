import axios from 'axios';
import { env } from '../env';
import logger from '../logger';

export class GitHubService {
  private baseURL = 'https://api.github.com';
  private headers = {
    'Authorization': `token ${env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Tour-Telegram-Bot'
  };

  async triggerWorkflow(workflowId: string, ref: string = 'main') {
    try {
      const url = `${this.baseURL}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/${workflowId}/dispatches`;
      
      const response = await axios.post(url, {
        ref: ref,
        inputs: {
          triggered_by: 'telegram_bot',
          timestamp: new Date().toISOString()
        }
      }, {
        headers: this.headers
      });

      logger.info(`GitHub workflow ${workflowId} triggered successfully`, {
        workflowId,
        ref,
        status: response.status
      });

      return {
        success: true,
        message: `Workflow ${workflowId} triggered successfully`,
        status: response.status
      };
    } catch (error: any) {
      logger.error('Failed to trigger GitHub workflow', {
        workflowId,
        error: error.message,
        status: error.response?.status
      });

      return {
        success: false,
        message: `Failed to trigger workflow: ${error.message}`,
        status: error.response?.status
      };
    }
  }

  async getWorkflowStatus(workflowRunId: string) {
    try {
      const url = `${this.baseURL}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/runs/${workflowRunId}`;
      
      const response = await axios.get(url, {
        headers: this.headers
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      logger.error('Failed to get workflow status', {
        workflowRunId,
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }

  async listWorkflows() {
    try {
      const url = `${this.baseURL}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows`;
      
      const response = await axios.get(url, {
        headers: this.headers
      });

      return {
        success: true,
        workflows: response.data.workflows
      };
    } catch (error: any) {
      logger.error('Failed to list workflows', {
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }
}
