import { Response } from 'express';

type SSEClient = { res: Response; events: Set<string> };

const clients = new Map<string, SSEClient>();

export function addSSEClient(id: string, res: Response, events: string[]): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();
  
  clients.set(id, { res, events: new Set(events) });
  
  res.write('data: {"type":"connected"}\n\n');

  res.on('close', () => {
    clients.delete(id);
  });
}

export function startHeartbeat(): void {
  setInterval(() => {
    const stale: string[] = [];
    for (const [id, client] of clients) {
      try {
        client.res.write(': keepalive\n\n');
      } catch {
        stale.push(id);
      }
    }
    stale.forEach((id) => clients.delete(id));
  }, 30_000);
}

export function broadcastEvent(event: string, payload: unknown): void {
  const data = JSON.stringify({ event, payload, id: Date.now(), windowLabel: 'main' });
  for (const [, client] of clients) {
    if (client.events.has(event) || client.events.has('*')) {
      client.res.write(`data: ${data}\n\n`);
    }
  }
}

export function broadcastToAll(event: string, payload: unknown): void {
  broadcastEvent(event, payload);
}
