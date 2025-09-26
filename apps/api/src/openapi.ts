import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupOpenAPI(app: Express) {
  const spec = swaggerJsdoc({
    definition: {
      openapi: '3.1.0',
      info: { title: 'Sochi Travel API', version: '1.0.0' },
    },
    apis: [],
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
}




