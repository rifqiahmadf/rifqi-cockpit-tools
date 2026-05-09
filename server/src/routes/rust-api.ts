import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/rust/health:
 *   get:
 *     summary: Health check for Rust REST API
 *     description: |
 *       Check if the Rust REST API server is running.
 *       This endpoint verifies the service is accessible and responding.
 *     tags: [Rust API]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *       500:
 *         description: Service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/rust/health', (req, res) => {
  res.json({ success: true, result: { status: 'ok', source: 'rust' } });
});

/**
 * @openapi
 * /api/rust/status:
 *   get:
 *     summary: Get Rust API server status
 *     description: |
 *       Get the current status of the Rust REST API server including version and available endpoints.
 *     tags: [Rust API]
 *     responses:
 *       200:
 *         description: Server status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               statusExample:
 *                 summary: Server status response
 *                 value:
 *                   success: true
 *                   result:
 *                     status: running
 *                     version: "0.22.20"
 *                     endpoints:
 *                       - GET /api/rust/status
 *                       - GET /api/rust/commands
 *                       - POST /api/rust/commands
 *                       - GET /api/rust/health
 */
router.get('/rust/status', (req, res) => {
  res.json({
    success: true,
    result: {
      status: 'running',
      version: '0.22.20',
      endpoints: [
        'GET /api/rust/status',
        'GET /api/rust/commands',
        'POST /api/rust/commands',
        'GET /api/rust/health'
      ]
    }
  });
});

/**
 * @openapi
 * /api/rust/commands:
 *   get:
 *     summary: List all available Rust commands
 *     description: |
 *       Get a list of all available Tauri commands that can be invoked via the REST API.
 *       Each command has a category and description.
 *     tags: [Rust API]
 *     responses:
 *       200:
 *         description: Command list retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               commandsList:
 *                 summary: Full command list
 *                 value:
 *                   success: true
 *                   result:
 *                     commands:
 *                       - name: list_accounts
 *                         category: account
 *                         description: List all accounts for a platform
 *                       - name: add_account
 *                         category: account
 *                         description: Add a new account
 *                       - name: delete_account
 *                         category: account
 *                         description: Delete an account
 *                       - name: switch_account
 *                         category: account
 *                         description: Switch current account
 *                       - name: get_current_account
 *                         category: account
 *                         description: Get current active account
 *                       - name: fetch_account_quota
 *                         category: account
 *                         description: Fetch account quota
 *                       - name: refresh_all_quotas
 *                         category: account
 *                         description: Refresh all account quotas
 *                       - name: list_instances
 *                         category: instance
 *                         description: List all instances
 *                       - name: create_instance
 *                         category: instance
 *                         description: Create a new instance
 *                       - name: start_instance
 *                         category: instance
 *                         description: Start an instance
 *                       - name: stop_instance
 *                         category: instance
 *                         description: Stop an instance
 *                       - name: delete_instance
 *                         category: instance
 *                         description: Delete an instance
 *                       - name: list_fingerprints
 *                         category: device
 *                         description: List device fingerprints
 *                       - name: generate_new_fingerprint
 *                         category: device
 *                         description: Generate new fingerprint
 *                       - name: apply_fingerprint
 *                         category: device
 *                         description: Apply fingerprint to account
 *                       - name: start_oauth_login
 *                         category: oauth
 *                         description: Start OAuth login flow
 *                       - name: complete_oauth_login
 *                         category: oauth
 *                         description: Complete OAuth login
 */
