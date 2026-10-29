import { createPrivateKey } from "node:crypto";
import { createError } from "h3";
import { findCommunityProfile } from "./authSession";
import { buildOidcAccountClaims } from "./oidcInteraction";

type OidcRuntime = {
  oidcIssuer?: unknown;
  oidcKeyId?: unknown;
  oidcPrivateKeyBase64?: unknown;
  oidcCodeLifetime?: unknown;
  oidcClientEdocumentId?: unknown;
  oidcClientEdocumentSecret?: unknown;
  oidcClientEdocumentRedirectUri?: unknown;
};

function oidcError(message: string): never {
  throw createError({ statusCode: 500, statusMessage: `OIDC configuration: ${message}` });
}

function requiredString(value: unknown, name: string, minimum = 1): string {
  if (typeof value !== "string" || value.trim().length < minimum) {
    oidcError(`${name} is missing or invalid`);
  }
  return value.trim();
}

function secureUrl(value: unknown, name: string, nodeEnv: string): URL {
  const raw = requiredString(value, name);
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    oidcError(`${name} must be an absolute URL`);
  }
  const localDevelopment = nodeEnv !== "production" &&
    url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  if (url.protocol !== "https:" && !localDevelopment) {
    oidcError(`${name} must use HTTPS`);
  }
  if (url.username || url.password || url.search || url.hash) {
    oidcError(`${name} contains forbidden URL components`);
  }
  return url;
}

export function buildOidcConfig(runtime: OidcRuntime, nodeEnv = process.env.NODE_ENV ?? "development") {
  const issuerUrl = secureUrl(runtime.oidcIssuer, "issuer", nodeEnv);
  if (issuerUrl.pathname !== "/") oidcError("issuer must not contain a path");
  const redirectUrl = secureUrl(runtime.oidcClientEdocumentRedirectUri, "E-Document redirect URI", nodeEnv);
  if (redirectUrl.pathname !== "/api/auth/oidc/callback" || redirectUrl.search || redirectUrl.hash) {
    oidcError("E-Document redirect URI must end with /api/auth/oidc/callback");
  }

  const keyId = requiredString(runtime.oidcKeyId, "signing key ID");
  const encodedKey = requiredString(runtime.oidcPrivateKeyBase64, "private signing key");
  let privateJwk: Record<string, unknown>;
  try {
    const key = createPrivateKey(Buffer.from(encodedKey, "base64").toString("utf8"));
    if (key.asymmetricKeyType !== "rsa") oidcError("private signing key must be RSA");
    privateJwk = key.export({ format: "jwk" }) as Record<string, unknown>;
  } catch (error: any) {
    if (/OIDC configuration/i.test(error?.statusMessage ?? error?.message ?? "")) throw error;
    oidcError("private signing key is not a valid PKCS#8 RSA key");
  }

  const codeLifetime = Number(runtime.oidcCodeLifetime);
  if (!Number.isSafeInteger(codeLifetime) || codeLifetime < 30 || codeLifetime > 60) {
    oidcError("authorization-code lifetime must be between 30 and 60 seconds");
  }
  const clientId = requiredString(runtime.oidcClientEdocumentId, "E-Document client ID");
  const clientSecret = requiredString(runtime.oidcClientEdocumentSecret, "E-Document client secret", 32);
  const postLogout = `${redirectUrl.origin}/`;

  const configuration = {
    clients: [{
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUrl.href],
      post_logout_redirect_uris: [postLogout],
      response_types: ["code"],
      grant_types: ["authorization_code"],
      token_endpoint_auth_method: "client_secret_basic",
    }],
    jwks: {
      keys: [{ ...privateJwk, kid: keyId, alg: "RS256", use: "sig" }],
    },
    claims: {
      openid: ["sub"],
      profile: ["preferred_username", "name"],
      email: ["email"],
      roles: ["roles"],
    },
    scopes: ["openid", "profile", "email", "roles"],
    responseTypes: ["code"],
    grantTypes: ["authorization_code"],
    subjectTypes: ["public"],
    idTokenSigningAlgValues: ["RS256"],
    pkce: { required: () => true },
    features: {
      devInteractions: { enabled: false },
      registration: { enabled: false },
      revocation: { enabled: true },
      rpInitiatedLogout: { enabled: true },
    },
    routes: {
      authorization: "/oauth/authorize",
      token: "/oauth/token",
      userinfo: "/oauth/userinfo",
      jwks: "/.well-known/jwks.json",
      revocation: "/oauth/revoke",
      end_session: "/oauth/logout",
    },
    ttl: { AuthorizationCode: codeLifetime },
    interactions: { url: (_ctx: unknown, interaction: { uid: string }) => `/api/oidc/interaction/${interaction.uid}` },
    findAccount: async (_ctx: unknown, accountId: string) => {
      const profile = await findCommunityProfile(accountId);
      if (!profile) return undefined;
      return {
        accountId: profile.USER_NAME,
        claims: async () => buildOidcAccountClaims(profile),
      };
    },
  };

  return { issuer: issuerUrl.origin, configuration };
}
