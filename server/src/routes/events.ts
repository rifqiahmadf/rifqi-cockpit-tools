import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addSSEClient, broadcastEvent } from '../services/event-bus.js';

const router = Router();

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Subscribe to SSE event stream
 *     description: |
 *       Opens a Server-Sent Events (SSE) connection to receive real-time events.
 *       The connection stays open and sends heartbeat messages every 30 seconds.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: events
 *         schema:
 *           type: string
 *         description: Comma-separated list of event types to subscribe to (use * for all)
 *         example: "account-added,account-switched"
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *         description: Alternative parameter name for event types
 *         example: "account-added,account-switched"
 *     responses:
 *       200:
 *         description: SSE stream established
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: SSE event stream
 *             example: |
 *               event: heartbeat
 *               data: {"timestamp": 1234567890}
 *               
 *               event: account-switched
 *               data: {"platform":"codex","accountId":"550e8400-e29b-41d4-a716-446655440000"}
 */
router.get('/', (req, res) => {
  const clientId = uuidv4();
  const channelParam = req.query.channel ?? req.query.events;
  const events = channelParam ? String(channelParam).split(',') : ['*'];
  addSSEClient(clientId, res, events);
});

/**
 * @openapi
 * /api/events/emit:
 *   post:
 *     summary: Emit an event to all subscribers
 *     description: Broadcasts an event to all connected SSE clients
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event]
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event type name
 *                 example: "account-switched"
 *               payload:
 *                 type: object
 *                 description: Event payload data
 *           example:
 *             event: "account-switched"
 *             payload:
 *               platform: "codex"
 *               accountId: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Event emitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *             example:
 *               ok: true
 */
router.post('/emit', (req, res) => {
  const { event, payload } = req.body;
  broadcastEvent(event, payload);
  res.json({ ok: true });
});

export default router;
