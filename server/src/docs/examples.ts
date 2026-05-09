export const ExampleQuotas = {
  full: { used: 100, total: 100, resetAt: 1704240000000 },
  half: { used: 50, total: 100, resetAt: 1704240000000 },
  empty: { used: 0, total: 100, resetAt: 1704240000000 },
  unlimited: { used: 0, total: 999999, resetAt: null },
};

export const ExampleAccounts = {
  antigravity: {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    platform: 'antigravity',
    email: 'developer@company.com',
    name: 'John Developer',
    quota: ExampleQuotas.half,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  codex: {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    platform: 'codex',
    email: 'coder@example.com',
    name: 'Jane Coder',
    quota: ExampleQuotas.half,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  windsurf: {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    platform: 'windsurf',
    email: 'surfer@windsurf.io',
    name: 'Bob Surfer',
    quota: ExampleQuotas.empty,
    isCurrent: false,
    sortOrder: 1,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  cursor: {
    id: 'd4e5f6a7-b8c9-0123-def1-234567890123',
    platform: 'cursor',
    email: 'alice@cursor.sh',
    name: 'Alice Cursor',
    quota: ExampleQuotas.full,
    isCurrent: false,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  kiro: {
    id: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
    platform: 'kiro',
    email: 'dev@kiro.dev',
    name: 'Charlie Kiro',
    quota: ExampleQuotas.half,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  gemini: {
    id: 'f6a7b8c9-d0e1-2345-f123-456789012345',
    platform: 'gemini_cli',
    email: 'user@google.com',
    name: 'Diana Gemini',
    quota: ExampleQuotas.empty,
    isCurrent: false,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  codebuddy: {
    id: 'a7b8c9d0-e1f2-3456-1234-567890123456',
    platform: 'codebuddy',
    email: 'buddy@codebuddy.ai',
    name: 'Eve Buddy',
    quota: ExampleQuotas.half,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  codebuddy_cn: {
    id: 'b8c9d0e1-f2a3-4567-2345-678901234567',
    platform: 'codebuddy_cn',
    email: 'buddy@codebuddy.cn',
    name: 'Frank CN',
    quota: ExampleQuotas.empty,
    isCurrent: false,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  qoder: {
    id: 'c9d0e1f2-a3b4-5678-3456-789012345678',
    platform: 'qoder',
    email: 'qoder@qoder.ai',
    name: 'Grace Qoder',
    quota: ExampleQuotas.half,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  trae: {
    id: 'd0e1f2a3-b4c5-6789-4567-890123456789',
    platform: 'trae',
    email: 'trae@trae.dev',
    name: 'Henry Trae',
    quota: ExampleQuotas.empty,
    isCurrent: false,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  zed: {
    id: 'e1f2a3b4-c5d6-7890-5678-901234567890',
    platform: 'zed',
    email: 'zed@zed.dev',
    name: 'Ivy Zed',
    quota: ExampleQuotas.half,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  github_copilot: {
    id: 'f2a3b4c5-d6e7-8901-6789-012345678901',
    platform: 'github_copilot',
    email: 'copilot@github.com',
    name: 'Jack GitHub',
    quota: ExampleQuotas.full,
    isCurrent: true,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  workbuddy: {
    id: 'a3b4c5d6-e7f8-9012-7890-123456789012',
    platform: 'workbuddy',
    email: 'work@workbuddy.ai',
    name: 'Karen Work',
    quota: ExampleQuotas.empty,
    isCurrent: false,
    sortOrder: 0,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
};

export const ExampleInstances = [
  {
    id: 'i1b2c3d4-e5f6-7890-abcd-ef1234567890',
    platform: 'codex',
    name: 'Development Environment',
    accountId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    status: 'running',
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  {
    id: 'i2c3d4e5-f6a7-8901-bcde-f12345678901',
    platform: 'windsurf',
    name: 'Testing Instance',
    accountId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    status: 'stopped',
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  {
    id: 'i3d4e5f6-a7b8-9012-cdef-123456789012',
    platform: 'cursor',
    name: 'Production Debug',
    accountId: 'd4e5f6a7-b8c9-0123-def1-234567890123',
    status: 'stopped',
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
];

export const ExampleGroups = [
  {
    id: 'g1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Production Accounts',
    platform: 'codex',
    sortOrder: 0,
    createdAt: 1704067200000,
  },
  {
    id: 'g2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Development Team',
    platform: 'windsurf',
    sortOrder: 1,
    createdAt: 1704067200000,
  },
  {
    id: 'g3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Testing Group',
    platform: null,
    sortOrder: 2,
    createdAt: 1704067200000,
  },
];

export const ExampleFingerprints = [
  {
    id: 'fp1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Chrome Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    isCurrent: true,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  {
    id: 'fp2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Firefox macOS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    isCurrent: false,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
  {
    id: 'fp3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Edge Windows 10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    viewport: { width: 2560, height: 1440 },
    isCurrent: false,
    createdAt: 1704067200000,
    updatedAt: 1704153600000,
  },
];

export const ExampleCommandRequests = {
  listAccounts: {
    command: 'list_accounts',
  },
  addAccount: {
    command: 'add_account',
    args: {
      email: 'newuser@example.com',
      name: 'New User',
    },
  },
  deleteAccount: {
    command: 'delete_account',
    args: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  setCurrentAccount: {
    command: 'set_current_account',
    args: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  startOAuthLogin: {
    command: 'start_oauth_login',
  },
  completeOAuthLogin: {
    command: 'complete_oauth_login',
    args: {
      loginId: 'oauth-session-id',
      code: 'authorization-code-from-provider',
    },
  },
  listInstances: {
    command: 'list_instances',
  },
  createInstance: {
    command: 'create_instance',
    args: {
      name: 'My Development Instance',
      platform: 'codex',
      accountId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    },
  },
  startInstance: {
    command: 'start_instance',
    args: {
      id: 'i1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  stopInstance: {
    command: 'stop_instance',
    args: {
      id: 'i1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  listFingerprints: {
    command: 'list_fingerprints',
  },
  generateFingerprint: {
    command: 'generate_new_fingerprint',
    args: {
      name: 'Custom Chrome Profile',
    },
  },
  exportAllData: {
    command: 'export_all_data',
  },
  importAllData: {
    command: 'import_all_data',
    args: {
      accounts: [ExampleAccounts.codex],
      groups: [ExampleGroups[0]],
    },
  },
  getBackupConfig: {
    command: 'get_scheduled_backup_config',
  },
  saveBackupConfig: {
    command: 'save_scheduled_backup_config',
    args: {
      enabled: true,
      interval: 'daily',
    },
  },
  runBackup: {
    command: 'run_backup_now',
  },
};

export const ExampleCommandResponses = {
  success: { result: { success: true } },
  listAccounts: {
    result: [ExampleAccounts.antigravity],
  },
  account: {
    result: ExampleAccounts.codex,
  },
  listInstances: {
    result: ExampleInstances,
  },
  instance: {
    result: ExampleInstances[0],
  },
  listFingerprints: {
    result: ExampleFingerprints,
  },
  fingerprint: {
    result: ExampleFingerprints[0],
  },
  exportData: {
    result: {
      accounts: [ExampleAccounts.antigravity],
      codexAccounts: [ExampleAccounts.codex],
      groups: ExampleGroups,
      fingerprints: ExampleFingerprints,
      config: [{ key: 'general_config', value: '{"theme":"dark"}', updatedAt: 1704153600000 }],
    },
  },
  backupConfig: {
    result: { enabled: true, interval: 'daily' },
  },
  runBackup: {
    result: { success: true, timestamp: 1704153600000 },
  },
  oauthStart: {
    result: {
      loginId: 'oauth-session-uuid',
      authUrl: 'http://localhost:3001/api/oauth/codex/callback?login_id=oauth-session-uuid',
    },
  },
  error: {
    error: 'Unknown command: invalid_command',
  },
};
