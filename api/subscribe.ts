import type { VercelRequest, VercelResponse } from '@vercel/node';

const PUBLICATION_ID = 'pub_be00ffc6-3d80-4c15-980a-5228e1d8d8b1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body as { email?: string; name?: string };

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        ...(name && { first_name: name }),
        reactivate_existing: false,
        send_welcome_email: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json() as { message?: string };
    return res.status(response.status).json({ error: error.message || 'Subscription failed' });
  }

  return res.status(200).json({ success: true });
}
