import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createJiti } from "jiti";
import * as h3 from "h3";

Object.assign(globalThis, h3);
const runtime = {
  authCookieName: "community-session",
  legacyAuthCookieName: "legacy-community-auth",
  authCookieKey: "previously-public-key",
  sessionPassword: "test-only-new-secret-0123456789abcdef0123456789abcdef",
  cookieLife: 60,
};
globalThis.useRuntimeConfig = () => runtime;
const jiti = createJiti(import.meta.url);

test("live Community sessions expose only a safe profile lookup and expire server-side", async () => {
  const { createAuthSession, findCommunityProfile } = await jiti.import("../server/utils/authSession.ts");
  const app = h3.createApp();
  app.use(h3.defineEventHandler(async (event) => {
    await createAuthSession(event, {
      USER_NAME: "CSE153",
      FULL_NAME_EN: "Test User",
      ROLE_CODE: "GENERAL",
      EMAIL: "test@example.com",
      PASSWORD: "must-not-leak",
    });
    return true;
  }));
  await h3.toWebHandler(app)(new Request("http://localhost/login"));

  assert.deepEqual(findCommunityProfile("CSE153"), {
    USER_NAME: "CSE153",
    FULL_NAME_EN: "Test User",
    ROLE_CODE: "GENERAL",
    EMAIL: "test@example.com",
  });
  assert.equal(findCommunityProfile("UNKNOWN"), null);

  const realNow = Date.now;
  Date.now = () => realNow() + 61_000;
  try {
    assert.equal(findCommunityProfile("CSE153"), null);
  } finally {
    Date.now = realNow;
  }
});

test("OIDC account claims use immutable USER_NAME as sub and allowlisted profile claims", async () => {
  const { buildOidcAccountClaims } = await jiti.import("../server/utils/oidcInteraction.ts");
  assert.deepEqual(buildOidcAccountClaims({
    USER_NAME: "CSE153",
    FULL_NAME_LA: "Test Lao",
    FULL_NAME_EN: "Test User",
    EMAIL: "test@example.com",
    ROLE_CODE: "ADMIN",
    PASSWORD: "must-not-leak",
  }), {
    sub: "CSE153",
    preferred_username: "CSE153",
    name: "Test Lao",
    email: "test@example.com",
    roles: ["ADMIN"],
  });
});

test("interaction planning resumes login, handles prompt=none, and rejects unregistered scopes", async () => {
  const { planOidcInteraction } = await jiti.import("../server/utils/oidcInteraction.ts");
  const profile = { USER_NAME: "CSE153", ROLE_CODE: "GENERAL" };

  assert.deepEqual(planOidcInteraction({
    uid: "opaque-uid",
    prompt: { name: "login", details: {} },
    params: {},
  }, null), {
    type: "redirect",
    location: "/?oidc_uid=opaque-uid",
  });
  assert.deepEqual(planOidcInteraction({
    uid: "opaque-uid",
    prompt: { name: "login", details: {} },
    params: { prompt: "none" },
  }, null), {
    type: "finish",
    result: { error: "login_required", error_description: "Community session required" },
  });
  assert.deepEqual(planOidcInteraction({
    uid: "opaque-uid",
    prompt: { name: "login", details: {} },
    params: {},
  }, profile), {
    type: "finish",
    result: { login: { accountId: "CSE153" } },
  });
  assert.deepEqual(planOidcInteraction({
    uid: "opaque-uid",
    prompt: { name: "consent", details: { missingOIDCScope: ["openid", "admin"] } },
    params: {},
  }, profile), {
    type: "finish",
    result: { error: "invalid_scope", error_description: "Requested scope is not allowed" },
  });
  assert.deepEqual(planOidcInteraction({
    uid: "opaque-uid",
    prompt: { name: "consent", details: {
      missingOIDCScope: ["openid", "profile", "email", "roles"],
      missingOIDCClaims: ["name", "email"],
    } },
    params: {},
  }, profile), {
    type: "consent",
    accountId: "CSE153",
    scopes: ["openid", "profile", "email", "roles"],
    claims: ["name", "email"],
  });
});

test("Community login resumes only an opaque OIDC interaction UID", async () => {
  const source = await readFile(new URL("../app/pages/index.vue", import.meta.url), "utf8");
  assert.match(source, /route\.query\.oidc_uid/);
  assert.match(source, /\/api\/oidc\/interaction\//);
  assert.match(source, /encodeURIComponent\(oidcUid\.value\)/);
});
