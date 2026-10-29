import { Provider } from "oidc-provider";
import config from "./config";
import { buildOidcConfig } from "./oidcConfig";
import { getRedisClient } from "./redisClient";
import { createOidcRedisAdapter } from "./oidcRedisAdapter";

let providerPromise: Promise<Provider> | undefined;

export function getOidcProvider(): Promise<Provider> {
  providerPromise ??= Promise.resolve().then(() => {
    const runtime = config();
    const { issuer, configuration } = buildOidcConfig(runtime);
    const prefix = typeof runtime.oidcAdapterPrefix === "string"
      ? runtime.oidcAdapterPrefix
      : "community:oidc:";
    configuration.adapter = createOidcRedisAdapter(getRedisClient(), prefix);
    const provider = new Provider(issuer, configuration as any);
    provider.proxy = true;
    return provider;
  });
  return providerPromise;
}

export function resetOidcProviderForTests() {
  if (process.env.NODE_ENV === "test") providerPromise = undefined;
}
