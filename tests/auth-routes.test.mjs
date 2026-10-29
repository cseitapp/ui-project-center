import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";
import * as h3 from "h3";

Object.assign(globalThis, h3);
const runtime = {
  authCookieName: "community-session",
  legacyAuthCookieName: "legacy-community-auth",
  authCookieKey: "previously-public-key",
  sessionPassword: "test-only-new-secret-0123456789abcdef0123456789abcdef",
  cookieLife: 3600,
  projectCenterPath: "https://project-center.test.invalid",
  projectCenterApiKey: "test-api-key",
  projectID: "COMMUNITY",
};
globalThis.useRuntimeConfig = () => runtime;
const jiti = createJiti(import.meta.url);
const authMiddleware = await jiti.import("../server/middleware/auth.ts", { default: true });

function appWith(handler) {
  const app = h3.createApp();
  app.use(authMiddleware);
  app.use(handler);
  return h3.toWebHandler(app);
}

async function login(upstreamResult) {
  globalThis.$fetch = async (url, options) => {
    assert.equal(url, `${runtime.projectCenterPath}/api/login`);
    assert.equal(options.headers["x-api-key"], runtime.projectCenterApiKey);
    return upstreamResult;
  };
  const handler = await jiti.import("../server/api/projectCenter/login.post.ts", { default: true });
  return appWith(handler)(new Request("http://localhost/api/projectCenter/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ userName: "CSE153", password: "test-password" }),
  }));
}

test("successful login strips upstream credentials and creates a sealed session", async () => {
  const response = await login({
    ERROR_CODE: "00",
    ERROR_DESC: "Success",
    TOKEN: "top-level-secret",
    DATA: [{
      USER_NAME: "CSE153",
      ROLE_CODE: "GENERAL",
      FULL_NAME_EN: "Test User",
      PASSWORD: "must-not-leak",
      TOKEN: "must-not-leak",
    }, { USER_NAME: "other", TOKEN: "extra-record-secret" }],
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ERROR_CODE: "00",
    ERROR_DESC: "Success",
    DATA: [{ USER_NAME: "CSE153", ROLE_CODE: "GENERAL", FULL_NAME_EN: "Test User" }],
  });
  const cookie = response.headers.getSetCookie().find((value) =>
    value.startsWith(`${runtime.authCookieName}=`),
  );
  assert.match(cookie, /HttpOnly/i);
});

test("upstream login rejection creates no Community session", async () => {
  const response = await login({
    ERROR_CODE: "01",
    ERROR_DESC: "Invalid login",
    TOKEN: "must-not-leak",
    DATA: [{ PASSWORD: "must-not-leak" }],
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ERROR_CODE: "01",
    ERROR_DESC: "Invalid login",
    DATA: [],
  });
  assert.equal(response.headers.getSetCookie().length, 0);
});

test("session endpoint requires a live server session", async () => {
  const handler = await jiti.import("../server/api/auth/session.get.ts", { default: true });
  const anonymous = await appWith(handler)(new Request("http://localhost/api/auth/session"));
  assert.equal(anonymous.status, 401);

  const loginResponse = await login({
    ERROR_CODE: "00",
    DATA: [{ USER_NAME: "CSE153", ROLE_CODE: "GENERAL", PASSWORD: "secret" }],
  });
  const cookie = loginResponse.headers.getSetCookie().find((value) =>
    value.startsWith(`${runtime.authCookieName}=`),
  ).split(";")[0];
  const authenticated = await appWith(handler)(new Request("http://localhost/api/auth/session", {
    headers: { cookie },
  }));
  assert.equal(authenticated.status, 200);
  assert.match(authenticated.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await authenticated.json(), { USER_NAME: "CSE153", ROLE_CODE: "GENERAL" });
});

test("profile is same-origin and never emits wildcard credential CORS", async () => {
  const handler = await jiti.import("../server/api/profile.get.ts", { default: true });
  const response = await appWith(handler)(new Request("http://localhost/api/profile", {
    headers: { origin: "https://attacker.invalid" },
  }));
  assert.equal(response.status, 401);
  assert.notEqual(response.headers.get("access-control-allow-origin"), "*");
  assert.notEqual(response.headers.get("access-control-allow-credentials"), "true");
});

test("logout revokes only Community authentication and preserves unrelated cookies", async () => {
  const loginResponse = await login({
    ERROR_CODE: "00",
    DATA: [{ USER_NAME: "CSE153", ROLE_CODE: "GENERAL" }],
  });
  const authCookie = loginResponse.headers.getSetCookie().find((value) =>
    value.startsWith(`${runtime.authCookieName}=`),
  ).split(";")[0];
  const handler = await jiti.import("../server/api/projectCenter/logout.post.ts", { default: true });
  const response = await appWith(handler)(new Request("http://localhost/api/projectCenter/logout", {
    method: "POST",
    headers: { cookie: `${authCookie}; theme=dark` },
  }));
  assert.equal(response.status, 200);
  const cookies = response.headers.getSetCookie();
  assert.ok(cookies.some((value) =>
    value.startsWith(`${runtime.authCookieName}=`) && /Max-Age=0/.test(value),
  ));
  assert.ok(!cookies.some((value) => value.startsWith("theme=")));
});
