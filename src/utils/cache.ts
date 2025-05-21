import type { Blog, CacheData, CacheStore } from "../types.ts";

const CACHE_EXPIRE_TIME = 60 * 1000;
const cache: CacheStore = {};

/**
 * Retrieve data from cache. If cache doesn't exist or has expired, fetch and update it
 * @param cacheKey Cache key
 * @param fetchFn Fetch function
 * @param fixtures Optional test fixtures to use instead of fetching
 * @returns Data
 */
export async function getDataWithCache<T extends Blog[]>(
  cacheKey: keyof CacheStore,
  fetchFn: () => Promise<T>,
  fixtures?: T,
): Promise<T> {
  const currentTime = Date.now();
  const cachedData = cache[cacheKey] as CacheData<T> | undefined;

  // Use provided test data if available
  if (fixtures) {
    return fixtures;
  }

  // If cache doesn't exist or has expired
  if (!cachedData || currentTime - cachedData.timestamp > CACHE_EXPIRE_TIME) {
    try {
      const data = await fetchFn();
      cache[cacheKey] = { data, timestamp: currentTime };
      return data;
    } catch (error) {
      // If an error occurs and cache exists, return it even if expired
      if (cachedData) {
        console.warn(
          `Failed to fetch data but returning cache: ${String(error)}`,
        );
        return cachedData.data;
      }
      throw error; // Throw error if no cache exists
    }
  }

  return cachedData.data;
}
