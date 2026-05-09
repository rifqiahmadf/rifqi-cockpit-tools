import type { OpenAPIV3_1 } from 'openapi-types';

const PLATFORMS = [
  'antigravity',
  'codex',
  'windsurf',
  'cursor',
  'kiro',
  'gemini_cli',
  'codebuddy',
  'codebuddy_cn',
  'qoder',
  'trae',
  'zed',
  'github_copilot',
  'workbuddy',
] as const;

export const PlatformSchema: OpenAPIV3_1.SchemaObject = {
  type: 'string',
  enum: [...PLATFORMS],
  description: 'Supported AI coding assistant platforms',
  example: 'codex',
};

export const QuotaSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  description: 'Usage quota information for an account',
  required: ['used', 'total'],
  properties: {
    used: {
      type: 'integer',
      minimum: 0,
      description: 'Amount of quota used',
      example: 45,
    },
    total: {
      type: 'integer',
      minimum: 0,
      description: 'Total quota available',
      example: 100,
    },
    resetAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when quota resets',
      example: 1704240000000,
    },
  },
  example: {
    used: 45,
    total: 100,
    resetAt: 1704240000000,
  },
};

export const AccountSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['id', 'platform'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the account',
      example: '550e8400-e29b-41d4-a716-446655440000',
    },
    platform: {
      $ref: '#/components/schemas/Platform',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Account email address',
      example: 'developer@example.com',
    },
    name: {
      type: 'string',
      description: 'Display name for the account',
      example: 'John Developer',
    },
    quota: {
      $ref: '#/components/schemas/Quota',
    },
    isCurrent: {
      type: 'boolean',
      description: 'Whether this is the currently active account for the platform',
      example: false,
    },
    sortOrder: {
      type: 'integer',
      minimum: 0,
      description: 'Display order index',
      example: 0,
    },
    createdAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when account was created',
      example: 1704067200000,
    },
    updatedAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when account was last updated',
      example: 1704153600000,
    },
  },
  example: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    platform: 'codex',
    email: 'developer@example.com',
    name: 'John Developer',
    quota: {
      used: 45,
      total: 100,
      resetAt: 1704240000000,
    },
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
};

export const InstanceStatusSchema: OpenAPIV3_1.SchemaObject = {
  type: 'string',
  enum: ['stopped', 'running', 'starting', 'stopping', 'error'],
  description: 'Current status of an instance',
  example: 'running',
};

export const InstanceSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['id', 'platform', 'name', 'status'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the instance',
      example: '660e8400-e29b-41d4-a716-446655440001',
    },
    platform: {
      $ref: '#/components/schemas/Platform',
    },
    name: {
      type: 'string',
      description: 'Display name for the instance',
      example: 'Development Environment',
    },
    accountId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the associated account',
      example: '550e8400-e29b-41d4-a716-446655440000',
    },
    status: {
      $ref: '#/components/schemas/InstanceStatus',
    },
    createdAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when instance was created',
      example: 1704067200000,
    },
    updatedAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when instance was last updated',
      example: 1704153600000,
    },
  },
  example: {
    id: '660e8400-e29b-41d4-a716-446655440001',
    platform: 'codex',
    name: 'Development Environment',
    accountId: '550e8400-e29b-41d4-a716-446655440000',
    status: 'running',
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
};

export const GroupSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the group',
      example: '770e8400-e29b-41d4-a716-446655440002',
    },
    name: {
      type: 'string',
      description: 'Display name for the group',
      example: 'Production Accounts',
    },
    platform: {
      $ref: '#/components/schemas/Platform',
    },
    sortOrder: {
      type: 'integer',
      minimum: 0,
      description: 'Display order index',
      example: 0,
    },
    createdAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when group was created',
      example: 1704067200000,
    },
  },
  example: {
    id: '770e8400-e29b-41d4-a716-446655440002',
    name: 'Production Accounts',
    platform: 'codex',
    sortOrder: 0,
    createdAt: 1704067200000,
  },
};

export const FingerprintSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the fingerprint',
      example: '880e8400-e29b-41d4-a716-446655440003',
    },
    name: {
      type: 'string',
      description: 'Display name for the fingerprint',
      example: 'Chrome Windows 11',
    },
    userAgent: {
      type: 'string',
      description: 'Browser user agent string',
      example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    viewport: {
      type: 'object',
      properties: {
        width: { type: 'integer', example: 1920 },
        height: { type: 'integer', example: 1080 },
      },
      example: { width: 1920, height: 1080 },
    },
    isCurrent: {
      type: 'boolean',
      description: 'Whether this is the currently active fingerprint',
      example: false,
    },
    createdAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when fingerprint was created',
      example: 1704067200000,
    },
    updatedAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when fingerprint was last updated',
      example: 1704153600000,
    },
  },
  example: {
    id: '880e8400-e29b-41d4-a716-446655440003',
    name: 'Chrome Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    isCurrent: true,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
};

export const ConfigSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['key', 'value'],
  properties: {
    key: {
      type: 'string',
      description: 'Configuration key',
      example: 'general_config',
    },
    value: {
      type: 'string',
      description: 'Configuration value (JSON string)',
      example: '{"theme":"dark","language":"en"}',
    },
    updatedAt: {
      type: 'integer',
      description: 'Unix timestamp in milliseconds when config was last updated',
      example: 1704153600000,
    },
  },
  example: {
    key: 'general_config',
    value: '{"theme":"dark","language":"en"}',
    updatedAt: 1704153600000,
  },
};

export const ErrorSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'string',
      description: 'Error message',
      example: 'Account not found',
    },
    code: {
      type: 'string',
      description: 'Error code',
      example: 'ACCOUNT_NOT_FOUND',
    },
    details: {
      type: 'object',
      description: 'Additional error details',
      additionalProperties: true,
    },
  },
  example: {
    error: 'Account not found',
    code: 'ACCOUNT_NOT_FOUND',
    details: { accountId: '550e8400-e29b-41d4-a716-446655440000' },
  },
};

export const SuccessResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['success'],
  properties: {
    success: {
      type: 'boolean',
      description: 'Operation success status',
      example: true,
    },
  },
  example: { success: true },
};

export const InvokeResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['result'],
  properties: {
    result: {
      description: 'Command-specific result data',
      oneOf: [
        { type: 'object', additionalProperties: true },
        { type: 'array', items: {} },
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'null' },
      ],
    },
  },
  example: {
    result: { success: true },
  },
};

export const ErrorResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong',
      example: 'Unknown command: invalid_command',
    },
  },
  example: {
    error: 'Unknown command: invalid_command',
  },
};
