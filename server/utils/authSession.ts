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

type StoredSession = {
  user: SafeCommunityProfile;
  expiresAt: number;
};

// Phase one deliberately supports one process. Redis replaces this adapter before scaling.
const activeSessions = new Map<string, StoredSession>();

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

function pruneExpired(now: number) {
  for (const [id, session] of activeSessions) {
    if (session.expiresAt <= now) activeSessions.delete(id);
  }
}

export function findCommunityProfile(userName: string): SafeCommunityProfile | null {
  const normalized = userName.trim().toUpperCase();
  if (!normalized) return null;
  const now = Date.now();
  pruneExpired(now);
  for (const session of activeSessions.values()) {
    if (session.expiresAt > now && session.user.USER_NAME.toUpperCase() === normalized) {
      return safeCommunityProfile(session.user);
    }
  }
  return null;
}

export async function createAuthSession(
  event: H3Event,
  user: Record<string, unknown>,
): Promise<SafeCommunityProfile> {
  const options = sessionOptions();
  const profile = safeCommunityProfile(user);
  const now = Date.now();
  pruneExpired(now);
  if (event.context?.authSessionId) activeSessions.delete(event.context.authSessionId);
  event.context ??= {};
  event.context.sessions = {};
  const id = crypto.randomUUID();
  event.context.sessions[options.name!] = { id, createdAt: now, data: {} };
  await updateSession(event, options);
  const stored = { user: profile, expiresAt: now + options.maxAge! * 1000 };
  activeSessions.set(id, stored);
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
  try {
    const session = await unsealSession(event, options, cookie);
    const stored = session.id ? activeSessions.get(session.id) : undefined;
    if (!stored || stored.expiresAt <= Date.now()) {
      if (session.id) activeSessions.delete(session.id);
      deleteCookie(event, name, options.cookie || {});
      return;
    }
    event.context.authSessionId = session.id;
    event.context.authSession = stored;
    event.context.auth = safeCommunityProfile(stored.user);
  } catch {
    deleteCookie(event, name, options.cookie || {});
  }
}

export function clearAuthSession(event: H3Event): void {
  const options = sessionOptions();
  if (event.context.authSessionId) activeSessions.delete(event.context.authSessionId);
  deleteCookie(event, options.name!, options.cookie || {});
  event.context.auth = null;
  event.context.authSession = null;
  event.context.authSessionId = null;
  event.context.sessions = {};
  setHeader(event, "Cache-Control", "no-store");
}
