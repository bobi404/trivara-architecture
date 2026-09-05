/* ==========================================================================
   TRIVARA — Server-side Database API (Vercel Serverless Function)
   GET  /api/db  -> { data: <object|null> }   (public, read-only)
   POST /api/db  -> { ok: true }              (requires x-admin-token header)
   ========================================================================== */

const { Redis } = require('@upstash/redis');

const DB_KEY = 'trivara_db';

// Redis.fromEnv() reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN,
// which Vercel injects automatically once you connect the Upstash Redis
// integration to this project (see setup instructions).
const redis = Redis.fromEnv();

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = await redis.get(DB_KEY);
            return res.status(200).json({ data: data || null });
        } catch (err) {
            console.error('DB GET error:', err);
            return res.status(500).json({ error: 'Gagal mengambil data dari database.' });
        }
    }

    if (req.method === 'POST') {
        const adminToken = process.env.ADMIN_API_TOKEN;
        const providedToken = req.headers['x-admin-token'];

        if (!adminToken) {
            console.error('ADMIN_API_TOKEN belum diset di environment variables.');
            return res.status(500).json({ error: 'Server belum dikonfigurasi (ADMIN_API_TOKEN kosong).' });
        }

        if (!providedToken || providedToken !== adminToken) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        const body = req.body;
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({ error: 'Payload data tidak valid.' });
        }

        try {
            await redis.set(DB_KEY, body);
            return res.status(200).json({ ok: true });
        } catch (err) {
            console.error('DB POST error:', err);
            return res.status(500).json({ error: 'Gagal menyimpan data ke database.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
};
