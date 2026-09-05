/* ==========================================================================
   TRIVARA — Server-side Database API (Vercel Serverless Function)
   Backed by Vercel Blob (durable object storage — persists on the free
   Hobby plan, unlike Upstash Redis' free RAM-only tier).

   GET  /api/db  -> { data: <object|null> }   (public, read-only)
   POST /api/db  -> { ok: true }              (requires x-admin-token header)
   ========================================================================== */

const { put, list } = require('@vercel/blob');

const DB_PATHNAME = 'trivara-db.json';

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { blobs } = await list({ prefix: DB_PATHNAME, limit: 1 });
            if (!blobs.length) {
                return res.status(200).json({ data: null });
            }
            const fileRes = await fetch(blobs[0].url, { cache: 'no-store' });
            if (!fileRes.ok) {
                return res.status(200).json({ data: null });
            }
            const data = await fileRes.json();
            return res.status(200).json({ data });
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
            await put(DB_PATHNAME, JSON.stringify(body), {
                access: 'public',
                contentType: 'application/json',
                addRandomSuffix: false,
                allowOverwrite: true,
                // 60 seconds is the minimum Vercel Blob allows. Saves may take
                // up to ~1 minute to be visible to other visitors — acceptable
                // for an admin panel that isn't edited in real time.
                cacheControlMaxAge: 60
            });
            return res.status(200).json({ ok: true });
        } catch (err) {
            console.error('DB POST error:', err);
            return res.status(500).json({ error: 'Gagal menyimpan data ke database.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
};

