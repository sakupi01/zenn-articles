import type { Blog } from "../types.js";
import { getDataWithCache } from "../utils/cache.js";
import { fetchFrontendWeekly } from "./fetchers/cy-fe-weekly.js";

/**
 * Get fe weekly articles with caching
 */
export const getFeWeeklyArticles = (fixtures?: Blog[]) =>
  getDataWithCache("blogs", fetchFrontendWeekly, fixtures);
