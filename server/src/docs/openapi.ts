import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';
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
} from './schemas.js';
import { CommandSchemas } from './commands.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const openapiOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Cockpit Tools API',
      version: '0.22.20',
      description:
        'Backend API for Cockpit Tools - a multi-platform AI coding assistant account manager. ' +
        'Supports account management, instance control, fingerprint management, and backup operations ' +
        'across multiple AI coding platforms including Antigravity, Codex, Windsurf, Cursor, Kiro, and more.',
      license: {
        name: 'CC BY-NC-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      },
      contact: {
        name: 'Cockpit Tools',
        url: 'https://github.com/jlcodes99/cockpit-tools',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Local development server',
      },
      {
        url: 'http://127.0.0.1:3001/api',
        description: 'Local development server (127.0.0.1)',
      },
    ],
    tags: [
      { name: 'Invoke', description: 'Command invocation endpoints' },
      { name: 'Events', description: 'Server-sent events for real-time updates' },
      { name: 'FileSystem', description: 'File system operations' },
      { name: 'Account Management', description: 'Account CRUD operations across platforms' },
      { name: 'OAuth', description: 'OAuth authentication flows' },
      { name: 'Instance Management', description: 'Instance lifecycle operations' },
      { name: 'Group Management', description: 'Group organization operations' },
      { name: 'Fingerprint Management', description: 'Browser fingerprint operations' },
      { name: 'Backup', description: 'Backup and restore operations' },
      { name: 'Config', description: 'Configuration management' },
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
        ...CommandSchemas,
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, './schemas.ts'),
    path.join(__dirname, './commands.ts'),
  ],
};

export function createOpenApiSpec(): ReturnType<typeof swaggerJSDoc> {
  return swaggerJSDoc(openapiOptions);
}
