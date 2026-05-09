import type { OpenAPIV3_1 } from 'openapi-types';

export interface CommandSchema {
  description: string;
  args?: OpenAPIV3_1.SchemaObject;
  response: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject;
  example: {
    command: string;
    args?: Record<string, unknown>;
  };
}

const SuccessResponse: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
  },
};

const NullResponse: OpenAPIV3_1.SchemaObject = {
  type: 'null',
  description: 'No data returned',
};

const IdArgSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Account ID', example: '550e8400-e29b-41d4-a716-446655440000' },
  },
};

const IdsArgSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['ids'],
  properties: {
    ids: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
      description: 'Array of account IDs',
      example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    },
  },
};

const OrderedIdsArgSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['orderedIds'],
  properties: {
    orderedIds: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
      description: 'Ordered array of account IDs',
      example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'],
    },
  },
};

const LoginIdCodeArgsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['loginId', 'code'],
  properties: {
    loginId: { type: 'string', format: 'uuid', description: 'OAuth login session ID' },
    code: { type: 'string', description: 'OAuth authorization code' },
  },
};

const UrlArgSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  required: ['url'],
  properties: {
    url: { type: 'string', format: 'uri', description: 'OAuth callback URL', example: 'http://localhost:3001/callback?code=abc123' },
  },
};

const AccountArrayResponse: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: { $ref: '#/components/schemas/Account' },
};

const InstanceArrayResponse: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: { $ref: '#/components/schemas/Instance' },
};

const GroupArrayResponse: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: { $ref: '#/components/schemas/Group' },
};

const FingerprintArrayResponse: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: { $ref: '#/components/schemas/Fingerprint' },
};

function createAccountCommands(platform: string, displayName: string): Record<string, CommandSchema> {
  const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  return {
    [`list_${platform}_accounts`]: {
      description: `List all ${capitalized} accounts`,
      args: undefined,
      response: AccountArrayResponse,
      example: { command: `list_${platform}_accounts` },
    },
    [`delete_${platform}_account`]: {
      description: `Delete a ${capitalized} account`,
      args: IdArgSchema,
      response: SuccessResponse,
      example: { command: `delete_${platform}_account`, args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
    },
    [`delete_${platform}_accounts`]: {
      description: `Delete multiple ${capitalized} accounts`,
      args: IdsArgSchema,
      response: SuccessResponse,
      example: { command: `delete_${platform}_accounts`, args: { ids: ['550e8400-e29b-41d4-a716-446655440000'] } },
    },
    [`import_${platform}_from_json`]: {
      description: `Import a ${capitalized} account from JSON data`,
      args: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          accessToken: { type: 'string' },
        },
      },
      response: { $ref: '#/components/schemas/Account' },
      example: { command: `import_${platform}_from_json`, args: { email: 'user@example.com', name: 'Test User' } },
    },
    [`export_${platform}_accounts`]: {
      description: `Export all ${capitalized} accounts`,
      args: undefined,
      response: AccountArrayResponse,
      example: { command: `export_${platform}_accounts` },
    },
    [`refresh_${platform}_token`]: {
      description: `Refresh token for a ${capitalized} account`,
      args: IdArgSchema,
      response: { $ref: '#/components/schemas/Quota' },
      example: { command: `refresh_${platform}_token`, args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
    },
    [`refresh_all_${platform}_tokens`]: {
      description: `Refresh tokens for all ${capitalized} accounts`,
      args: undefined,
      response: { type: 'array', items: { $ref: '#/components/schemas/Quota' } },
      example: { command: `refresh_all_${platform}_tokens` },
    },
  };
}

