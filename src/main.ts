import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { maybeLoadEnv } from "./utils/env.js";

maybeLoadEnv();

async function main() {
  const ratelimit = new Ratelimit({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    redis: Redis.fromEnv() as any,
    limiter: Ratelimit.slidingWindow(2, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });

  // Use a constant string to limit all requests with a single ratelimit
  // Or use a userID, apiKey or ip address for individual limits.
  const identifier = "api";

  const { success, remaining } = await ratelimit.limit(identifier);
  console.log({ success, remaining });

  await new Promise((resolve) => setTimeout(resolve, 5_000));
}

main().catch(console.log);
