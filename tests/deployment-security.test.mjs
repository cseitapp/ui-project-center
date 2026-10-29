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
  assert.match(readme, /single.*process|one.*replica/i);
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
