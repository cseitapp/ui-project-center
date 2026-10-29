# Community Redis Session and OIDC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Community login sessions and OIDC state in Redis so auto-login survives restarts and works across replicas.

**Architecture:** Retain sealed opaque session cookies while replacing process-local maps with Redis. Configure `oidc-provider` with a namespaced Redis adapter whose records and indexes share bounded TTLs.

**Tech Stack:** Nuxt 4, H3, oidc-provider 9, ioredis 5, Docker Compose, Node test runner

**Spec:** `docs/superpowers/specs/2026-10-29-community-redis-oidc-design.md`

## Global Constraints

- Redis stays private and persistent; production has no in-memory fallback.
- Browser cookie behavior and public OIDC routes remain unchanged.
- Existing users log in once after migration; secrets are never committed.

## Review Focus

- Redis outage fails closed without leaking connection details.
- Expired or updated records remove stale indexes and cookies.
- Grant revocation removes every related token.
- Separate replicas observe the same session and OIDC state.

### Task 1: Redis runtime and session store

**Files:** Create `server/utils/redisClient.ts`, `server/utils/authSessionStore.ts`; modify `server/utils/authSession.ts`, `nuxt.config.ts`; test `tests/auth-session.test.mjs`.

- [ ] Write failing tests for shared persistence, TTL expiry, and logout deletion.
- [ ] Implement validated Redis access and replace `activeSessions` with async store operations.
- [ ] Run targeted and full tests.

### Task 2: oidc-provider Redis adapter

**Files:** Create `server/utils/oidcRedisAdapter.ts`; modify `server/utils/oidcProvider.ts`, `server/utils/oidcConfig.ts`; test `tests/oidc-provider.test.mjs`.

- [ ] Write failing contract tests for records, consume, indexes, expiry, destroy, and grant revocation.
- [ ] Implement the namespaced adapter and inject it into provider configuration.
- [ ] Run targeted and full tests.

### Task 3: Deployment and documentation

**Files:** Modify `package.json`, `package-lock.json`, `compose.yaml`, `.env.example`, `README.md`; test `tests/deployment-security.test.mjs`.

- [ ] Write failing tests for a private persistent health-checked Redis service and documented variables.
- [ ] Add ioredis, Compose configuration, environment examples, and operator guidance.
- [ ] Run targeted and full tests.

### Task 4: Production verification

- [ ] Run `npm test`, `npm run build`, and `git diff --check`.
- [ ] Review the scoped diff and report deployment commands plus the one-time re-login requirement.
