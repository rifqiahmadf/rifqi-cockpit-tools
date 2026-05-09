use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::AppHandle;

pub struct RestApiServer {
    pub port: u16,
    pub running: bool,
}

impl RestApiServer {
    pub fn new(port: u16) -> Self {
        Self { port, running: false }
    }
}

#[derive(Debug, Deserialize)]
pub struct ApiRequest {
    pub command: String,
    #[serde(default)]
    pub args: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl ApiResponse {
    pub fn success(result: serde_json::Value) -> Self {
        Self { success: true, result: Some(result), error: None }
    }
    pub fn error(message: String) -> Self {
        Self { success: false, result: None, error: Some(message) }
    }
}

pub async fn init_rest_api(app_handle: AppHandle) {
    let port = 19529;
    
    tokio::spawn(async move {
        if let Err(e) = start_server(app_handle, port).await {
            tracing::error!("[REST API] Server failed: {}", e);
        }
    });
    
    tracing::info!("[REST API] Service started on port {}", port);
}

async fn start_server(app: AppHandle, port: u16) -> Result<(), String> {
    use tokio::net::TcpListener;
    use tokio::io::AsyncReadExt;

    let addr = format!("127.0.0.1:{}", port);
    let listener = TcpListener::bind(&addr).await.map_err(|e| e.to_string())?;
    
    tracing::info!("[REST API] Listening on {}", addr);

    loop {
        match listener.accept().await {
            Ok((mut stream, _)) => {
                let app = app.clone();
                tokio::spawn(async move {
                    let mut buf = [0u8; 4096];
                    if let Ok(n) = stream.read(&mut buf).await {
                        if n > 0 {
                            let request = String::from_utf8_lossy(&buf[..n]);
                            let response = handle_request(&app, &request).await;
                            let _ = stream.write_all(response.as_bytes()).await;
                        }
                    }
                });
            }
            Err(e) => {
                tracing::error!("[REST API] Accept failed: {}", e);
            }
        }
    }
}

async fn handle_request(app: &AppHandle, request: &str) -> String {
    let lines: Vec<&str> = request.lines().collect();
    if lines.is_empty() {
        return not_found();
    }

    let parts: Vec<&str> = lines.first().unwrap_or(&"").split_whitespace().collect();
    if parts.len() < 2 {
        return not_found();
    }

    let method = parts[0];
    let path = parts[1];

    let mut body = String::new();
    if let Some(pos) = request.find("\r\n\r\n") {
        body = request[pos + 4..].to_string();
    }

    match (method, path) {
        ("POST", "/api/commands") => {
            match serde_json::from_str::<ApiRequest>(&body) {
                Ok(req) => {
                    let result = invoke_command(app, &req.command, req.args).await;
                    match result {
                        Ok(v) => json_response(ApiResponse::success(v)),
                        Err(e) => json_response(ApiResponse::error(e)),
                    }
                }
                Err(e) => json_response(ApiResponse::error(format!("Invalid request: {}", e))),
            }
        }
        ("GET", "/api/status") => {
            json_response(ApiResponse::success(serde_json::json!({
                "status": "running",
                "version": env!("CARGO_PKG_VERSION"),
                "endpoints": ["GET /api/status", "POST /api/commands"]
            })))
        }
        ("GET", "/api/commands") => {
            json_response(ApiResponse::success(serde_json::json!({
                "commands": [
                    {"name": "list_accounts", "category": "account"},
                    {"name": "add_account", "category": "account"},
                    {"name": "delete_account", "category": "account"},
                    {"name": "switch_account", "category": "account"},
                    {"name": "get_current_account", "category": "account"},
                    {"name": "fetch_account_quota", "category": "account"},
                    {"name": "refresh_all_quotas", "category": "account"},
                    {"name": "list_instances", "category": "instance"},
                    {"name": "create_instance", "category": "instance"},
                    {"name": "start_instance", "category": "instance"},
                    {"name": "stop_instance", "category": "instance"},
                    {"name": "delete_instance", "category": "instance"},
                    {"name": "list_fingerprints", "category": "device"},
                    {"name": "generate_new_fingerprint", "category": "device"},
                    {"name": "apply_fingerprint", "category": "device"},
                    {"name": "start_oauth_login", "category": "oauth"},
                    {"name": "complete_oauth_login", "category": "oauth"},
                ]
            })))
        }
        ("GET", "/api/health") => {
            json_response(ApiResponse::success(serde_json::json!({"status": "ok"})))
        }
        _ => not_found(),
    }
}

async fn invoke_command(app: &AppHandle, command: &str, args: HashMap<String, serde_json::Value>) -> Result<serde_json::Value, String> {
    let args_value = serde_json::Value::Object(args.into_iter().map(|(k, v)| (k, v)).collect());
    match app.invoke::<serde_json::Value>(command, args_value).await {
        Ok(result) => Ok(result),
        Err(e) => Err(e.to_string()),
    }
}

fn json_response(response: ApiResponse) -> String {
    let body = serde_json::to_string(&response).unwrap_or_else(|_| "{}".to_string());
    format!("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\n\r\n{}", body.len(), body)
}

fn not_found() -> String {
    "HTTP/1.1 404 Not Found\r\nContent-Type: application/json\r\nContent-Length: 2\r\n\r\n{}".to_string()
}