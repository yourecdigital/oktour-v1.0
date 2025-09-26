import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'connected', // TODO: Add actual DB health check
      redis: 'connected',    // TODO: Add actual Redis health check
      minio: 'connected'      // TODO: Add actual MinIO health check
    }
  };

  res.status(200).json(health);
};
