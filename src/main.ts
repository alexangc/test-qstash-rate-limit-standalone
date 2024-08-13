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

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { success, remaining } = await ratelimit.limit(identifier);

    if (!success) {
      console.log(new Date(), { success, remaining }, "BOUNCING");
      await new Promise((resolve) => setTimeout(resolve, 12_000));
    } else {
      console.log(new Date(), { success, remaining }, "Processing");
      // await new Promise((resolve) => setTimeout(resolve, 5_000));
      break;
    }
  }
}

main().catch(console.log);
