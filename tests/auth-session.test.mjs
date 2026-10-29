import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createJiti } from "jiti";
import CryptoJS from "crypto-js";
import * as h3 from "h3";
import { FakeRedis } from "./helpers/fake-redis.mjs";

Object.assign(globalThis, h3);
const runtime = {
  authCookieName: "community-session",
  legacyAuthCookieName: "legacy-community-auth",
  domain: ".cselao.la",
  authCookieKey: "previously-public-key",
  sessionPassword: "test-only-new-secret-0123456789abcdef0123456789abcdef",
  cookieLife: 3600,
};
globalThis.useRuntimeConfig = () => runtime;
const jiti = createJiti(import.meta.url);
const { createAuthSessionStore, setAuthSessionStoreForTests } = await jiti.import("../server/utils/authSessionStore.ts");
const testStore = createAuthSessionStore(new FakeRedis(), "community:test:");
setAuthSessionStoreForTests(testStore);

function appWith(...handlers) {
  const app = h3.createApp();
  for (const handler of handlers) app.use(handler);
  return h3.toWebHandler(app);
}

async function sessionApi() {
  return jiti.import("../server/utils/authSession.ts");
}

async function issueSession(user = {}) {
  const { createAuthSession } = await sessionApi();
  const response = await appWith(h3.defineEventHandler(async (event) => {
    await createAuthSession(event, {
      USER_NAME: "CSE153",
      ROLE_CODE: "GENERAL",
      FULL_NAME_EN: "Test User",
      PASSWORD: "must-not-leak",
      TOKEN: "must-not-leak",
      ...user,
    });
    return true;
  }))(new Request("http://localhost/login", { method: "POST" }));
  const cookie = response.headers.getSetCookie().find((value) =>
    value.startsWith(`${runtime.authCookieName}=`),
  );
  assert.ok(cookie);
  return cookie;
}

test("authentication secrets are never public", async () => {
  const source = await readFile(new URL("../nuxt.config.ts", import.meta.url), "utf8");
  const publicBlock = source.match(/public:\s*\{([\s\S]*?)\n\s*\},\n\s*\},/)?.[1] ?? "";
  assert.doesNotMatch(publicBlock, /authCookieKey|authUserKey|authCookieName|cookieLife/);
  assert.match(source, /sessionPassword:\s*""/);
  assert.match(source, /authCookieName:\s*"community-session"/);
});

test("missing, short, or legacy session password fails closed", async () => {
  const { createAuthSession } = await sessionApi();
  const previous = runtime.sessionPassword;
  try {
    for (const password of ["", "too-short", runtime.authCookieKey]) {
      runtime.sessionPassword = password;
      await assert.rejects(
        () => createAuthSession({}, { USER_NAME: "CSE153" }),
        /NUXT_SESSION_PASSWORD/,
      );
    }
  } finally {
    runtime.sessionPassword = previous;
  }
});

test("login session cookie is sealed HttpOnly and contains no profile", async () => {
  const cookie = await issueSession();
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  assert.doesNotMatch(cookie, /Domain=/i);
  assert.doesNotMatch(cookie, /CSE153|Test%20User|GENERAL/);
});

test("forged and legacy AES cookies fail closed", async () => {
  const authMiddleware = await jiti.import("../server/middleware/auth.ts", { default: true });
  const handler = h3.defineEventHandler((event) => {
    if (!event.context.auth) throw h3.createError({ statusCode: 401 });
    return event.context.auth;
  });
  const forged = CryptoJS.AES.encrypt(
    JSON.stringify({ USER_NAME: "admin", ROLE_CODE: "ADMIN" }),
    runtime.authCookieKey,
  ).toString();
  const response = await appWith(authMiddleware, handler)(new Request("http://localhost/auth", {
    headers: { cookie: `${runtime.legacyAuthCookieName}=${encodeURIComponent(forged)}` },
  }));
  assert.equal(response.status, 401);
  assert.ok(response.headers.getSetCookie().some((value) =>
    value.startsWith(`${runtime.legacyAuthCookieName}=`) &&
      /Max-Age=0/.test(value) &&
      /Domain=\.cselao\.la/i.test(value),
  ));
});

test("temporary Redis failure does not invalidate a valid browser session cookie", async () => {
  const cookie = (await issueSession()).split(";")[0];
  const authMiddleware = await jiti.import("../server/middleware/auth.ts", { default: true });
  setAuthSessionStoreForTests({
    get: async () => { throw new Error("redis unavailable"); },
    set: async () => {},
    findProfile: async () => null,
    delete: async () => {},
  });
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const response = await appWith(authMiddleware)(new Request("http://localhost/auth", {
      headers: { cookie },
    }));
    assert.equal(response.status, 500);
    assert.ok(!response.headers.getSetCookie().some((value) =>
      value.startsWith(`${runtime.authCookieName}=`) && /Max-Age=0/.test(value),
    ));
  } finally {
    console.error = originalConsoleError;
    setAuthSessionStoreForTests(testStore);
  }
});

test("expired server record deletes the retained browser cookie", async () => {
  const cookie = (await issueSession()).split(";")[0];
  const authMiddleware = await jiti.import("../server/middleware/auth.ts", { default: true });
  const handler = h3.defineEventHandler((event) => {
    if (!event.context.auth) throw h3.createError({ statusCode: 401 });
    return true;
  });
  const realNow = Date.now;
  Date.now = () => realNow() + 3_601_000;
  try {
    const response = await appWith(authMiddleware, handler)(new Request("http://localhost/auth", {
      headers: { cookie },
    }));
    assert.equal(response.status, 401);
    assert.ok(response.headers.getSetCookie().some((value) =>
      value.startsWith(`${runtime.authCookieName}=`) && /Max-Age=0/.test(value),
    ));
  } finally {
    Date.now = realNow;
  }
});

test("safe profile excludes upstream credentials", async () => {
  const { safeCommunityProfile } = await sessionApi();
  assert.deepEqual(safeCommunityProfile({
    USER_NAME: "CSE153",
    ROLE_CODE: "GENERAL",
    FULL_NAME_EN: "Test User",
    PASSWORD: "secret",
    TOKEN: "secret",
    API_KEY: "secret",
  }), {
    USER_NAME: "CSE153",
    ROLE_CODE: "GENERAL",
    FULL_NAME_EN: "Test User",
  });
});
