import { v4 as uuidv4 } from 'uuid';
import { db, getConfig, setConfig } from '../db/index.js';
import { broadcastEvent } from './event-bus.js';

type CommandHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown;

interface AccountRow {
  id: string;
  platform: string;
  email: string | null;
  name: string | null;
  data: string;
  is_current: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

function parseAccount(row: AccountRow) {
  return {
    id: row.id,
    platform: row.platform,
    email: row.email ?? undefined,
    name: row.name ?? undefined,
    ...JSON.parse(row.data),
    isCurrent: row.is_current === 1,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function listAccounts(platform: string) {
  const rows = db.prepare('SELECT * FROM accounts WHERE platform = ? ORDER BY sort_order').all(platform) as AccountRow[];
  return rows.map(parseAccount);
}

function addAccount(platform: string, args: Record<string, unknown>) {
  const id = uuidv4();
  const now = Date.now();
  const { email, name, ...rest } = args;
  const data = JSON.stringify(rest);
  
  db.prepare(`
    INSERT INTO accounts (id, platform, email, name, data, is_current, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)
  `).run(id, platform, email ?? null, name ?? null, data, now, now);
  
  broadcastEvent('account-added', { platform, accountId: id });
  return { id, ...args };
}

function deleteAccount(platform: string, id: string) {
  db.prepare('DELETE FROM accounts WHERE id = ? AND platform = ?').run(id, platform);
  broadcastEvent('account-deleted', { platform, accountId: id });
  return { success: true };
}

function deleteAccounts(platform: string, ids: string[]) {
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`DELETE FROM accounts WHERE id IN (${placeholders}) AND platform = ?`).run(...ids, platform);
  broadcastEvent('accounts-deleted', { platform, accountIds: ids });
  return { success: true };
}

function getCurrentAccount(platform: string) {
  const row = db.prepare('SELECT * FROM accounts WHERE platform = ? AND is_current = 1').get(platform) as AccountRow | undefined;
  return row ? parseAccount(row) : null;
}

function setCurrentAccount(platform: string, id: string) {
  db.prepare('UPDATE accounts SET is_current = 0 WHERE platform = ?').run(platform);
  db.prepare('UPDATE accounts SET is_current = 1 WHERE id = ? AND platform = ?').run(id, platform);
  setConfig(`current_account_${platform}`, id);
  broadcastEvent('account-switched', { platform, accountId: id });
  return { success: true };
}

function reorderAccounts(platform: string, orderedIds: string[]) {
  const stmt = db.prepare('UPDATE accounts SET sort_order = ? WHERE id = ? AND platform = ?');
  orderedIds.forEach((id, index) => stmt.run(index, id, platform));
  return { success: true };
}

function refreshQuota(platform: string, id?: string) {
  const account = id ? db.prepare('SELECT * FROM accounts WHERE id = ? AND platform = ?').get(id, platform) as AccountRow | undefined : getCurrentAccount(platform);
  if (!account) return null;
  const parsed = parseAccount(account);
  return {
    accountId: parsed.id,
    quota: parsed.quota ?? { used: 0, total: 100 },
    refreshedAt: Date.now(),
  };
}

function refreshAllQuotas(platform: string) {
  const accounts = listAccounts(platform);
  return accounts.map(a => ({ accountId: a.id, quota: a.quota ?? { used: 0, total: 100 }, refreshedAt: Date.now() }));
}

function startOAuthLogin(platform: string) {
  const loginId = uuidv4();
  return {
    loginId,
    authUrl: `http://localhost:3001/api/oauth/${platform}/callback?login_id=${loginId}`,
  };
}

function completeOAuthLogin(platform: string, loginId: string, _code: string) {
  const id = uuidv4();
  const now = Date.now();
  const mockData = { accessToken: `mock_token_${Date.now()}`, refreshToken: `mock_refresh_${Date.now()}` };
  
  db.prepare(`
    INSERT INTO accounts (id, platform, email, name, data, is_current, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, 0, ?, ?)
  `).run(id, platform, 'user@example.com', 'Mock User', JSON.stringify(mockData), now, now);
  
  broadcastEvent('oauth-login-completed', { platform, loginId, accountId: id });
  return { accountId: id, ...mockData };
}

export const commandHandlers: Record<string, CommandHandler> = {
  // Antigravity/Account commands
  list_accounts: () => listAccounts('antigravity'),
  add_account: (args) => addAccount('antigravity', args),
  delete_account: ({ id }) => deleteAccount('antigravity', id as string),
  delete_accounts: ({ ids }) => deleteAccounts('antigravity', ids as string[]),
  reorder_accounts: ({ orderedIds }) => reorderAccounts('antigravity', orderedIds as string[]),
  get_current_account: () => getCurrentAccount('antigravity'),
  set_current_account: ({ id }) => setCurrentAccount('antigravity', id as string),
  fetch_account_quota: ({ id }) => refreshQuota('antigravity', id as string),
  refresh_all_quotas: () => refreshAllQuotas('antigravity'),
  start_oauth_login: () => startOAuthLogin('antigravity'),
  prepare_oauth_url: () => startOAuthLogin('antigravity'),
  complete_oauth_login: ({ loginId, code }) => completeOAuthLogin('antigravity', loginId as string, code as string),
  submit_oauth_callback_url: ({ url }) => {
    const urlObj = new URL(url as string);
    const code = urlObj.searchParams.get('code') || '';
    return completeOAuthLogin('antigravity', uuidv4(), code);
  },
  cancel_oauth_login: () => ({ cancelled: true }),
  switch_account: ({ id }) => setCurrentAccount('antigravity', id as string),
  
  // Device profile commands
  get_device_profiles: () => [],
  bind_device_profile: () => ({ success: true }),
  bind_device_profile_with_profile: () => ({ success: true }),
  list_device_versions: () => [],
  restore_device_version: () => ({ success: true }),
  delete_device_version: () => ({ success: true }),
  restore_original_device: () => ({ success: true }),
  open_device_folder: () => null,
  open_data_folder: () => null,
  
  // Fingerprint commands
  list_fingerprints: () => {
    const rows = db.prepare('SELECT * FROM fingerprints ORDER BY created_at DESC').all() as { id: string; name: string; data: string; is_current: number; created_at: number; updated_at: number }[];
    return rows.map(r => ({ id: r.id, name: r.name, ...JSON.parse(r.data), isCurrent: r.is_current === 1 }));
  },
  get_fingerprint: ({ id }) => {
    const row = db.prepare('SELECT * FROM fingerprints WHERE id = ?').get(id) as { id: string; name: string; data: string; is_current: number } | undefined;
    return row ? { id: row.id, name: row.name, ...JSON.parse(row.data) } : null;
  },
  generate_new_fingerprint: ({ name }) => {
    const id = uuidv4();
    const now = Date.now();
    const data = JSON.stringify({ userAgent: 'Mozilla/5.0', viewport: { width: 1920, height: 1080 } });
    db.prepare('INSERT INTO fingerprints (id, name, data, is_current, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)').run(id, name, now, data, now);
    return { id, name };
  },
  capture_current_fingerprint: () => ({ id: uuidv4(), name: 'Captured Fingerprint' }),
  create_fingerprint_with_profile: ({ name }) => {
    const id = uuidv4();
    const now = Date.now();
    const data = JSON.stringify({ userAgent: 'Mozilla/5.0', viewport: { width: 1920, height: 1080 } });
    db.prepare('INSERT INTO fingerprints (id, name, data, is_current, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)').run(id, name, data, now, now);
    return { id, name };
  },
  apply_fingerprint: ({ id }) => {
    db.prepare('UPDATE fingerprints SET is_current = 0').run();
    db.prepare('UPDATE fingerprints SET is_current = 1 WHERE id = ?').run(id);
    return { success: true };
  },
  delete_fingerprint: ({ id }) => {
    db.prepare('DELETE FROM fingerprints WHERE id = ?').run(id);
    return { success: true };
  },
  delete_unbound_fingerprints: () => {
    db.prepare('DELETE FROM fingerprints WHERE id NOT IN (SELECT fingerprint_id FROM account_fingerprints)').run();
    return { success: true };
  },
  rename_fingerprint: ({ id, name }) => {
    db.prepare('UPDATE fingerprints SET name = ?, updated_at = ? WHERE id = ?').run(name, Date.now(), id);
    return { success: true };
  },
  get_current_fingerprint_id: () => {
    const row = db.prepare('SELECT id FROM fingerprints WHERE is_current = 1').get() as { id: string } | undefined;
    return row?.id ?? null;
  },
  bind_account_fingerprint: ({ accountId, fingerprintId }) => {
    db.prepare('INSERT OR REPLACE INTO account_fingerprints (account_id, fingerprint_id) VALUES (?, ?)').run(accountId, fingerprintId);
    return { success: true };
  },
  get_bound_accounts: ({ fingerprintId }) => {
    const rows = db.prepare('SELECT account_id FROM account_fingerprints WHERE fingerprint_id = ?').all(fingerprintId) as { account_id: string }[];
    return rows.map(r => r.account_id);
  },
  sync_current_from_client: () => ({ success: true }),
  preview_current_profile: () => null,

  // Codex commands
  list_codex_accounts: () => listAccounts('codex'),
  get_current_codex_account: () => getCurrentAccount('codex'),
  switch_codex_account: ({ id }) => setCurrentAccount('codex', id as string),
  delete_codex_account: ({ id }) => deleteAccount('codex', id as string),
  delete_codex_accounts: ({ ids }) => deleteAccounts('codex', ids as string[]),
  import_codex_from_local: () => [],
  import_codex_from_json: (args) => addAccount('codex', args),
  export_codex_accounts: () => listAccounts('codex'),
  import_codex_from_files: () => [],
  refresh_codex_account_profile: ({ id }) => refreshQuota('codex', id as string),
  refresh_codex_quota: ({ id }) => refreshQuota('codex', id as string),
  refresh_all_codex_quotas: () => refreshAllQuotas('codex'),
  codex_oauth_login_start: () => startOAuthLogin('codex'),
  codex_oauth_login_completed: ({ loginId, code }) => completeOAuthLogin('codex', loginId as string, code as string),
  codex_oauth_login_cancel: () => ({ cancelled: true }),
  codex_oauth_submit_callback_url: ({ url }) => {
    const urlObj = new URL(url as string);
    const code = urlObj.searchParams.get('code') || '';
    return completeOAuthLogin('codex', uuidv4(), code);
  },
  add_codex_account_with_token: (args) => addAccount('codex', args),
  add_codex_account_with_api_key: (args) => addAccount('codex', args),
  update_codex_account_name: ({ id, name }) => {
    db.prepare('UPDATE accounts SET name = ?, updated_at = ? WHERE id = ?').run(name, Date.now(), id);
    return { success: true };
  },
  update_codex_api_key_credentials: () => ({ success: true }),
  update_codex_account_tags: () => ({ success: true }),
  get_codex_config_toml_path: () => '/mock/path/config.toml',
  open_codex_config_toml: () => null,
  get_codex_quick_config: () => ({ model: 'gpt-4', temperature: 0.7 }),
  save_codex_quick_config: (args) => {
    setConfig('codex_quick_config', JSON.stringify(args));
    return { success: true };
  },
  is_codex_oauth_port_in_use: () => false,
  close_codex_oauth_port: () => ({ success: true }),
  codex_launch_on_switch: () => false,
  set_codex_launch_on_switch: () => ({ success: true }),

  // GitHub Copilot commands
  list_github_copilot_accounts: () => listAccounts('github-copilot'),
  delete_github_copilot_account: ({ id }) => deleteAccount('github-copilot', id as string),
  delete_github_copilot_accounts: ({ ids }) => deleteAccounts('github-copilot', ids as string[]),
  import_github_copilot_from_json: (args) => addAccount('github-copilot', args),
  import_github_copilot_from_local: () => [],
  export_github_copilot_accounts: () => listAccounts('github-copilot'),
  refresh_github_copilot_token: ({ id }) => refreshQuota('github-copilot', id as string),
  refresh_all_github_copilot_tokens: () => refreshAllQuotas('github-copilot'),
  github_copilot_oauth_login_start: () => startOAuthLogin('github-copilot'),
  github_copilot_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('github-copilot', loginId as string, code as string),
  github_copilot_oauth_login_cancel: () => ({ cancelled: true }),
  add_github_copilot_account_with_token: (args) => addAccount('github-copilot', args),
  update_github_copilot_account_tags: () => ({ success: true }),
  get_github_copilot_accounts_index_path: () => '/mock/path/github-copilot/accounts.json',
  inject_github_copilot_to_vscode: () => ({ success: true }),

  // Windsurf commands
  list_windsurf_accounts: () => listAccounts('windsurf'),
  delete_windsurf_account: ({ id }) => deleteAccount('windsurf', id as string),
  delete_windsurf_accounts: ({ ids }) => deleteAccounts('windsurf', ids as string[]),
  import_windsurf_from_json: (args) => addAccount('windsurf', args),
  import_windsurf_from_local: () => [],
  export_windsurf_accounts: () => listAccounts('windsurf'),
  refresh_windsurf_token: ({ id }) => refreshQuota('windsurf', id as string),
  refresh_all_windsurf_tokens: () => refreshAllQuotas('windsurf'),
  windsurf_oauth_login_start: () => startOAuthLogin('windsurf'),
  windsurf_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('windsurf', loginId as string, code as string),
  windsurf_oauth_login_cancel: () => ({ cancelled: true }),
  windsurf_oauth_submit_callback_url: ({ url }) => {
    const urlObj = new URL(url as string);
    const code = urlObj.searchParams.get('code') || '';
    return completeOAuthLogin('windsurf', uuidv4(), code);
  },
  add_windsurf_account_with_token: (args) => addAccount('windsurf', args),
  update_windsurf_account_tags: () => ({ success: true }),
  get_windsurf_accounts_index_path: () => '/mock/path/windsurf/accounts.json',
  inject_windsurf_account: () => ({ success: true }),

  // Kiro commands
  list_kiro_accounts: () => listAccounts('kiro'),
  delete_kiro_account: ({ id }) => deleteAccount('kiro', id as string),
  delete_kiro_accounts: ({ ids }) => deleteAccounts('kiro', ids as string[]),
  import_kiro_from_json: (args) => addAccount('kiro', args),
  import_kiro_from_local: () => [],
  export_kiro_accounts: () => listAccounts('kiro'),
  refresh_kiro_token: ({ id }) => refreshQuota('kiro', id as string),
  refresh_all_kiro_tokens: () => refreshAllQuotas('kiro'),
  kiro_oauth_login_start: () => startOAuthLogin('kiro'),
  kiro_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('kiro', loginId as string, code as string),
  kiro_oauth_login_cancel: () => ({ cancelled: true }),
  kiro_oauth_submit_callback_url: ({ url }) => {
    const urlObj = new URL(url as string);
    const code = urlObj.searchParams.get('code') || '';
    return completeOAuthLogin('kiro', uuidv4(), code);
  },
  add_kiro_account_with_token: (args) => addAccount('kiro', args),
  update_kiro_account_tags: () => ({ success: true }),
  get_kiro_accounts_index_path: () => '/mock/path/kiro/accounts.json',
  inject_kiro_account: () => ({ success: true }),

  // Cursor commands
  list_cursor_accounts: () => listAccounts('cursor'),
  delete_cursor_account: ({ id }) => deleteAccount('cursor', id as string),
  delete_cursor_accounts: ({ ids }) => deleteAccounts('cursor', ids as string[]),
  import_cursor_from_json: (args) => addAccount('cursor', args),
  import_cursor_from_local: () => [],
  export_cursor_accounts: () => listAccounts('cursor'),
  refresh_cursor_token: ({ id }) => refreshQuota('cursor', id as string),
  refresh_all_cursor_tokens: () => refreshAllQuotas('cursor'),
  cursor_oauth_login_start: () => startOAuthLogin('cursor'),
  cursor_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('cursor', loginId as string, code as string),
  cursor_oauth_login_cancel: () => ({ cancelled: true }),
  add_cursor_account_with_token: (args) => addAccount('cursor', args),
  update_cursor_account_tags: () => ({ success: true }),
  inject_cursor_account: () => ({ success: true }),

  // Gemini commands
  list_gemini_accounts: () => listAccounts('gemini'),
  delete_gemini_account: ({ id }) => deleteAccount('gemini', id as string),
  delete_gemini_accounts: ({ ids }) => deleteAccounts('gemini', ids as string[]),
  import_gemini_from_json: (args) => addAccount('gemini', args),
  import_gemini_from_local: () => [],
  export_gemini_accounts: () => listAccounts('gemini'),
  refresh_gemini_token: ({ id }) => refreshQuota('gemini', id as string),
  refresh_all_gemini_tokens: () => refreshAllQuotas('gemini'),
  gemini_oauth_login_start: () => startOAuthLogin('gemini'),
  gemini_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('gemini', loginId as string, code as string),
  gemini_oauth_login_cancel: () => ({ cancelled: true }),
  add_gemini_account_with_token: (args) => addAccount('gemini', args),
  update_gemini_account_tags: () => ({ success: true }),

  // CodeBuddy commands
  list_codebuddy_accounts: () => listAccounts('codebuddy'),
  delete_codebuddy_account: ({ id }) => deleteAccount('codebuddy', id as string),
  delete_codebuddy_accounts: ({ ids }) => deleteAccounts('codebuddy', ids as string[]),
  import_codebuddy_from_json: (args) => addAccount('codebuddy', args),
  import_codebuddy_from_local: () => [],
  export_codebuddy_accounts: () => listAccounts('codebuddy'),
  refresh_codebuddy_token: ({ id }) => refreshQuota('codebuddy', id as string),
  refresh_all_codebuddy_tokens: () => refreshAllQuotas('codebuddy'),
  add_codebuddy_account_with_token: (args) => addAccount('codebuddy', args),
  update_codebuddy_account_tags: () => ({ success: true }),
  inject_codebuddy_account: () => ({ success: true }),

  // CodeBuddy CN commands
  list_codebuddy_cn_accounts: () => listAccounts('codebuddy_cn'),
  delete_codebuddy_cn_account: ({ id }) => deleteAccount('codebuddy_cn', id as string),
  delete_codebuddy_cn_accounts: ({ ids }) => deleteAccounts('codebuddy_cn', ids as string[]),
  import_codebuddy_cn_from_json: (args) => addAccount('codebuddy_cn', args),
  export_codebuddy_cn_accounts: () => listAccounts('codebuddy_cn'),
  refresh_codebuddy_cn_token: ({ id }) => refreshQuota('codebuddy_cn', id as string),
  refresh_all_codebuddy_cn_tokens: () => refreshAllQuotas('codebuddy_cn'),
  add_codebuddy_cn_account_with_token: (args) => addAccount('codebuddy_cn', args),
  update_codebuddy_cn_account_tags: () => ({ success: true }),

  // Qoder commands
  list_qoder_accounts: () => listAccounts('qoder'),
  delete_qoder_account: ({ id }) => deleteAccount('qoder', id as string),
  delete_qoder_accounts: ({ ids }) => deleteAccounts('qoder', ids as string[]),
  import_qoder_from_json: (args) => addAccount('qoder', args),
  import_qoder_from_local: () => [],
  export_qoder_accounts: () => listAccounts('qoder'),
  refresh_qoder_token: ({ id }) => refreshQuota('qoder', id as string),
  refresh_all_qoder_tokens: () => refreshAllQuotas('qoder'),
  qoder_oauth_login_start: () => startOAuthLogin('qoder'),
  qoder_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('qoder', loginId as string, code as string),
  qoder_oauth_login_cancel: () => ({ cancelled: true }),
  add_qoder_account_with_token: (args) => addAccount('qoder', args),
  update_qoder_account_tags: () => ({ success: true }),
  inject_qoder_account: () => ({ success: true }),

  // Trae commands
  list_trae_accounts: () => listAccounts('trae'),
  delete_trae_account: ({ id }) => deleteAccount('trae', id as string),
  delete_trae_accounts: ({ ids }) => deleteAccounts('trae', ids as string[]),
  import_trae_from_json: (args) => addAccount('trae', args),
  import_trae_from_local: () => [],
  export_trae_accounts: () => listAccounts('trae'),
  refresh_trae_token: ({ id }) => refreshQuota('trae', id as string),
  refresh_all_trae_tokens: () => refreshAllQuotas('trae'),
  trae_oauth_login_start: () => startOAuthLogin('trae'),
  trae_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('trae', loginId as string, code as string),
  trae_oauth_login_cancel: () => ({ cancelled: true }),
  add_trae_account_with_token: (args) => addAccount('trae', args),
  update_trae_account_tags: () => ({ success: true }),
  inject_trae_account: () => ({ success: true }),

  // Zed commands
  list_zed_accounts: () => listAccounts('zed'),
  delete_zed_account: ({ id }) => deleteAccount('zed', id as string),
  delete_zed_accounts: ({ ids }) => deleteAccounts('zed', ids as string[]),
  import_zed_from_json: (args) => addAccount('zed', args),
  export_zed_accounts: () => listAccounts('zed'),
  refresh_zed_token: ({ id }) => refreshQuota('zed', id as string),
  refresh_all_zed_tokens: () => refreshAllQuotas('zed'),
  zed_oauth_login_start: () => startOAuthLogin('zed'),
  zed_oauth_login_complete: ({ loginId, code }) => completeOAuthLogin('zed', loginId as string, code as string),
  zed_oauth_login_cancel: () => ({ cancelled: true }),
  add_zed_account_with_token: (args) => addAccount('zed', args),
  update_zed_account_tags: () => ({ success: true }),

  // WorkBuddy commands
  list_workbuddy_accounts: () => listAccounts('workbuddy'),
  delete_workbuddy_account: ({ id }) => deleteAccount('workbuddy', id as string),
  delete_workbuddy_accounts: ({ ids }) => deleteAccounts('workbuddy', ids as string[]),
  import_workbuddy_from_json: (args) => addAccount('workbuddy', args),
  export_workbuddy_accounts: () => listAccounts('workbuddy'),
  refresh_workbuddy_token: ({ id }) => refreshQuota('workbuddy', id as string),
  refresh_all_workbuddy_tokens: () => refreshAllQuotas('workbuddy'),
  add_workbuddy_account_with_token: (args) => addAccount('workbuddy', args),
  update_workbuddy_account_tags: () => ({ success: true }),

  // Instance commands
  get_instance_defaults: () => ({ name: 'New Instance', platform: 'antigravity' }),
  list_instances: () => {
    const rows = db.prepare('SELECT * FROM instances').all() as { id: string; platform: string; name: string; account_id: string | null; data: string; status: string; created_at: number; updated_at: number }[];
    return rows.map(r => ({ id: r.id, platform: r.platform, name: r.name, accountId: r.account_id, status: r.status, ...JSON.parse(r.data) }));
  },
  create_instance: (args) => {
    const id = uuidv4();
    const now = Date.now();
    const { name, platform, accountId, ...rest } = args;
    const data = JSON.stringify(rest);
    db.prepare('INSERT INTO instances (id, platform, name, account_id, data, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, platform, name, accountId ?? null, data, 'stopped', now, now);
    return { id, ...args, status: 'stopped' };
  },
  update_instance: ({ id, ...rest }) => {
    const data = JSON.stringify(rest);
    db.prepare('UPDATE instances SET data = ?, updated_at = ? WHERE id = ?').run(data, Date.now(), id);
    return { id, ...rest };
  },
  delete_instance: ({ id }) => {
    db.prepare('DELETE FROM instances WHERE id = ?').run(id);
    return { success: true };
  },
  start_instance: ({ id }) => {
    db.prepare('UPDATE instances SET status = ?, updated_at = ? WHERE id = ?').run('running', Date.now(), id);
    return { success: true };
  },
  stop_instance: ({ id }) => {
    db.prepare('UPDATE instances SET status = ?, updated_at = ? WHERE id = ?').run('stopped', Date.now(), id);
    return { success: true };
  },
  open_instance_window: () => null,
  close_all_instances: () => ({ success: true }),

  // Config commands
  save_general_config: (args) => {
    setConfig('general_config', JSON.stringify(args));
    return { success: true };
  },
  get_general_config: () => {
    const config = getConfig('general_config');
    return config ? JSON.parse(config) : {};
  },
  get_network_config: () => ({ proxy: null, timeout: 30000 }),
  save_update_settings: (args) => {
    setConfig('update_settings', JSON.stringify(args));
    return { success: true };
  },
  get_update_settings: () => {
    const config = getConfig('update_settings');
    return config ? JSON.parse(config) : { autoCheck: true, channel: 'stable' };
  },
  update_last_check_time: () => {
    setConfig('last_check_time', new Date().toISOString());
    return { success: true };
  },
  save_text_file: ({ path, content }) => {
    const fs = require('fs');
    fs.writeFileSync(path as string, content as string);
    return { success: true };
  },
  handle_window_close: () => null,
  update_log: () => null,
  set_app_path: () => ({ success: true }),
  get_provider_current_account_id: ({ platform }) => getConfig(`current_account_${platform}`) ?? null,
  save_tray_platform_layout: () => ({ success: true }),
  save_codex_model_providers: (args) => {
    setConfig('codex_model_providers', JSON.stringify(args));
    return { success: true };
  },
  logs_get_snapshot: () => [],
  logs_open_log_directory: () => null,
  wakeup_sync_state: () => null,
  refresh_current_quota: () => refreshQuota('antigravity'),
  refresh_current_codex_quota: () => refreshQuota('codex'),
  codex_local_access_get_state: () => ({ enabled: false }),

  // Group commands
  save_group_settings: (args) => {
    const id = uuidv4();
    const now = Date.now();
    const { name, platform, ...rest } = args;
    const data = JSON.stringify(rest);
    db.prepare('INSERT INTO groups (id, name, platform, data, sort_order, created_at) VALUES (?, ?, ?, ?, 0, ?)').run(id, name, platform ?? null, data, now);
    return { id, ...args };
  },
  set_model_group: () => ({ success: true }),
  remove_model_group: ({ id }) => {
    db.prepare('DELETE FROM groups WHERE id = ?').run(id);
    return { success: true };
  },
  set_group_name: ({ id, name }) => {
    db.prepare('UPDATE groups SET name = ? WHERE id = ?').run(name, id);
    return { success: true };
  },
  delete_group: ({ id }) => {
    db.prepare('DELETE FROM groups WHERE id = ?').run(id);
    return { success: true };
  },
  update_group_order: ({ orderedIds }) => {
    const stmt = db.prepare('UPDATE groups SET sort_order = ? WHERE id = ?');
    (orderedIds as string[]).forEach((id, index) => stmt.run(index, id));
    return { success: true };
  },

  // Floating card commands (stubs for browser)
  show_floating_card_window: () => null,
  show_instance_floating_card_window: () => null,
  get_floating_card_context: () => null,
  hide_floating_card_window: () => null,
  hide_current_floating_card_window: () => null,
  set_floating_card_always_on_top: () => null,
  set_current_floating_card_window_always_on_top: () => null,
  set_floating_card_confirm_on_close: () => null,
  save_floating_card_position: () => null,
  show_main_window_and_navigate: () => null,

  // Wakeup commands
  codex_wakeup_clear_history: () => null,
  codex_wakeup_cancel_scope: () => null,
  codex_wakeup_release_scope: () => null,

  // Announcement/Ad commands
  get_announcement: () => null,
  get_top_right_ad: () => null,

  // Backup commands
  get_scheduled_backup_config: () => ({ enabled: false, interval: 'daily' }),
  save_scheduled_backup_config: (args) => {
    setConfig('backup_config', JSON.stringify(args));
    return { success: true };
  },
  run_backup_now: () => ({ success: true, timestamp: Date.now() }),

  // Data transfer commands
  export_all_data: () => ({
    accounts: listAccounts('antigravity'),
    codexAccounts: listAccounts('codex'),
    groups: db.prepare('SELECT * FROM groups').all(),
    fingerprints: db.prepare('SELECT * FROM fingerprints').all(),
    config: db.prepare('SELECT * FROM config').all(),
  }),
  import_all_data: (args) => {
    const data = args as Record<string, unknown>;
    if (data.accounts) {
      (data.accounts as Record<string, unknown>[]).forEach((a) => addAccount('antigravity', a));
    }
    return { success: true };
  },
};
