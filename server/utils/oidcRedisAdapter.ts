type RedisAdapterStore = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: Array<string | number>): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
  expire(key: string, seconds: number): Promise<unknown>;
  ttl(key: string): Promise<number>;
  sadd(key: string, ...values: string[]): Promise<unknown>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, ...values: string[]): Promise<unknown>;
  multi(): any;
};

const grantable = new Set([
  "AccessToken", "AuthorizationCode", "RefreshToken", "DeviceCode",
  "BackchannelAuthenticationRequest", "PreAuthorizedCode",
]);

export function createOidcRedisAdapter(redis: RedisAdapterStore, prefix = "community:oidc:") {
  const recordKey = (model: string, id: string) => `${prefix}model:${model}:${id}`;
  const uidKey = (uid: string) => `${prefix}uid:${uid}`;
  const userCodeKey = (code: string) => `${prefix}user-code:${code}`;
  const grantKey = (grantId: string) => `${prefix}grant:${grantId}`;

  return class OidcRedisAdapter {
    constructor(private model: string) {}

    private async readKey(key: string) {
      const value = await redis.get(key);
      if (!value) return undefined;
      try { return JSON.parse(value); } catch { return undefined; }
    }

    private async removeIndexes(key: string, payload: any) {
      const tasks: Promise<unknown>[] = [];
      if (payload?.uid) tasks.push(redis.del(uidKey(payload.uid)));
      if (payload?.userCode) tasks.push(redis.del(userCodeKey(payload.userCode)));
      if (grantable.has(this.model) && payload?.grantId) {
        tasks.push(redis.srem(grantKey(payload.grantId), key));
      }
      await Promise.all(tasks);
    }

    async upsert(id: string, payload: any, expiresIn?: number) {
      const key = recordKey(this.model, id);
      const previous = await this.readKey(key);
      if (previous) await this.removeIndexes(key, previous);
      const ttl = Math.max(1, Math.ceil(expiresIn ?? 3600));
      const transaction = redis.multi().set(key, JSON.stringify(payload), "EX", ttl);
      if (this.model === "Session" && payload.uid) {
        transaction.set(uidKey(payload.uid), key, "EX", ttl);
      }
      if (payload.userCode) transaction.set(userCodeKey(payload.userCode), key, "EX", ttl);
      if (grantable.has(this.model) && payload.grantId) {
        const index = grantKey(payload.grantId);
        const currentTtl = await redis.ttl(index);
        transaction.sadd(index, key).expire(index, Math.max(ttl, currentTtl));
      }
      await transaction.exec();
    }

    async find(id: string) { return this.readKey(recordKey(this.model, id)); }

    async findByUid(uid: string) {
      const key = await redis.get(uidKey(uid));
      return key ? this.readKey(key) : undefined;
    }

    async findByUserCode(userCode: string) {
      const key = await redis.get(userCodeKey(userCode));
      return key ? this.readKey(key) : undefined;
    }

    async consume(id: string) {
      const key = recordKey(this.model, id);
      const payload = await this.readKey(key);
      if (!payload) return;
      payload.consumed = Math.floor(Date.now() / 1000);
      await redis.set(key, JSON.stringify(payload), "KEEPTTL");
    }

    async destroy(id: string) {
      const key = recordKey(this.model, id);
      const payload = await this.readKey(key);
      await redis.del(key);
      if (payload) await this.removeIndexes(key, payload);
    }

    async revokeByGrantId(grantId: string) {
      const index = grantKey(grantId);
      const keys = await redis.smembers(index);
      for (const key of keys) {
        const payload = await this.readKey(key);
        await redis.del(key);
        if (payload) {
          if (payload.uid) await redis.del(uidKey(payload.uid));
          if (payload.userCode) await redis.del(userCodeKey(payload.userCode));
        }
      }
      await redis.del(index);
    }
  };
}
