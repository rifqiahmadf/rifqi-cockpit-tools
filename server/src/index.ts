import express from 'express';
import cors from 'cors';
import invokeRouter from './routes/invoke.js';
import eventsRouter from './routes/events.js';
import fsRouter from './routes/fs.js';
import { startHeartbeat } from './services/event-bus.js';
import { setupSwaggerUI } from './middleware/swagger.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/version', (_, res) => res.json({ version: '0.22.20' }));

app.use('/api/invoke', invokeRouter);
app.use('/api/events', eventsRouter);
app.use('/api/fs', fsRouter);

setupSwaggerUI(app);

app.listen(PORT, () => {
  console.log(`Cockpit Tools API server running on port ${PORT}`);
  startHeartbeat();
});

export default app;
