import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import type { Express } from 'express';
import {
  PlatformSchema,
  QuotaSchema,
  AccountSchema,
  InstanceSchema,
  InstanceStatusSchema,
  GroupSchema,
  FingerprintSchema,
  ConfigSchema,
  ErrorSchema,
  SuccessResponseSchema,
  InvokeResponseSchema,
  ErrorResponseSchema,
} from '../docs/schemas.js';

// OpenAPI configuration options
const openApiOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cockpit Tools API',
      version: '0.22.20',
      description: 'API documentation for Cockpit Tools - A universal AI IDE account management tool',
      contact: {
        name: 'Cockpit Tools',
        url: 'https://github.com/jlcodes99/cockpit-tools',
      },
      license: {
        name: 'CC BY-NC-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'System', description: 'System health and version endpoints' },
      { name: 'Commands', description: 'Command invocation endpoint for all operations' },
      { name: 'Events', description: 'Server-Sent Events for real-time updates' },
      { name: 'FileSystem', description: 'File system operations' },
    ],
    components: {
      schemas: {
        Platform: PlatformSchema,
        Quota: QuotaSchema,
        Account: AccountSchema,
        Instance: InstanceSchema,
        InstanceStatus: InstanceStatusSchema,
        Group: GroupSchema,
        Fingerprint: FingerprintSchema,
        Config: ConfigSchema,
        Error: ErrorSchema,
        SuccessResponse: SuccessResponseSchema,
        InvokeResponse: InvokeResponseSchema,
        ErrorResponse: ErrorResponseSchema,
      },
    },
  },
  // Path to files with OpenAPI annotations
  apis: [
    './src/index.ts',
    './src/routes/*.ts',
  ],
};

/**
 * Set up Swagger UI on the Express app
 * @param app - Express application instance
 */
export function setupSwaggerUI(app: Express): void {
  const specs = swaggerJsdoc(openApiOptions);
  
  // JSON spec endpoint
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  // Swagger UI endpoint
  app.use(
    '/api/docs',
    serve,
    setup(specs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Cockpit Tools API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        docExpansion: 'list',
      },
    })
  );
  
  console.log('📚 API Documentation available at /api/docs');
}

export default setupSwaggerUI;
