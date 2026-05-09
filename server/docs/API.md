# Cockpit Tools API Documentation

## Overview

Cockpit Tools provides a RESTful API for managing AI IDE accounts across multiple platforms. The API follows a command-pattern architecture where all operations are executed through a unified `/api/invoke` endpoint.

## Accessing the Documentation

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3001/api/docs
```

### OpenAPI JSON Spec

The raw OpenAPI 3.0.0 specification is available at:

```
http://localhost:3001/api/docs.json
```

## API Endpoints

### System Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check endpoint |
| GET | `/api/version` | Get API version |

### Command Execution

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/invoke` | Execute a command |

### File System Operations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/fs/read?path=<path>` | Read file content |
| POST | `/api/fs/write` | Write file content |
| GET | `/api/fs/exists?path=<path>` | Check file existence |

### Real-time Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | SSE stream for real-time events |
| POST | `/api/events/emit` | Emit an event to subscribers |

## Using the Invoke Endpoint

The `/api/invoke` endpoint follows a command pattern where you specify the operation via the `command` field.

### Request Format

```json
{
  "command": "<command_name>",
  "args": {
    // Command-specific arguments
  }
}
```

### Response Format

```json
{
  "result": <command-specific-result>
}
```

### Error Response

```json
{
  "error": "<error-message>"
}
```

## Available Commands

### Account Management

List, create, update, and delete accounts for each platform.

#### List Accounts
```bash
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "list_accounts", "args": {"platform": "codex"}}'
```

#### Switch Account
```bash
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "switch_account", "args": {"platform": "codex", "id": "account-uuid"}}'
```

#### Delete Account
```bash
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "delete_account", "args": {"platform": "codex", "id": "account-uuid"}}'
```

### Platform-Specific Commands

Each platform has its own set of commands following this pattern:

| Platform | Command Prefix | Examples |
|----------|---------------|----------|
| Antigravity | `list_antigravity_*` | `list_antigravity_accounts`, `refresh_antigravity_token` |
| Codex | `list_codex_*`, `add_codex_*` | `list_codex_accounts`, `add_codex_account_with_token` |
| Windsurf | `list_windsurf_*` | `list_windsurf_accounts`, `refresh_windsurf_token` |
| Cursor | `list_cursor_*` | `list_cursor_accounts`, `refresh_cursor_token` |
| Kiro | `list_kiro_*` | `list_kiro_accounts`, `refresh_kiro_token` |
| Gemini CLI | `list_gemini_cli_*` | `list_gemini_cli_accounts` |
| CodeBuddy | `list_codebuddy_*` | `list_codebuddy_accounts` |
| CodeBuddy CN | `list_codebuddy_cn_*` | `list_codebuddy_cn_accounts` |
| Qoder | `list_qoder_*` | `list_qoder_accounts` |
| Trae | `list_trae_*` | `list_trae_accounts` |
| Zed | `list_zed_*` | `list_zed_accounts` |
| GitHub Copilot | `list_github_copilot_*` | `list_github_copilot_accounts` |
| WorkBuddy | `list_workbuddy_*` | `list_workbuddy_accounts` |

### Instance Management

Manage running instances of AI IDEs.

```bash
# List all instances
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "list_instances", "args": {}}'

# Create a new instance
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "create_instance", "args": {"platform": "codex", "name": "My Instance"}}'

# Start an instance
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "start_instance", "args": {"id": "instance-uuid"}}'
```

### Group Management

Organize accounts into groups.

```bash
# List groups
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "list_groups", "args": {}}'

# Create a group
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "create_group", "args": {"name": "Work Accounts", "platform": "codex"}}'
```

### Backup & Export

Export and import all account data.

```bash
# Export all data
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "export_all_data", "args": {}}'

# Import data
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"command": "import_all_data", "args": {"accounts": [...]}}'
```

## Data Models

### Account

```typescript
interface Account {
  id: string;           // UUID
  platform: string;     // Platform identifier
  email?: string;       // Account email
  name?: string;        // Display name
  quota?: Quota;        // Usage quota
  isCurrent: boolean;   // Currently active
  sortOrder: number;    // Display order
  createdAt: number;    // Unix timestamp (ms)
  updatedAt: number;    // Unix timestamp (ms)
}
```

### Quota

```typescript
interface Quota {
  used: number;         // Amount used
  total: number;        // Total available
  resetAt?: number;     // Reset timestamp (ms)
}
```

### Instance

```typescript
interface Instance {
  id: string;           // UUID
  platform: string;     // Platform identifier
  name: string;         // Instance name
  accountId?: string;   // Bound account ID
  status: 'running' | 'stopped' | 'error';
  createdAt: number;    // Unix timestamp (ms)
  updatedAt: number;    // Unix timestamp (ms)
}
```

### Group

```typescript
interface Group {
  id: string;           // UUID
  name: string;         // Group name
  platform?: string;    // Associated platform
  sortOrder: number;    // Display order
  createdAt: number;    // Unix timestamp (ms)
}
```

### Fingerprint

```typescript
interface Fingerprint {
  id: string;           // UUID
  name: string;         // Fingerprint name
  data: object;         // Fingerprint data
  isCurrent: boolean;   // Currently in use
  createdAt: number;    // Unix timestamp (ms)
  updatedAt: number;    // Unix timestamp (ms)
}
```

## Server-Sent Events (SSE)

Connect to the event stream to receive real-time updates:

```javascript
const eventSource = new EventSource('http://localhost:3001/api/events?events=account-switched,account-added');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};
```

### Available Events

| Event | Description |
|-------|-------------|
| `account-switched` | Account was switched |
| `account-added` | New account was added |
| `account-deleted` | Account was deleted |
| `accounts-deleted` | Multiple accounts deleted |

## Starting the Server

```bash
cd server
npm install
npm run dev     # Development mode with hot reload
npm run build   # Build for production
npm start       # Start production server
```

## License

This API is part of Cockpit Tools and is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
