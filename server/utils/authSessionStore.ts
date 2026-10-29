import config from "./config";
import { getRedisClient } from "./redisClient";

export type StoredAuthSession = {
  user: Record<string, unknown> & { USER_NAME: string };
  expiresAt: number;
};

type RedisStore = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: Array<string | number>): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
  sadd(key: string, ...values: string[]): Promise<unknown>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, ...values: string[]): Promise<unknown>;
  expire(key: string, seconds: number): Promise<unknown>;
  multi(): any;
};

function safePrefix(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9:_-]+$/.test(value)
    ? value
    : "community:session:";
}

export function createAuthSessionStore(redis: RedisStore, prefix: string) {
  const sessionKey = (id: string) => `${prefix}id:${id}`;
  const userSessionsKey = (userName: string) => `${prefix}user:${userName.trim().toUpperCase()}`;
  return {
    async set(id: string, record: StoredAuthSession, ttlSeconds: number) {
      const payload = JSON.stringify(record);
      await redis.multi()
        .set(sessionKey(id), payload, "EX", ttlSeconds)
        .sadd(userSessionsKey(record.user.USER_NAME), id)
        .expire(userSessionsKey(record.user.USER_NAME), ttlSeconds)
        .exec();
    },
    async get(id: string): Promise<StoredAuthSession | null> {
      const payload = await redis.get(sessionKey(id));
      if (!payload) return null;
      try { return JSON.parse(payload) as StoredAuthSession; } catch { return null; }
    },
    async findProfile(userName: string) {
      const index = userSessionsKey(userName);
      for (const id of await redis.smembers(index)) {
        const record = await this.get(id);
        if (record && record.expiresAt > Date.now()) return record.user;
        await redis.srem(index, id);
      }
      return null;
    },
    async delete(id: string, userName?: string) {
      const record = userName ? null : await this.get(id);
      const normalized = userName || record?.user.USER_NAME;
      await redis.del(sessionKey(id));
      if (normalized) {
        const index = userSessionsKey(normalized);
        await redis.srem(index, id);
        if ((await redis.smembers(index)).length === 0) await redis.del(index);
      }
    },
  };
}

let testStore: ReturnType<typeof createAuthSessionStore> | undefined;

export function setAuthSessionStoreForTests(store?: ReturnType<typeof createAuthSessionStore>) {
  if (process.env.NODE_ENV === "production") throw new Error("Test store is unavailable in production");
  testStore = store;
}

export function getAuthSessionStore() {
  if (testStore) return testStore;
  const runtime = config();
  return createAuthSessionStore(getRedisClient(), safePrefix(runtime.sessionPrefix));
}
