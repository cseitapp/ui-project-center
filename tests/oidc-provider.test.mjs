import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const privateKeyBase64 = Buffer.from(privateKey.export({
  type: "pkcs8",
  format: "pem",
})).toString("base64");

const validRuntime = {
  oidcIssuer: "https://community.cselao.la",
  oidcKeyId: "community-rs256-test",
  oidcPrivateKeyBase64: privateKeyBase64,
  oidcCodeLifetime: 60,
  oidcClientEdocumentId: "edocument",
  oidcClientEdocumentSecret: "test-client-secret-with-more-than-32-characters",
  oidcClientEdocumentRedirectUri: "https://edocument.cselao.la/api/auth/oidc/callback",
};

async function loadConfig(overrides = {}, nodeEnv = "production") {
  const { buildOidcConfig } = await jiti.import("../server/utils/oidcConfig.ts");
  return buildOidcConfig({ ...validRuntime, ...overrides }, nodeEnv);
}

test("OIDC configuration fails closed for missing or unsafe production values", async () => {
  const invalid = [
    ["oidcIssuer", ""],
    ["oidcIssuer", "http://community.cselao.la"],
    ["oidcKeyId", ""],
    ["oidcPrivateKeyBase64", ""],
    ["oidcPrivateKeyBase64", Buffer.from("not-a-private-key").toString("base64")],
    ["oidcCodeLifetime", 0],
    ["oidcCodeLifetime", 61],
    ["oidcClientEdocumentId", ""],
    ["oidcClientEdocumentSecret", "short"],
    ["oidcClientEdocumentRedirectUri", "http://edocument.cselao.la/api/auth/oidc/callback"],
    ["oidcClientEdocumentRedirectUri", "https://edocument.cselao.la/api/auth/callback"],
  ];

  for (const [key, value] of invalid) {
    await assert.rejects(
      () => loadConfig({ [key]: value }),
      (error) => error?.code !== "MODULE_NOT_FOUND" && /OIDC/i.test(error?.message ?? ""),
      key,
    );
  }
});

test("OIDC configuration publishes a code-only confidential client with S256 and RS256", async () => {
  const result = await loadConfig();
  assert.equal(result.issuer, validRuntime.oidcIssuer);
  assert.equal(result.configuration.ttl.AuthorizationCode, 60);
  assert.deepEqual(result.configuration.grantTypes, ["authorization_code"]);
  assert.deepEqual(result.configuration.responseTypes, ["code"]);
  assert.deepEqual(result.configuration.scopes, ["openid", "profile", "email", "roles"]);
  assert.equal(result.configuration.features.devInteractions.enabled, false);
  assert.equal(result.configuration.features.registration.enabled, false);
  assert.equal(result.configuration.pkce.required({}, {}), true);

  assert.deepEqual(result.configuration.clients, [{
    client_id: "edocument",
    client_secret: validRuntime.oidcClientEdocumentSecret,
    redirect_uris: ["https://edocument.cselao.la/api/auth/oidc/callback"],
    post_logout_redirect_uris: ["https://edocument.cselao.la/"],
    response_types: ["code"],
    grant_types: ["authorization_code"],
    token_endpoint_auth_method: "client_secret_basic",
  }]);
  assert.equal(result.configuration.jwks.keys.length, 1);
  assert.deepEqual(
    {
      kid: result.configuration.jwks.keys[0].kid,
      alg: result.configuration.jwks.keys[0].alg,
      use: result.configuration.jwks.keys[0].use,
      kty: result.configuration.jwks.keys[0].kty,
    },
    { kid: validRuntime.oidcKeyId, alg: "RS256", use: "sig", kty: "RSA" },
  );
  assert.ok(result.configuration.jwks.keys[0].d, "provider receives the private RSA JWK");
  assert.deepEqual(result.configuration.routes, {
    authorization: "/oauth/authorize",
    token: "/oauth/token",
    userinfo: "/oauth/userinfo",
    jwks: "/.well-known/jwks.json",
    revocation: "/oauth/revoke",
    end_session: "/oauth/logout",
  });
});

test("OIDC middleware is scoped to discovery and oauth routes", async () => {
  const source = await readFile(new URL("../server/middleware/oidc.ts", import.meta.url), "utf8");
  assert.match(source, /\/\.well-known\//);
  assert.match(source, /\/oauth\//);
  assert.doesNotMatch(source, /app\.use\(["']\/["']/);
});