function createOAuthCommands(platform: string, displayName: string): Record<string, CommandSchema> {
  const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const commands: Record<string, CommandSchema> = {
    [`${platform}_oauth_login_start`]: {
      description: `Start OAuth login flow for ${capitalized}`,
      args: undefined,
      response: {
        type: 'object',
        properties: {
          loginId: { type: 'string', format: 'uuid' },
          authUrl: { type: 'string', format: 'uri' },
        },
      },
      example: { command: `${platform}_oauth_login_start` },
    },
    [`${platform}_oauth_login_complete`]: {
      description: `Complete OAuth login for ${capitalized}`,
      args: LoginIdCodeArgsSchema,
      response: { $ref: '#/components/schemas/Account' },
      example: { command: `${platform}_oauth_login_complete`, args: { loginId: 'uuid-here', code: 'auth-code' } },
    },
    [`${platform}_oauth_login_cancel`]: {
      description: `Cancel OAuth login for ${capitalized}`,
      args: undefined,
      response: { type: 'object', properties: { cancelled: { type: 'boolean' } } },
      example: { command: `${platform}_oauth_login_cancel` },
    },
  };

  if (platform === 'codex' || platform === 'windsurf' || platform === 'kiro' || platform === 'zed') {
    commands[`${platform}_oauth_submit_callback_url`] = {
      description: `Submit OAuth callback URL for ${capitalized}`,
      args: UrlArgSchema,
      response: { $ref: '#/components/schemas/Account' },
      example: { command: `${platform}_oauth_submit_callback_url`, args: { url: 'http://localhost:3001/callback?code=abc' } },
    };
  }

  return commands;
}

