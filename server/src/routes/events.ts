import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addSSEClient, broadcastEvent } from '../services/event-bus.js';

const router = Router();

router.get('/', (req, res) => {
  const clientId = uuidv4();
  const channelParam = req.query.channel ?? req.query.events;
  const events = channelParam ? String(channelParam).split(',') : ['*'];
  addSSEClient(clientId, res, events);
});

router.post('/emit', (req, res) => {
  const { event, payload } = req.body;
  broadcastEvent(event, payload);
  res.json({ ok: true });
});

export default router;
