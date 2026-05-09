import { Router } from 'express';
import { commandHandlers } from '../services/command-registry.js';

const router = Router();

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
