import axios from 'axios';
import { env } from '../env';
import logger from '../logger';

export class GrafanaService {
  private baseURL = env.GRAFANA_URL;
  private auth = {
    username: env.GRAFANA_USERNAME,
    password: env.GRAFANA_PASSWORD
  };

  async getDashboardSnapshot(dashboardId: string) {
    try {
      // Get dashboard data
      const dashboardUrl = `${this.baseURL}/api/dashboards/uid/${dashboardId}`;
      const dashboardResponse = await axios.get(dashboardUrl, { auth: this.auth });
      
      if (!dashboardResponse.data.dashboard) {
        throw new Error('Dashboard not found');
      }

      // Create snapshot
      const snapshotUrl = `${this.baseURL}/api/snapshots`;
      const snapshotData = {
        dashboard: dashboardResponse.data.dashboard,
        name: `Telegram Bot Snapshot - ${new Date().toISOString()}`,
        expires: 3600 // 1 hour
      };

      const snapshotResponse = await axios.post(snapshotUrl, snapshotData, { auth: this.auth });

      return {
        success: true,
        snapshotUrl: `${this.baseURL}/dashboard/snapshot/${snapshotResponse.data.key}`,
        key: snapshotResponse.data.key
      };
    } catch (error: any) {
      logger.error('Failed to create Grafana snapshot', {
        dashboardId,
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }

  async getSystemStatus() {
    try {
      const healthUrl = `${this.baseURL}/api/health`;
      const healthResponse = await axios.get(healthUrl, { auth: this.auth });

      return {
        success: true,
        status: healthResponse.data,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      logger.error('Failed to get Grafana health status', {
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }

  async getDashboardList() {
    try {
      const dashboardsUrl = `${this.baseURL}/api/search?type=dash-db`;
      const response = await axios.get(dashboardsUrl, { auth: this.auth });

      return {
        success: true,
        dashboards: response.data
      };
    } catch (error: any) {
      logger.error('Failed to get dashboard list', {
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }

  async getPanelImage(dashboardId: string, panelId: string) {
    try {
      const imageUrl = `${this.baseURL}/render/d-solo/${dashboardId}?panelId=${panelId}&width=1000&height=500&theme=dark`;
      
      const response = await axios.get(imageUrl, {
        auth: this.auth,
        responseType: 'arraybuffer'
      });

      return {
        success: true,
        image: Buffer.from(response.data).toString('base64'),
        contentType: response.headers['content-type']
      };
    } catch (error: any) {
      logger.error('Failed to get panel image', {
        dashboardId,
        panelId,
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }
}
