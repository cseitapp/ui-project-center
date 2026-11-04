import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { createAuthSessionStore, getAuthSessionStore } = await jiti.import("../server/utils/authSessionStore.ts");

test("sessions can be stored, read and revoked without external services", async () => {
  const store = createAuthSessionStore();
  const record = { user: { USER_NAME: "test-user" }, expiresAt: Date.now() + 60_000 };
  await store.set("session-1", record, 60);
  await store.set("session-2", record, 60);
  assert.deepEqual(await store.get("session-1"), record);
  await store.delete("session-1");
  assert.equal(await store.get("session-1"), null);
  assert.deepEqual(await store.get("session-2"), record);
});

test("sessions expire at the earlier of record expiry and TTL", async () => {
  const store = createAuthSessionStore();
  const realNow = Date.now;
  let now = realNow();
  Date.now = () => now;
  try {
    await store.set("ttl", { user: { USER_NAME: "test" }, expiresAt: now + 60_000 }, 1);
    await store.set("record", { user: { USER_NAME: "test" }, expiresAt: now + 500 }, 60);
    now += 500;
    assert.equal(await store.get("record"), null);
    assert.ok(await store.get("ttl"));
    now += 500;
    assert.equal(await store.get("ttl"), null);
  } finally {
    Date.now = realNow;
  }
});

test("default store is shared within a process but a new store starts empty", async () => {
  const store = getAuthSessionStore();
  await store.set("session", { user: { USER_NAME: "test" }, expiresAt: Date.now() + 60_000 }, 60);
  assert.ok(await getAuthSessionStore().get("session"));
  assert.equal(await createAuthSessionStore().get("session"), null);
  await store.delete("session");
});
