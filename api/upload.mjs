// api/upload.mjs
import { put } from '@vercel/blob';
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { dataUrl, filename = `story-${Date.now()}.jpg` } = body;
    if (!dataUrl?.startsWith('data:image/')) return res.status(400).json({ error: 'Invalid dataUrl' });

    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const { url } = await put(`stories/${filename}`, buffer, {
      access: 'public', contentType: 'image/jpeg', addRandomSuffix: true,
    });
    return res.status(200).json({ url });
  } catch (e) {
    console.error('[upload] error:', e);
    return res.status(500).json({ error: e.message || 'upload failed' });
  }
}
