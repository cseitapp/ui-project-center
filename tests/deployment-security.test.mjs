import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("runtime image does not bake env files and runs as non-root", async () => {
  const dockerfile = await readFile(new URL("../Dockerfile", import.meta.url), "utf8");
  assert.doesNotMatch(dockerfile, /COPY\s+\.env(?:\.production)?/i);
  assert.match(dockerfile, /FROM\s+node:[^\n]+\s+AS\s+build/i);
  assert.match(dockerfile, /COPY\s+--from=build\s+--chown=node:node\s+\/app\/\.output\s+\.\/\.output/i);
  assert.match(dockerfile, /USER\s+node/i);
});

test("deployment documents private runtime session configuration", async () => {
  const [compose, readme, envExample] = await Promise.all([
    readFile(new URL("../compose.yaml", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  for (const name of ["NUXT_SESSION_PASSWORD", "NUXT_AUTH_COOKIE_NAME", "NUXT_COOKIE_LIFE"]) {
    assert.match(compose, new RegExp(name));
    assert.match(readme, new RegExp(name));
  }
  assert.match(readme, /at least 32 characters/i);
  assert.match(readme, /shared by multiple API\s+replicas/i);
  assert.match(compose, /env_file:\s*\n\s*-\s*\.env\.production/);
  for (const name of [
    "NUXT_PROJECT_CENTER_PATH",
    "NUXT_PROJECT_CENTER_API_KEY",
    "NUXT_PROJECT_ID",
    "NUXT_PUBLIC_PROJECT_ID",
    "NUXT_DOMAIN",
  ]) {
    assert.match(envExample, new RegExp(name));
  }
});

test("deployment provides private persistent Redis for sessions and OIDC", async () => {
  const [compose, envExample] = await Promise.all([
    readFile(new URL("../compose.yaml", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  assert.match(compose, /redis:\s*\n/);
  assert.match(compose, /redis-server\s+--appendonly\s+yes/);
  assert.match(compose, /healthcheck:/);
  assert.match(compose, /redis-data:\/data/);
  const redisBlock = compose.match(/\n  redis:\n([\s\S]*?)(?=\n  [a-z])/i)?.[1] ?? "";
  assert.doesNotMatch(redisBlock, /ports:/);
  for (const name of ["NUXT_REDIS_URL", "NUXT_SESSION_PREFIX", "NUXT_OIDC_ADAPTER_PREFIX"]) {
    assert.match(envExample, new RegExp(name));
  }
});
