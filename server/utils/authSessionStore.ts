export type StoredAuthSession = {
  user: Record<string, unknown> & { USER_NAME: string };
  expiresAt: number;
};

export function createAuthSessionStore() {
  const sessions = new Map<string, StoredAuthSession>();

  function pruneExpired() {
    const now = Date.now();
    for (const [id, record] of sessions) {
      if (record.expiresAt <= now) sessions.delete(id);
    }
  }

  return {
    async set(id: string, record: StoredAuthSession, ttlSeconds: number) {
      pruneExpired();
      sessions.set(id, {
        ...structuredClone(record),
        expiresAt: Math.min(record.expiresAt, Date.now() + ttlSeconds * 1000),
      });
    },
    async get(id: string): Promise<StoredAuthSession | null> {
      const record = sessions.get(id);
      if (!record) return null;
      if (record.expiresAt <= Date.now()) {
        sessions.delete(id);
        return null;
      }
      return structuredClone(record);
    },
    async delete(id: string) {
      sessions.delete(id);
    },
  };
}

const sessionStore = createAuthSessionStore();
let testStore: ReturnType<typeof createAuthSessionStore> | undefined;

export function setAuthSessionStoreForTests(store?: ReturnType<typeof createAuthSessionStore>) {
  if (process.env.NODE_ENV === "production") throw new Error("Test store is unavailable in production");
  testStore = store;
}

export function getAuthSessionStore() {
  return testStore ?? sessionStore;
}
