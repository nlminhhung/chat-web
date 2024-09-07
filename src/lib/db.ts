import { Redis as upstashRedis} from "@upstash/redis";
import { Redis } from "ioredis"


export const db = new upstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

export const client = new Redis(process.env.UPSTASH_REDIS_URL!);