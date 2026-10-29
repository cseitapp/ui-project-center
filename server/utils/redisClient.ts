import Redis from "ioredis";
import { createError } from "h3";
import config from "./config";

let redisClient: Redis | undefined;

export function getRedisClient(): Redis {
  if (redisClient) return redisClient;
  const url = config().redisUrl;
  if (typeof url !== "string" || !/^rediss?:\/\//.test(url)) {
    throw createError({ statusCode: 500, statusMessage: "Redis is not configured" });
  }
  redisClient = new Redis(url, {
    lazyConnect: true,
    connectTimeout: 5_000,
    maxRetriesPerRequest: 1,
  });
  redisClient.on("error", (error) => console.error("[redis] connection error", error.message));
  return redisClient;
}

export function resetRedisClientForTests() {
  if (process.env.NODE_ENV === "test") redisClient = undefined;
}
