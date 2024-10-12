const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "subscribe" | "get" | "del" |"sismember" | "smembers" | "sadd" | "rpush" | "lrange" | "lset" | "lrem" | "zadd" | "zrem" | "zrange" | "zscore" | "hset" | "hexists" | "hlen" | "hkeys" | "hget" | "hdel";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {

  const encodedArgs = args.map(arg => {
    // If it's a string and looks like JSON, stringify and encode it
    if (typeof arg === 'object') {
      return encodeURIComponent(JSON.stringify(arg));
    }
    return encodeURIComponent(String(arg));
  });

  const commandUrl = `${upstashRedisRestUrl}/${command}/${encodedArgs.join("/")}`;

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
