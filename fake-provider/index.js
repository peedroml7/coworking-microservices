import express from 'express';
import { randomUUID } from 'node:crypto';

const PORT = process.env.PORT ?? 4000;
const CLIENT_ID = process.env.CLIENT_ID ?? 'practicas';
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? 'secret';
const TOKEN_TTL_SECONDS = 60;

const app = express();
app.use(express.json());

const tokens = new Map();
const sentByIdempotencyKey = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Logs every request so you can watch the retries arrive
app.use((req, res, next) => {
  res.on('finish', () =>
    console.log(`${new Date().toISOString()} ${req.method} ${req.path} -> ${res.statusCode}`),
  );
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// OAuth2 client credentials
app.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body ?? {};

  if (grant_type !== 'client_credentials') {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }
  if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  const accessToken = randomUUID();
  tokens.set(accessToken, Date.now() + TOKEN_TTL_SECONDS * 1000);

  res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: TOKEN_TTL_SECONDS });
});

const requireToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const expiresAt = tokens.get(token);

  if (!expiresAt || expiresAt < Date.now()) {
    return res.status(401).json({ error: 'invalid_or_expired_token' });
  }
  next();
};

// Picks the failure mode: forced with the x-fail header or random
const pickMode = (req) => {
  const forced = req.headers['x-fail'];
  if (forced) return forced;

  const roll = Math.random();
  if (roll < 0.3) return '500';
  if (roll < 0.45) return '429';
  if (roll < 0.6) return 'slow';
  return 'ok';
};

app.post('/send', requireToken, async (req, res) => {
  const { to, subject } = req.body ?? {};
  const idempotencyKey = req.headers['idempotency-key'];

  if (!to || !subject) {
    return res.status(400).json({ error: 'to and subject are required' });
  }

  if (idempotencyKey && sentByIdempotencyKey.has(idempotencyKey)) {
    return res.json({ ...sentByIdempotencyKey.get(idempotencyKey), duplicated: true });
  }

  const mode = pickMode(req);

  if (mode === '500') return res.status(500).json({ error: 'internal_error' });
  if (mode === '429') return res.status(429).set('Retry-After', '2').json({ error: 'rate_limited' });
  if (mode === '400') return res.status(400).json({ error: 'invalid_recipient' });
  if (mode === 'slow') await sleep(5000);

  const result = { id: randomUUID(), to, subject, status: 'sent' };
  if (idempotencyKey) sentByIdempotencyKey.set(idempotencyKey, result);

  res.status(201).json(result);
});

app.listen(PORT, () => console.log(`fake-provider listening on http://localhost:${PORT}`));