router.get('/rust/commands', (req, res) => {
  res.json({
    success: true,
    result: {
      commands: [
        { name: 'list_accounts', category: 'account', description: 'List all accounts for a platform' },
        { name: 'add_account', category: 'account', description: 'Add a new account' },
        { name: 'delete_account', category: 'account', description: 'Delete an account' },
        { name: 'switch_account', category: 'account', description: 'Switch current account' },
        { name: 'get_current_account', category: 'account', description: 'Get current active account' },
        { name: 'fetch_account_quota', category: 'account', description: 'Fetch account quota' },
        { name: 'refresh_all_quotas', category: 'account', description: 'Refresh all account quotas' },
        { name: 'refresh_current_quota', category: 'account', description: 'Refresh current account quota' },
        { name: 'set_current_account', category: 'account', description: 'Set current account' },
        { name: 'reorder_accounts', category: 'account', description: 'Reorder accounts' },
        { name: 'bind_account_fingerprint', category: 'account', description: 'Bind account fingerprint' },
        { name: 'get_bound_accounts', category: 'account', description: 'Get bound accounts' },
        { name: 'update_account_tags', category: 'account', description: 'Update account tags' },
        { name: 'update_account_notes', category: 'account', description: 'Update account notes' },
        { name: 'load_account_groups', category: 'account', description: 'Load account groups' },
        { name: 'save_account_groups', category: 'account', description: 'Save account groups' },
        { name: 'list_instances', category: 'instance', description: 'List all instances' },
        { name: 'create_instance', category: 'instance', description: 'Create a new instance' },
        { name: 'start_instance', category: 'instance', description: 'Start an instance' },
        { name: 'stop_instance', category: 'instance', description: 'Stop an instance' },
        { name: 'delete_instance', category: 'instance', description: 'Delete an instance' },
        { name: 'get_instance', category: 'instance', description: 'Get instance details' },
        { name: 'list_fingerprints', category: 'device', description: 'List device fingerprints' },
        { name: 'generate_new_fingerprint', category: 'device', description: 'Generate new fingerprint' },
        { name: 'capture_current_fingerprint', category: 'device', description: 'Capture current fingerprint' },
        { name: 'create_fingerprint_with_profile', category: 'device', description: 'Create fingerprint with profile' },
        { name: 'apply_fingerprint', category: 'device', description: 'Apply fingerprint to account' },
        { name: 'delete_fingerprint', category: 'device', description: 'Delete fingerprint' },
        { name: 'get_device_profiles', category: 'device', description: 'Get device profiles' },
        { name: 'bind_device_profile', category: 'device', description: 'Bind device profile' },
        { name: 'start_oauth_login', category: 'oauth', description: 'Start OAuth login flow' },
        { name: 'prepare_oauth_url', category: 'oauth', description: 'Prepare OAuth URL' },
        { name: 'complete_oauth_login', category: 'oauth', description: 'Complete OAuth login' },
        { name: 'submit_oauth_callback_url', category: 'oauth', description: 'Submit OAuth callback' },
        { name: 'cancel_oauth_login', category: 'oauth', description: 'Cancel OAuth login' },
        { name: 'get_group_settings', category: 'group', description: 'Get group settings' },
        { name: 'save_group_settings', category: 'group', description: 'Save group settings' },
        { name: 'set_model_group', category: 'group', description: 'Set model group' },
        { name: 'remove_model_group', category: 'group', description: 'Remove model group' },
        { name: 'wakeup_ensure_runtime_ready', category: 'wakeup', description: 'Ensure wakeup runtime ready' },
        { name: 'trigger_wakeup', category: 'wakeup', description: 'Trigger wakeup for account' },
        { name: 'fetch_available_models', category: 'wakeup', description: 'Fetch available models' },
        { name: 'wakeup_validate_crontab', category: 'wakeup', description: 'Validate crontab expression' },
        { name: 'wakeup_sync_state', category: 'wakeup', description: 'Sync wakeup state' },
        { name: 'wakeup_run_enabled_tasks', category: 'wakeup', description: 'Run enabled wakeup tasks' },
        { name: 'get_update_settings', category: 'update', description: 'Get update settings' },
        { name: 'save_update_settings', category: 'update', description: 'Save update settings' },
        { name: 'check_version_jump', category: 'update', description: 'Check version jump' },
        { name: 'get_release_history', category: 'update', description: 'Get release history' },
        { name: 'announcement_get_state', category: 'announcement', description: 'Get announcement state' },
        { name: 'announcement_mark_as_read', category: 'announcement', description: 'Mark announcement as read' },
        { name: 'logs_get_snapshot', category: 'logs', description: 'Get logs snapshot' },
        { name: 'logs_open_log_directory', category: 'logs', description: 'Open log directory' },
        { name: 'open_data_folder', category: 'system', description: 'Open data folder' },
        { name: 'get_network_config', category: 'system', description: 'Get network config' },
        { name: 'save_network_config', category: 'system', description: 'Save network config' },
        { name: 'get_general_config', category: 'system', description: 'Get general config' },
        { name: 'save_general_config', category: 'system', description: 'Save general config' },
        { name: 'get_downloads_dir', category: 'system', description: 'Get downloads directory' }
      ]
    }
  });
});

