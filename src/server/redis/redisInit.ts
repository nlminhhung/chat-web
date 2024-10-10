import { Redis } from "ioredis"
import 'dotenv/config';

export const client = new Redis(process.env.REDIS_URL!);