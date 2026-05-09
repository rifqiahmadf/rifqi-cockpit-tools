import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();

router.get('/read', async (req, res) => {
  try {
    const filePath = String(req.query.path || '');
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

router.post('/write', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

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