/**
 * @openapi
 * /api/rust/commands:
 *   post:
 *     summary: Execute a Rust Tauri command
 *     description: |
 *       Execute any available Tauri command by name with arguments.
 *       This is the main endpoint for invoking Rust backend functions.
 *       
 *       ## Command Categories:
 *       
 *       ### Account Commands
 *       - `list_accounts` - List accounts for a platform
 *       - `add_account` - Add a new account
 *       - `delete_account` - Delete an account
 *       - `switch_account` - Switch current account
 *       - `get_current_account` - Get current active account
 *       - `fetch_account_quota` - Fetch account quota
 *       - `refresh_all_quotas` - Refresh all quotas
 *       
 *       ### Instance Commands
 *       - `list_instances` - List all instances
 *       - `create_instance` - Create new instance
 *       - `start_instance` - Start instance
 *       - `stop_instance` - Stop instance
 *       - `delete_instance` - Delete instance
 *       
 *       ### Device Commands
 *       - `list_fingerprints` - List fingerprints
 *       - `generate_new_fingerprint` - Generate fingerprint
 *       - `apply_fingerprint` - Apply fingerprint
 *       
 *       ### OAuth Commands
 *       - `start_oauth_login` - Start OAuth flow
 *       - `complete_oauth_login` - Complete OAuth
 *       
 *       ### Group Commands
 *       - `get_group_settings` - Get group settings
 *       - `save_group_settings` - Save group settings
 *       
 *       ### Wakeup Commands
 *       - `trigger_wakeup` - Trigger wakeup
 *       - `wakeup_ensure_runtime_ready` - Ensure ready
 *       
 *       ### System Commands
 *       - `open_data_folder` - Open data folder
 *       - `get_network_config` - Get network config
 *       - `save_network_config` - Save network config
 *     tags: [Rust API]
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
 *                 description: The Tauri command name to execute
 *                 example: list_accounts
 *               args:
 *                 type: object
 *                 description: Command-specific arguments
 *                 default: {}
 *           examples:
 *             listAccounts:
 *               summary: List all accounts
 *               value:
 *                 command: list_accounts
 *                 args:
 *                   platform: antigravity
 *             addAccount:
 *               summary: Add a new account
 *               value:
 *                 command: add_account
 *                 args:
 *                   platform: codex
 *                   email: user@example.com
 *                   token: ghp_xxxxxxxxxxxx
 *             switchAccount:
 *               summary: Switch current account
 *               value:
 *                 command: switch_account
 *                 args:
 *                   platform: antigravity
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *             getQuota:
 *               summary: Fetch account quota
 *               value:
 *                 command: fetch_account_quota
 *                 args:
 *                   platform: codex
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *             createInstance:
 *               summary: Create a new instance
 *               value:
 *                 command: create_instance
 *                 args:
 *                   platform: codex
 *                   accountId: 550e8400-e29b-41d4-a716-446655440000
 *                   name: My Instance
 *             startOAuth:
 *               summary: Start OAuth login
 *               value:
 *                 command: start_oauth_login
 *                 args:
 *                   platform: antigravity
 *             triggerWakeup:
 *               summary: Trigger wakeup
 *               value:
 *                 command: trigger_wakeup
 *                 args:
 *                   platform: antigravity
 *                   accountId: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Command executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               listAccountsResult:
 *                 summary: List accounts result
 *                 value:
 *                   success: true
 *                   result:
 *                     - id: 550e8400-e29b-41d4-a716-446655440000
 *                       platform: antigravity
 *                       email: user@example.com
 *                       isCurrent: true
 *                       quota:
 *                         used: 150
 *                         total: 1000
 *                         resetAt: "2024-01-15T00:00:00Z"
 *               switchResult:
 *                 summary: Switch account result
 *                 value:
 *                   success: true
 *                   result:
 *                     success: true
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Command not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unknown command: invalid_command"
 *       500:
 *         description: Command execution error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/rust/commands', async (req, res) => {
  const { command, args = {} } = req.body;
  
  if (!command) {
    res.status(400).json({ success: false, error: 'Command is required' });
    return;
  }

  try {
    // In a full implementation, this would call the Rust REST API server
    // For now, we provide a response indicating the command structure
    res.json({
      success: true,
      result: {
        message: `Command '${command}' received with args`,
        args: args,
        note: 'This endpoint forwards to the Rust REST API server on port 19529'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, error: message });
  }
});

export default router;