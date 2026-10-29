# Community Redis Session and OIDC Design

## Intent

Keep Community login and OIDC authorization valid across API restarts and multiple API replicas so E-Document can auto-login whenever the Community browser session is valid.

## Goals and constraints

- Persist Community sessions and all `oidc-provider` models in Redis with bounded TTLs.
- Preserve current cookies, public routes, client configuration, and E-Document flow.
- Fail closed when Redis is unavailable; never fall back to process memory.
- Keep Redis private to Docker and keep secrets in runtime environment variables.
- Existing in-memory sessions are not migrated; users log in once after deployment.

## Approaches

1. **Redis-backed opaque sessions plus Redis OIDC adapter (selected):** durable across restart and replicas, with small revocable cookies.
2. **Encrypted profile cookie:** no Redis for login state, but large cookies and poor revocation; it also does not persist OIDC state.
3. **Single replica/sticky sessions:** simpler but still loses state at restart and fails the reliability goal.

## Architecture

- `redisClient.ts` owns one lazy, validated ioredis connection.
- `authSessionStore.ts` stores safe profiles by opaque session ID; `authSession.ts` retains its sealed HttpOnly cookie and replaces its process `Map` with that store.
- `oidcRedisAdapter.ts` implements model storage, consume state, UID/user-code indexes, and grant revocation for `oidc-provider`.
- Docker Compose supplies a persistent health-checked Redis service without a published port.

## Error behavior and verification

Redis failures produce sanitized service errors. Missing or expired session records clear the browser cookie. Tests cover cross-instance reads, expiry, deletion, adapter indexes, consumption and grant revocation; deployment tests cover private persistent Redis. The full test suite and production build must pass.
