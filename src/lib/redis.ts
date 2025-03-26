import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import path from "path";

// Ensure dotenv is configured with the correct path
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env.local') 
});

if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error("UPSTASH_REDIS_URL is not defined in the environment variables");
}

if (!process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error("UPSTASH_REDIS_TOKEN is not defined in the environment variables");
}

// Create a new Redis client using the Upstash Redis URL from the environment variables (.env)
const redis = Redis.fromEnv();

export default redis;