import express from 'express';
import cors from 'cors';
import invokeRouter from './routes/invoke.js';
import eventsRouter from './routes/events.js';
import fsRouter from './routes/fs.js';
import rustApiRouter from './routes/rust-api.js';
import { startHeartbeat } from './services/event-bus.js';
import { setupSwaggerUI } from './middleware/swagger.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
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
app.get('/api/health', (_, res) => res.json({ ok: true }));

/**
 * @openapi
 * /api/version:
 *   get:
 *     summary: Get API version
 *     description: Returns the current version of the Cockpit Tools API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Version information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   example: "0.22.20"
 *             example:
 *               version: "0.22.20"
 */
app.get('/api/version', (_, res) => res.json({ version: '0.22.20' }));

app.use('/api/invoke', invokeRouter);
app.use('/api/events', eventsRouter);
app.use('/api/fs', fsRouter);
app.use('/api', rustApiRouter);

setupSwaggerUI(app);

app.listen(PORT, () => {
  console.log(`Cockpit Tools API server running on port ${PORT}`);
  startHeartbeat();
});

export default app;
