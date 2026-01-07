import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

import "dotenv/config";

const hasUpstashEnv =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = hasUpstashEnv
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "60 s"),
    })
  : {
      limit: async () => ({ success: true }),
    };

if (!hasUpstashEnv) {
  console.warn(
    "Upstash Redis env vars not found. Rate limiting is disabled."
  );
}

export default ratelimit;