export const CommandSchemas: Record<string, CommandSchema> = {
  // Antigravity/General Account commands
  list_accounts: {
    description: 'List all Antigravity accounts',
    args: undefined,
    response: AccountArrayResponse,
    example: { command: 'list_accounts' },
  },
  add_account: {
    description: 'Add a new Antigravity account',
    args: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
      },
    },
    response: { $ref: '#/components/schemas/Account' },
    example: { command: 'add_account', args: { email: 'user@example.com', name: 'John Doe' } },
  },
  delete_account: {
    description: 'Delete an Antigravity account',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'delete_account', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  delete_accounts: {
    description: 'Delete multiple Antigravity accounts',
    args: IdsArgSchema,
    response: SuccessResponse,
    example: { command: 'delete_accounts', args: { ids: ['550e8400-e29b-41d4-a716-446655440000'] } },
  },
  reorder_accounts: {
    description: 'Reorder Antigravity accounts',
    args: OrderedIdsArgSchema,
    response: SuccessResponse,
    example: { command: 'reorder_accounts', args: { orderedIds: ['id1', 'id2'] } },
  },
  get_current_account: {
    description: 'Get the currently active Antigravity account',
    args: undefined,
    response: { oneOf: [{ $ref: '#/components/schemas/Account' }, { type: 'null' }] },
    example: { command: 'get_current_account' },
  },
  set_current_account: {
    description: 'Set the active Antigravity account',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'set_current_account', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  switch_account: {
    description: 'Switch to a different Antigravity account',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'switch_account', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  fetch_account_quota: {
    description: 'Fetch quota for an Antigravity account',
    args: IdArgSchema,
    response: { $ref: '#/components/schemas/Quota' },
    example: { command: 'fetch_account_quota', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  refresh_all_quotas: {
    description: 'Refresh quotas for all Antigravity accounts',
    args: undefined,
    response: { type: 'array', items: { $ref: '#/components/schemas/Quota' } },
    example: { command: 'refresh_all_quotas' },
  },

  // OAuth commands (Antigravity)
  start_oauth_login: {
    description: 'Start OAuth login flow for Antigravity',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        loginId: { type: 'string', format: 'uuid' },
        authUrl: { type: 'string', format: 'uri' },
      },
    },
    example: { command: 'start_oauth_login' },
  },
  prepare_oauth_url: {
    description: 'Prepare OAuth URL for Antigravity',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        loginId: { type: 'string', format: 'uuid' },
        authUrl: { type: 'string', format: 'uri' },
      },
    },
    example: { command: 'prepare_oauth_url' },
  },
  complete_oauth_login: {
    description: 'Complete OAuth login for Antigravity',
    args: LoginIdCodeArgsSchema,
    response: { $ref: '#/components/schemas/Account' },
    example: { command: 'complete_oauth_login', args: { loginId: 'uuid-here', code: 'auth-code' } },
  },
  submit_oauth_callback_url: {
    description: 'Submit OAuth callback URL for Antigravity',
    args: UrlArgSchema,
    response: { $ref: '#/components/schemas/Account' },
    example: { command: 'submit_oauth_callback_url', args: { url: 'http://localhost:3001/callback?code=abc' } },
  },
  cancel_oauth_login: {
    description: 'Cancel OAuth login for Antigravity',
    args: undefined,
    response: { type: 'object', properties: { cancelled: { type: 'boolean' } } },
    example: { command: 'cancel_oauth_login' },
  },

  // Codex commands
  get_current_codex_account: {
    description: 'Get the currently active Codex account',
    args: undefined,
    response: { oneOf: [{ $ref: '#/components/schemas/Account' }, { type: 'null' }] },
    example: { command: 'get_current_codex_account' },
  },
  switch_codex_account: {
    description: 'Switch to a different Codex account',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'switch_codex_account', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  add_codex_account_with_token: {
    description: 'Add a Codex account with token',
    args: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        accessToken: { type: 'string' },
      },
    },
    response: { $ref: '#/components/schemas/Account' },
    example: { command: 'add_codex_account_with_token', args: { email: 'user@example.com', name: 'Test User', accessToken: 'token123' } },
  },
  add_codex_account_with_api_key: {
    description: 'Add a Codex account with API key',
    args: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        apiKey: { type: 'string' },
      },
    },
    response: { $ref: '#/components/schemas/Account' },
    example: { command: 'add_codex_account_with_api_key', args: { email: 'user@example.com', name: 'Test User', apiKey: 'key123' } },
  },
  update_codex_account_name: {
    description: 'Update Codex account name',
    args: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
      },
    },
    response: SuccessResponse,
    example: { command: 'update_codex_account_name', args: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'New Name' } },
  },
  get_codex_quick_config: {
    description: 'Get Codex quick configuration',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        model: { type: 'string' },
        temperature: { type: 'number' },
      },
    },
    example: { command: 'get_codex_quick_config' },
  },
  save_codex_quick_config: {
    description: 'Save Codex quick configuration',
    args: {
      type: 'object',
      properties: {
        model: { type: 'string' },
        temperature: { type: 'number' },
      },
    },
    response: SuccessResponse,
    example: { command: 'save_codex_quick_config', args: { model: 'gpt-4', temperature: 0.7 } },
  },

  // Instance commands
  get_instance_defaults: {
    description: 'Get default values for creating a new instance',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        platform: { type: 'string' },
      },
    },
    example: { command: 'get_instance_defaults' },
  },
  list_instances: {
    description: 'List all instances',
    args: undefined,
    response: InstanceArrayResponse,
    example: { command: 'list_instances' },
  },
  create_instance: {
    description: 'Create a new instance',
    args: {
      type: 'object',
      required: ['name', 'platform'],
      properties: {
        name: { type: 'string', description: 'Instance name' },
        platform: { $ref: '#/components/schemas/Platform' },
        accountId: { type: 'string', format: 'uuid', description: 'Associated account ID' },
      },
    },
    response: { $ref: '#/components/schemas/Instance' },
    example: { command: 'create_instance', args: { name: 'Dev Environment', platform: 'codex' } },
  },
  update_instance: {
    description: 'Update an instance',
    args: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
      },
    },
    response: { $ref: '#/components/schemas/Instance' },
    example: { command: 'update_instance', args: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Updated Name' } },
  },
  delete_instance: {
    description: 'Delete an instance',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'delete_instance', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  start_instance: {
    description: 'Start an instance',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'start_instance', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  stop_instance: {
    description: 'Stop an instance',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'stop_instance', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  close_all_instances: {
    description: 'Close all running instances',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'close_all_instances' },
  },

  // Group commands
  save_group_settings: {
    description: 'Create a new group',
    args: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Group name' },
        platform: { $ref: '#/components/schemas/Platform' },
      },
    },
    response: { $ref: '#/components/schemas/Group' },
    example: { command: 'save_group_settings', args: { name: 'Production', platform: 'codex' } },
  },
  set_group_name: {
    description: 'Update group name',
    args: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
      },
    },
    response: SuccessResponse,
    example: { command: 'set_group_name', args: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'New Name' } },
  },
  delete_group: {
    description: 'Delete a group',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'delete_group', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  update_group_order: {
    description: 'Update group display order',
    args: OrderedIdsArgSchema,
    response: SuccessResponse,
    example: { command: 'update_group_order', args: { orderedIds: ['id1', 'id2'] } },
  },

  // Fingerprint commands
  list_fingerprints: {
    description: 'List all fingerprints',
    args: undefined,
    response: FingerprintArrayResponse,
    example: { command: 'list_fingerprints' },
  },
  get_fingerprint: {
    description: 'Get a specific fingerprint',
    args: IdArgSchema,
    response: { oneOf: [{ $ref: '#/components/schemas/Fingerprint' }, { type: 'null' }] },
    example: { command: 'get_fingerprint', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  generate_new_fingerprint: {
    description: 'Generate a new fingerprint',
    args: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Fingerprint name' },
      },
    },
    response: { $ref: '#/components/schemas/Fingerprint' },
    example: { command: 'generate_new_fingerprint', args: { name: 'Chrome Windows' } },
  },
  capture_current_fingerprint: {
    description: 'Capture current browser fingerprint',
    args: undefined,
    response: { $ref: '#/components/schemas/Fingerprint' },
    example: { command: 'capture_current_fingerprint' },
  },
  create_fingerprint_with_profile: {
    description: 'Create fingerprint with existing profile',
    args: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Fingerprint name' },
      },
    },
    response: { $ref: '#/components/schemas/Fingerprint' },
    example: { command: 'create_fingerprint_with_profile', args: { name: 'Custom Fingerprint' } },
  },
  apply_fingerprint: {
    description: 'Apply a fingerprint as current',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'apply_fingerprint', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  delete_fingerprint: {
    description: 'Delete a fingerprint',
    args: IdArgSchema,
    response: SuccessResponse,
    example: { command: 'delete_fingerprint', args: { id: '550e8400-e29b-41d4-a716-446655440000' } },
  },
  delete_unbound_fingerprints: {
    description: 'Delete all unbound fingerprints',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'delete_unbound_fingerprints' },
  },
  rename_fingerprint: {
    description: 'Rename a fingerprint',
    args: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
      },
    },
    response: SuccessResponse,
    example: { command: 'rename_fingerprint', args: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'New Name' } },
  },
  get_current_fingerprint_id: {
    description: 'Get the current fingerprint ID',
    args: undefined,
    response: { oneOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }] },
    example: { command: 'get_current_fingerprint_id' },
  },
  bind_account_fingerprint: {
    description: 'Bind a fingerprint to an account',
    args: {
      type: 'object',
      required: ['accountId', 'fingerprintId'],
      properties: {
        accountId: { type: 'string', format: 'uuid' },
        fingerprintId: { type: 'string', format: 'uuid' },
      },
    },
    response: SuccessResponse,
    example: { command: 'bind_account_fingerprint', args: { accountId: 'id1', fingerprintId: 'id2' } },
  },
  get_bound_accounts: {
    description: 'Get accounts bound to a fingerprint',
    args: {
      type: 'object',
      required: ['fingerprintId'],
      properties: {
        fingerprintId: { type: 'string', format: 'uuid' },
      },
    },
    response: { type: 'array', items: { type: 'string', format: 'uuid' } },
    example: { command: 'get_bound_accounts', args: { fingerprintId: '550e8400-e29b-41d4-a716-446655440000' } },
  },

  // Device profile commands
  get_device_profiles: {
    description: 'Get all device profiles',
    args: undefined,
    response: { type: 'array', items: { type: 'object' } },
    example: { command: 'get_device_profiles' },
  },
  bind_device_profile: {
    description: 'Bind a device profile',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'bind_device_profile' },
  },
  list_device_versions: {
    description: 'List device versions',
    args: undefined,
    response: { type: 'array', items: { type: 'object' } },
    example: { command: 'list_device_versions' },
  },
  restore_device_version: {
    description: 'Restore a device version',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'restore_device_version' },
  },
  delete_device_version: {
    description: 'Delete a device version',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'delete_device_version' },
  },
  restore_original_device: {
    description: 'Restore original device settings',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'restore_original_device' },
  },

  // Config commands
  save_general_config: {
    description: 'Save general configuration',
    args: {
      type: 'object',
      additionalProperties: true,
    },
    response: SuccessResponse,
    example: { command: 'save_general_config', args: { theme: 'dark', language: 'en' } },
  },
  get_general_config: {
    description: 'Get general configuration',
    args: undefined,
    response: { type: 'object', additionalProperties: true },
    example: { command: 'get_general_config' },
  },
  get_network_config: {
    description: 'Get network configuration',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        proxy: { type: 'string', description: 'Proxy URL or null if not set' },
        timeout: { type: 'integer' },
      },
    },
    example: { command: 'get_network_config' },
  },
  save_update_settings: {
    description: 'Save update settings',
    args: {
      type: 'object',
      properties: {
        autoCheck: { type: 'boolean' },
        channel: { type: 'string', enum: ['stable', 'beta'] },
      },
    },
    response: SuccessResponse,
    example: { command: 'save_update_settings', args: { autoCheck: true, channel: 'stable' } },
  },
  get_update_settings: {
    description: 'Get update settings',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        autoCheck: { type: 'boolean' },
        channel: { type: 'string' },
      },
    },
    example: { command: 'get_update_settings' },
  },

  // Backup commands
  get_scheduled_backup_config: {
    description: 'Get scheduled backup configuration',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        interval: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
      },
    },
    example: { command: 'get_scheduled_backup_config' },
  },
  save_scheduled_backup_config: {
    description: 'Save scheduled backup configuration',
    args: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        interval: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
      },
    },
    response: SuccessResponse,
    example: { command: 'save_scheduled_backup_config', args: { enabled: true, interval: 'daily' } },
  },
  run_backup_now: {
    description: 'Run backup immediately',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        timestamp: { type: 'integer' },
      },
    },
    example: { command: 'run_backup_now' },
  },

  // Export/Import commands
  export_all_data: {
    description: 'Export all data (accounts, groups, fingerprints, config)',
    args: undefined,
    response: {
      type: 'object',
      properties: {
        accounts: { type: 'array', items: { $ref: '#/components/schemas/Account' } },
        codexAccounts: { type: 'array', items: { $ref: '#/components/schemas/Account' } },
        groups: { type: 'array', items: { $ref: '#/components/schemas/Group' } },
        fingerprints: { type: 'array', items: { $ref: '#/components/schemas/Fingerprint' } },
        config: { type: 'array', items: { $ref: '#/components/schemas/Config' } },
      },
    },
    example: { command: 'export_all_data' },
  },
  import_all_data: {
    description: 'Import all data from exported backup',
    args: {
      type: 'object',
      properties: {
        accounts: { type: 'array', items: { type: 'object' } },
        codexAccounts: { type: 'array', items: { type: 'object' } },
        groups: { type: 'array', items: { type: 'object' } },
        fingerprints: { type: 'array', items: { type: 'object' } },
      },
    },
    response: SuccessResponse,
    example: { command: 'import_all_data', args: { accounts: [] } },
  },

  // Platform-specific account commands
  ...createAccountCommands('codex', 'Codex'),
  ...createAccountCommands('windsurf', 'Windsurf'),
  ...createAccountCommands('cursor', 'Cursor'),
  ...createAccountCommands('kiro', 'Kiro'),
  ...createAccountCommands('gemini', 'Gemini'),
  ...createAccountCommands('codebuddy', 'CodeBuddy'),
  ...createAccountCommands('codebuddy_cn', 'CodeBuddy CN'),
  ...createAccountCommands('qoder', 'Qoder'),
  ...createAccountCommands('trae', 'Trae'),
  ...createAccountCommands('zed', 'Zed'),
  ...createAccountCommands('github_copilot', 'GitHub Copilot'),
  ...createAccountCommands('workbuddy', 'WorkBuddy'),

  // OAuth commands per platform
  ...createOAuthCommands('codex', 'Codex'),
  ...createOAuthCommands('windsurf', 'Windsurf'),
  ...createOAuthCommands('cursor', 'Cursor'),
  ...createOAuthCommands('kiro', 'Kiro'),
  ...createOAuthCommands('gemini', 'Gemini'),
  ...createOAuthCommands('qoder', 'Qoder'),
  ...createOAuthCommands('trae', 'Trae'),
  ...createOAuthCommands('zed', 'Zed'),
  ...createOAuthCommands('github_copilot', 'GitHub Copilot'),

  // Inject commands (platform-specific)
  inject_github_copilot_to_vscode: {
    description: 'Inject GitHub Copilot account to VSCode',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_github_copilot_to_vscode' },
  },
  inject_windsurf_account: {
    description: 'Inject Windsurf account',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_windsurf_account' },
  },
  inject_kiro_account: {
    description: 'Inject Kiro account',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_kiro_account' },
  },
  inject_cursor_account: {
    description: 'Inject Cursor account',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_cursor_account' },
  },
  inject_codebuddy_account: {
    description: 'Inject CodeBuddy account',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_codebuddy_account' },
  },
  inject_qoder_account: {
    description: 'Inject Qoder account',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_qoder_account' },
  },
  inject_trae_account: {
    description: 'Inject Trae account',
    args: undefined,
    response: SuccessResponse,
    example: { command: 'inject_trae_account' },
  },

  // Floating card commands
  show_floating_card_window: {
    description: 'Show floating card window',
    args: undefined,
    response: NullResponse,
    example: { command: 'show_floating_card_window' },
  },
  hide_floating_card_window: {
    description: 'Hide floating card window',
    args: undefined,
    response: NullResponse,
    example: { command: 'hide_floating_card_window' },
  },

  // Stub commands (return null)
  open_device_folder: {
    description: 'Open device folder in file explorer',
    args: undefined,
    response: NullResponse,
    example: { command: 'open_device_folder' },
  },
  open_data_folder: {
    description: 'Open data folder in file explorer',
    args: undefined,
    response: NullResponse,
    example: { command: 'open_data_folder' },
  },
  get_announcement: {
    description: 'Get announcement',
    args: undefined,
    response: NullResponse,
    example: { command: 'get_announcement' },
  },
  get_top_right_ad: {
    description: 'Get top right advertisement',
    args: undefined,
    response: NullResponse,
    example: { command: 'get_top_right_ad' },
  },
  logs_get_snapshot: {
    description: 'Get logs snapshot',
    args: undefined,
    response: { type: 'array', items: { type: 'string' } },
    example: { command: 'logs_get_snapshot' },
  },
  logs_open_log_directory: {
    description: 'Open log directory',
    args: undefined,
    response: NullResponse,
    example: { command: 'logs_open_log_directory' },
  },
};
