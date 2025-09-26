import { Router } from 'express';
import { getPresignedUpload } from '../lib/s3';

const router = Router();

router.post('/presign', async (req, res) => {
  const { key, contentType } = req.body || {};
  if (!key || !contentType) return res.status(400).json({ error: 'key and contentType required' });
  const presign = await getPresignedUpload(key, contentType);
  res.json(presign);
});

export default router;




