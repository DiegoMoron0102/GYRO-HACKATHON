// pages/api/rate-proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.dolarbluebolivia.click/api/exchange_currencies');
    if (!response.ok) {
      return res.status(response.status).end();
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'proxy_error' });
  }
}
