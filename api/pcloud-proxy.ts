import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing or invalid url parameter' });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();
    res.setHeader('Content-Type', contentType);
    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from pCloud', details: (error as Error).message });
  }
} 