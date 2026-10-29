import {
  createError,
  deleteCookie,
  getCookie,
  setHeader,
  unsealSession,
  updateSession,
  type H3Event,
  type SessionConfig,
} from "h3";
import config from "./config";
import { getAuthSessionStore, type StoredAuthSession } from "./authSessionStore";

const profileFields = [
  "ROLE_ID", "ROLE_CODE", "EMP_ID", "USER_NAME", "FULL_NAME_LA", "FULL_NAME_EN",
  "DOB", "EMAIL", "GENDER", "MOBILE", "PICTURE", "EMP_STATUS", "HIRE_DATE",
  "POS_ID", "POS_NAME", "POS_NAME_EN", "POS_ORDER", "POS_DESC", "TEAM_ID",
  "TEAM_NAME", "SECTION_ID", "SEC_NAME", "SEC_NAME_EN", "SEC_LATITUDE",
  "SEC_LONGITUDE", "SEC_RADIUS", "BRANCH_ID", "BR_NAME", "BR_LATITUDE",
  "BR_LONGITUDE", "BR_RADIUS", "BR_CODE", "BR_NAME_EN",
] as const;

export type SafeCommunityProfile = Partial<Record<(typeof profileFields)[number], unknown>> & {
  USER_NAME: string;
};

type StoredSession = StoredAuthSession & {
  user: SafeCommunityProfile;
};

function sessionOptions(): SessionConfig {
  const runtime = config();
  const password = runtime.sessionPassword;
  if (
    typeof password !== "string" ||
    password.length < 32 ||
    password === runtime.authCookieKey
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Configure a private NUXT_SESSION_PASSWORD of at least 32 characters",
    });
  }
  const maxAge = Number(runtime.cookieLife || 86400);
  if (!Number.isSafeInteger(maxAge) || maxAge <= 0) {
    throw createError({ statusCode: 500, statusMessage: "Invalid session lifetime" });
  }
  return {
    name: runtime.authCookieName,
    password,
    maxAge,
    sessionHeader: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  };
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function safeCommunityProfile(user: Record<string, unknown>): SafeCommunityProfile {
  if (!user || typeof user.USER_NAME !== "string" || !user.USER_NAME.trim()) {
    throw createError({ statusCode: 401, statusMessage: "Invalid session user" });
  }
  return Object.fromEntries(
    profileFields
      .filter((field) => field in user)
      .map((field) => [field, user[field]]),
  ) as SafeCommunityProfile;
}

export async function findCommunityProfile(userName: string): Promise<SafeCommunityProfile | null> {
  const normalized = userName.trim().toUpperCase();
  if (!normalized) return null;
  const profile = await getAuthSessionStore().findProfile(normalized);
  return profile ? safeCommunityProfile(profile) : null;
}

export async function createAuthSession(
  event: H3Event,
  user: Record<string, unknown>,
): Promise<SafeCommunityProfile> {
  const options = sessionOptions();
  const profile = safeCommunityProfile(user);
  const now = Date.now();
  if (event.context?.authSessionId) {
    await getAuthSessionStore().delete(event.context.authSessionId, event.context.auth?.USER_NAME);
  }
  event.context ??= {};
  event.context.sessions = {};
  const id = crypto.randomUUID();
  event.context.sessions[options.name!] = { id, createdAt: now, data: {} };
  const stored = { user: profile, expiresAt: now + options.maxAge! * 1000 };
  await getAuthSessionStore().set(id, stored, options.maxAge!);
  await updateSession(event, options);
  event.context.authSessionId = id;
  event.context.authSession = stored;
  event.context.auth = profile;
  setHeader(event, "Cache-Control", "no-store");
  return profile;
}

export async function readAuthSession(event: H3Event): Promise<void> {
  event.context.auth = null;
  event.context.authSession = null;
  event.context.authSessionId = null;
  const runtime = config();
  const name = runtime.authCookieName;
  const legacyName = runtime.legacyAuthCookieName;
  if (legacyName && legacyName !== name && getCookie(event, legacyName) !== undefined) {
    deleteCookie(event, legacyName, cookieOptions());
    if (runtime.domain) {
      deleteCookie(event, legacyName, { ...cookieOptions(), domain: runtime.domain });
    }
  }
  const cookie = getCookie(event, name);
  if (!cookie) return;
  const options = sessionOptions();
  let session;
  try {
    session = await unsealSession(event, options, cookie);
  } catch {
    deleteCookie(event, name, options.cookie || {});
    return;
  }
  const stored = session.id
    ? await getAuthSessionStore().get(session.id) as StoredSession | null
    : null;
  if (!stored || stored.expiresAt <= Date.now()) {
    if (session.id) await getAuthSessionStore().delete(session.id, stored?.user.USER_NAME);
    deleteCookie(event, name, options.cookie || {});
    return;
  }
  event.context.authSessionId = session.id;
  event.context.authSession = stored;
  event.context.auth = safeCommunityProfile(stored.user);
}

export async function clearAuthSession(event: H3Event): Promise<void> {
  const options = sessionOptions();
  if (event.context.authSessionId) {
    await getAuthSessionStore().delete(event.context.authSessionId, event.context.auth?.USER_NAME);
  }
  deleteCookie(event, options.name!, options.cookie || {});
  event.context.auth = null;
  event.context.authSession = null;
  event.context.authSessionId = null;
  event.context.sessions = {};
  setHeader(event, "Cache-Control", "no-store");
}
