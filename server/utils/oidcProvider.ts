import { Provider } from "oidc-provider";
import config from "./config";
import { buildOidcConfig } from "./oidcConfig";

let providerPromise: Promise<Provider> | undefined;

export function getOidcProvider(): Promise<Provider> {
  providerPromise ??= Promise.resolve().then(() => {
    const { issuer, configuration } = buildOidcConfig(config());
    const provider = new Provider(issuer, configuration as any);
    provider.proxy = true;
    return provider;
  });
  return providerPromise;
}

export function resetOidcProviderForTests() {
  if (process.env.NODE_ENV === "test") providerPromise = undefined;
}
