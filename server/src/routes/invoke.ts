import { Router } from 'express';
import { commandHandlers } from '../services/command-registry.js';

const router = Router();

/**
 * @openapi
 * /api/invoke:
 *   post:
 *     summary: Execute a command
 *     description: |
 *       Unified command endpoint for all platform operations.
 *       
 *       The `command` field determines the expected `args` schema.
 *       
 *       ## Available Commands by Category:
 *       
 *       ### Account Management
 *       - `list_accounts` - List accounts for a platform
 *       - `add_antigravity_account` - Add an Antigravity account
 *       - `add_codex_account_with_token` - Add a Codex account with token
 *       - `delete_account` - Delete an account
 *       - `delete_accounts` - Delete multiple accounts
 *       - `switch_account` - Switch current account
 *       - `refresh_quota` - Refresh account quota
 *       - `refresh_all_quotas` - Refresh all account quotas
 *       - `get_current_account` - Get current active account
 *       - `reorder_accounts` - Reorder accounts
 *       - `start_oauth_login` - Start OAuth login flow
 *       - `complete_oauth_login` - Complete OAuth login
 *       
 *       ### Instance Management
 *       - `list_instances` - List all instances
 *       - `create_instance` - Create a new instance
 *       - `start_instance` - Start an instance
 *       - `stop_instance` - Stop an instance
 *       - `delete_instance` - Delete an instance
 *       - `get_instance` - Get instance details
 *       
 *       ### Groups & Fingerprints
 *       - `list_groups` - List all groups
 *       - `create_group` - Create a new group
 *       - `delete_group` - Delete a group
 *       - `update_group_order` - Update group order
 *       - `list_fingerprints` - List device fingerprints
 *       - `create_fingerprint` - Create a fingerprint
 *       - `delete_fingerprint` - Delete a fingerprint
 *       
 *       ### Backup & Export
 *       - `export_all_data` - Export all data
 *       - `import_all_data` - Import data
 *       - `get_scheduled_backup_config` - Get backup config
 *       - `save_scheduled_backup_config` - Save backup config
 *       - `run_backup_now` - Run backup immediately
 *     tags: [Commands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [command]
 *             properties:
 *               command:
 *                 type: string
 *                 description: The command to execute
 *                 enum:
 *                   - list_accounts
 *                   - add_antigravity_account
 *                   - add_codex_account_with_token
 *                   - delete_account
 *                   - delete_accounts
 *                   - switch_account
 *                   - refresh_quota
 *                   - refresh_all_quotas
 *                   - get_current_account
 *                   - reorder_accounts
 *                   - start_oauth_login
 *                   - complete_oauth_login
 *                   - list_instances
 *                   - create_instance
 *                   - start_instance
 *                   - stop_instance
 *                   - delete_instance
 *                   - get_instance
 *                   - list_groups
 *                   - create_group
 *                   - delete_group
 *                   - update_group_order
 *                   - list_fingerprints
 *                   - create_fingerprint
 *                   - delete_fingerprint
 *                   - export_all_data
 *                   - import_all_data
 *                   - get_scheduled_backup_config
 *                   - save_scheduled_backup_config
 *                   - run_backup_now
 *               args:
 *                 type: object
 *                 description: Command-specific arguments
 *           examples:
 *             listAccounts:
 *               summary: List accounts for a platform
 *               value:
 *                 command: list_accounts
 *                 args:
 *                   platform: antigravity
 *             addCodexAccount:
 *               summary: Add a Codex account with token
 *               value:
 *                 command: add_codex_account_with_token
 *                 args:
 *                   token: ghp_xxxxxxxxxxxx
 *                   email: user@example.com
 *             switchAccount:
 *               summary: Switch current account
 *               value:
 *                 command: switch_account
 *                 args:
 *                   platform: codex
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *             listInstances:
 *               summary: List all instances
 *               value:
 *                 command: list_instances
 *                 args: {}
 *             createInstance:
 *               summary: Create a new instance
 *               value:
 *                 command: create_instance
 *                 args:
 *                   platform: codex
 *                   accountId: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "My Instance"
 *     responses:
 *       200:
 *         description: Command executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   description: Command-specific result
 *             examples:
 *               listAccountsResult:
 *                 summary: Result of list_accounts
 *                 value:
 *                   result:
 *                     - id: "550e8400-e29b-41d4-a716-446655440000"
 *                       platform: "codex"
 *                       email: "user@example.com"
 *                       isCurrent: true
 *               switchAccountResult:
 *                 summary: Result of switch_account
 *                 value:
 *                   result:
 *                     success: true
 *       404:
 *         description: Unknown command
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unknown command: invalid_command"
 *       500:
 *         description: Command execution error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/', async (req, res) => {
  const { command, args = {} } = req.body;
  
  const handler = commandHandlers[command];
  if (!handler) {
    console.warn(`Unknown command: ${command}`);
    res.status(404).json({ error: `Unknown command: ${command}` });
    return;
  }
  
  try {
    const result = await handler(args);
    res.json({ result: result ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
});

export default router;
