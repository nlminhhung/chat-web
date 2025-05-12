const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
type Command = "subscribe" | "get" | "del" |"sismember" | "smembers" | "sadd" | "rpush" | "lrange" | "lset" | "lrem" | "zadd" | "zrem" | "zrange" | "zscore" | "hset" | "hexists" | "hlen" | "hkeys" | "hget" | "hmget" | "hgetall" |"hdel";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;
  
  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${restToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }
  const data = await response.json();

  return data.result;
}

export async function postRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisRestUrl}`;
  const response = await fetch(commandUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${restToken}`,
    },
    body: JSON.stringify([command, ...args]),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}