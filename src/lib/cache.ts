import NodeCache from "node-cache";

const cache = new NodeCache({ checkperiod: 30 });

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCached<T>(key: string, value: T, ttlSeconds: number): void {
  cache.set(key, value, ttlSeconds);
}

export function deleteCached(key: string): void {
  cache.del(key);
}

export default cache;
