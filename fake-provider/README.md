# fake-provider

API externa falsa que falla a propósito para practicar reintentos, timeouts, OAuth2 e idempotencia.

```
npm install
npm run dev   # http://localhost:4000
```

## Endpoints

- `GET /health`
- `POST /token` con `{ "grant_type": "client_credentials", "client_id": "practicas", "client_secret": "secret" }`. El token caduca a los 60 s.
- `POST /send` con `Authorization: Bearer <token>` y `{ "to": "...", "subject": "..." }`.

## Comportamiento de /send

- Aleatorio: 30 % 500, 15 % 429 con `Retry-After: 2`, 15 % tarda 5 s, resto 201.
- Cabecera `x-fail: 500 | 429 | 400 | slow | ok` para forzar un caso.
- Sin token o caducado: 401. Sin `to` o `subject`: 400.
- Cabecera `Idempotency-Key`: si se repite, devuelve el mismo envío con `duplicated: true`.
