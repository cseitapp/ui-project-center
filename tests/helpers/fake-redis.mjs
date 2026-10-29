export class FakeRedis {
  values = new Map();
  sets = new Map();
  setExpiries = new Map();

  async set(key, value, ...args) {
    let expiresAt = this.values.get(key)?.expiresAt;
    const exIndex = args.indexOf("EX");
    if (exIndex >= 0) expiresAt = Date.now() + Number(args[exIndex + 1]) * 1000;
    this.values.set(key, { value, expiresAt });
    return "OK";
  }
  async get(key) {
    const entry = this.values.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) { this.values.delete(key); return null; }
    return entry.value;
  }
  async del(...keys) { for (const key of keys) { this.values.delete(key); this.sets.delete(key); this.setExpiries.delete(key); } return keys.length; }
  async expire(key, seconds) { this.setExpiries.set(key, Date.now() + seconds * 1000); return 1; }
  async ttl(key) {
    const expiresAt = this.setExpiries.get(key) ?? this.values.get(key)?.expiresAt;
    return expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)) : -1;
  }
  async sadd(key, ...values) { const set = this.sets.get(key) ?? new Set(); values.forEach((value) => set.add(value)); this.sets.set(key, set); return values.length; }
  async smembers(key) {
    if ((this.setExpiries.get(key) ?? Infinity) <= Date.now()) { await this.del(key); return []; }
    return [...(this.sets.get(key) ?? [])];
  }
  async srem(key, ...values) { const set = this.sets.get(key); values.forEach((value) => set?.delete(value)); return values.length; }
  multi() {
    const commands = [];
    const chain = {};
    for (const method of ["set", "del", "expire", "sadd", "srem"]) {
      chain[method] = (...args) => { commands.push([method, args]); return chain; };
    }
    chain.exec = async () => Promise.all(commands.map(async ([method, args]) => [null, await this[method](...args)]));
    return chain;
  }
}
