import { Redis as upstashRedis} from "@upstash/redis";


export const db = new upstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
});
