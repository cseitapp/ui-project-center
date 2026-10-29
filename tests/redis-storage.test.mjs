import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";
import { FakeRedis } from "./helpers/fake-redis.mjs";

const jiti = createJiti(import.meta.url);

test("Community session records are readable by a separate store instance", async () => {
  const { createAuthSessionStore } = await jiti.import("../server/utils/authSessionStore.ts");
  const redis = new FakeRedis();
  const writer = createAuthSessionStore(redis, "community:session:");
  const reader = createAuthSessionStore(redis, "community:session:");
  const record = { user: { USER_NAME: "CSE153", ROLE_CODE: "GENERAL" }, expiresAt: Date.now() + 60_000 };

  await writer.set("session-1", record, 60);

  assert.deepEqual(await reader.get("session-1"), record);
  assert.deepEqual(await reader.findProfile("cse153"), record.user);
  await reader.delete("session-1", "CSE153");
  assert.equal(await writer.get("session-1"), null);
  assert.equal(await writer.findProfile("CSE153"), null);
});

test("logging out one Community session preserves another session for the same user", async () => {
  const { createAuthSessionStore } = await jiti.import("../server/utils/authSessionStore.ts");
  const store = createAuthSessionStore(new FakeRedis(), "community:session:");
  const first = { user: { USER_NAME: "CSE153", ROLE_CODE: "GENERAL" }, expiresAt: Date.now() + 60_000 };
  const second = { user: { USER_NAME: "CSE153", ROLE_CODE: "ADMIN" }, expiresAt: Date.now() + 60_000 };
  await store.set("session-1", first, 60);
  await store.set("session-2", second, 60);

  await store.delete("session-1", "CSE153");

  assert.deepEqual(await store.findProfile("CSE153"), second.user);
});

test("OIDC Redis adapter shares records, consumption and secondary indexes", async () => {
  const { createOidcRedisAdapter } = await jiti.import("../server/utils/oidcRedisAdapter.ts");
  const redis = new FakeRedis();
  const Adapter = createOidcRedisAdapter(redis, "community:oidc:");
  const sessions = new Adapter("Session");
  const otherSessions = new Adapter("Session");

  await sessions.upsert("session-id", { uid: "session-uid", accountId: "CSE153" }, 60);
  assert.equal((await otherSessions.findByUid("session-uid")).accountId, "CSE153");
  await otherSessions.consume("session-id");
  assert.equal(typeof (await sessions.find("session-id")).consumed, "number");
  await sessions.destroy("session-id");
  assert.equal(await otherSessions.findByUid("session-uid"), undefined);
});

test("OIDC Redis adapter revokes every record associated with a grant", async () => {
  const { createOidcRedisAdapter } = await jiti.import("../server/utils/oidcRedisAdapter.ts");
  const redis = new FakeRedis();
  const Adapter = createOidcRedisAdapter(redis, "community:oidc:");
  const codes = new Adapter("AuthorizationCode");
  const tokens = new Adapter("AccessToken");

  await codes.upsert("code-1", { grantId: "grant-1" }, 60);
  await tokens.upsert("token-1", { grantId: "grant-1" }, 60);
  await codes.revokeByGrantId("grant-1");

  assert.equal(await codes.find("code-1"), undefined);
  assert.equal(await tokens.find("token-1"), undefined);
});
