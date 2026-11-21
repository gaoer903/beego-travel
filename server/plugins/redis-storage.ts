import redisDriver from "unstorage/drivers/redis";

export default defineNitroPlugin(() => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.info("[redis] REDIS_URL is not configured, using Nitro default storage");
    return;
  }

  useStorage().mount(
    "redis",
    redisDriver({
      url: redisUrl,
      base: "bee_go",
      ttl: 60 * 5,
    })
  );
});
