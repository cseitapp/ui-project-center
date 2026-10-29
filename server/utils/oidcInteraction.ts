import type { SafeCommunityProfile } from "./authSession";

const allowedScopes = new Set(["openid", "profile", "email", "roles"]);
const allowedClaims = new Set(["sub", "preferred_username", "name", "email", "roles"]);

type InteractionDetails = {
  uid: string;
  prompt: { name: string; details?: Record<string, unknown> };
  params?: Record<string, unknown>;
};

export function buildOidcAccountClaims(profile: SafeCommunityProfile) {
  return {
    sub: profile.USER_NAME,
    preferred_username: profile.USER_NAME,
    name: String(profile.FULL_NAME_LA || profile.FULL_NAME_EN || profile.USER_NAME),
    email: typeof profile.EMAIL === "string" ? profile.EMAIL : undefined,
    roles: typeof profile.ROLE_CODE === "string" && profile.ROLE_CODE ? [profile.ROLE_CODE] : [],
  };
}

export function planOidcInteraction(details: InteractionDetails, profile: SafeCommunityProfile | null) {
  if (!profile) {
    if (details.params?.prompt === "none") {
      return {
        type: "finish" as const,
        result: { error: "login_required", error_description: "Community session required" },
      };
    }
    return {
      type: "redirect" as const,
      location: `/?oidc_uid=${encodeURIComponent(details.uid)}`,
    };
  }

  if (details.prompt.name === "login") {
    return {
      type: "finish" as const,
      result: { login: { accountId: profile.USER_NAME } },
    };
  }

  if (details.prompt.name === "consent") {
    const promptDetails = details.prompt.details ?? {};
    const scopes = Array.isArray(promptDetails.missingOIDCScope)
      ? promptDetails.missingOIDCScope.map(String)
      : [];
    const claims = Array.isArray(promptDetails.missingOIDCClaims)
      ? promptDetails.missingOIDCClaims.map(String)
      : [];
    const unsupported = scopes.some((scope) => !allowedScopes.has(scope)) ||
      claims.some((claim) => !allowedClaims.has(claim)) ||
      Boolean(promptDetails.missingResourceScopes) || Boolean(promptDetails.rar);
    if (unsupported) {
      return {
        type: "finish" as const,
        result: { error: "invalid_scope", error_description: "Requested scope is not allowed" },
      };
    }
    return {
      type: "consent" as const,
      accountId: profile.USER_NAME,
      scopes,
      claims,
    };
  }

  return {
    type: "finish" as const,
    result: { error: "interaction_required", error_description: "Unsupported interaction" },
  };
}
