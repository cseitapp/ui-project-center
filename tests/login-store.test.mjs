import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";
import { createPinia, defineStore, setActivePinia } from "pinia";

globalThis.defineStore = defineStore;
globalThis.useNuxtApp = () => ({ $env: { serverProjectCenter: "/api/projectCenter" } });
globalThis.ResponseModelConvert = { toResponseModel: () => true };
const jiti = createJiti(import.meta.url);
const { useLoginStore } = await jiti.import("../app/stores/login.ts");

test("setLoginUser restores only the server-verified session profile", async () => {
  setActivePinia(createPinia());
  const calls = [];
  globalThis.$fetch = async (url) => {
    calls.push(url);
    return { USER_NAME: "CSE153", ROLE_CODE: "GENERAL" };
  };
  const store = useLoginStore();
  const result = await store.setLoginUser();
  assert.deepEqual(calls, ["/api/auth/session"]);
  assert.deepEqual(result, { USER_NAME: "CSE153", ROLE_CODE: "GENERAL" });
  assert.equal(store.user.USER_NAME, "CSE153");
});

test("setLoginUser clears stale state on unauthorized response", async () => {
  setActivePinia(createPinia());
  globalThis.$fetch = async () => {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  };
  const store = useLoginStore();
  store.user = { USER_NAME: "stale" };
  await assert.rejects(() => store.setLoginUser(), /Unauthorized/);
  assert.equal(store.user, null);
});

test("failed logout preserves the current local user", async () => {
  setActivePinia(createPinia());
  globalThis.$fetch = async () => {
    throw new Error("network unavailable");
  };
  const store = useLoginStore();
  store.user = { USER_NAME: "CSE153" };
  await assert.rejects(() => store.logOutSystem(), /network unavailable/);
  assert.equal(store.user.USER_NAME, "CSE153");
});

test("successful logout clears the local user after server revocation", async () => {
  setActivePinia(createPinia());
  const calls = [];
  globalThis.$fetch = async (url, options) => {
    calls.push({ url, options });
    return { message: "Logged out" };
  };
  const store = useLoginStore();
  store.user = { USER_NAME: "CSE153" };
  await store.logOutSystem();
  assert.equal(store.user, null);
  assert.deepEqual(calls, [{
    url: "/api/projectCenter/logout",
    options: { method: "POST", body: {} },
  }]);
});
