import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();

/**
 * @openapi
 * /api/fs/read:
 *   get:
 *     summary: Read file content
 *     description: Reads the content of a file from the filesystem
 *     tags: [FileSystem]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Absolute path to the file to read
 *         example: /home/user/data.json
 *     responses:
 *       200:
 *         description: File content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: The file content
 *             example:
 *               content: '{"key": "value"}'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "File not found"
 */
router.get('/read', async (req, res) => {
  try {
    const filePath = String(req.query.path || '');
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

/**
 * @openapi
 * /api/fs/write:
 *   post:
 *     summary: Write file content
 *     description: Writes content to a file on the filesystem
 *     tags: [FileSystem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [path, content]
 *             properties:
 *               path:
 *                 type: string
 *                 description: Absolute path to the file to write
 *                 example: /home/user/data.json
 *               content:
 *                 type: string
 *                 description: Content to write to the file
 *                 example: '{"key": "value"}'
 *           example:
 *             path: /home/user/data.json
 *             content: '{"key": "value"}'
 *     responses:
 *       200:
 *         description: File written successfully
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
 *       500:
 *         description: Error writing file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/write', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * @openapi
 * /api/fs/exists:
 *   get:
 *     summary: Check file existence
 *     description: Checks whether a file exists at the specified path
 *     tags: [FileSystem]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Absolute path to check
 *         example: /home/user/data.json
 *     responses:
 *       200:
 *         description: Existence check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Whether the file exists
 *             examples:
 *               fileExists:
 *                 value:
 *                   exists: true
 *               fileNotExists:
 *                 value:
 *                   exists: false
 */
router.get('/exists', async (req, res) => {
  try {
    const filePath = String(req.query.path || '');
    await fs.access(filePath);
    res.json({ exists: true });
  } catch {
    res.json({ exists: false });
  }
});

export default router;
