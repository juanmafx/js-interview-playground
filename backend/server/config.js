export function loadConfig(environment = process.env) {
  const host = environment.HOST || "127.0.0.1";
  const rawPort = environment.PORT ?? "5500";

  if (!/^\d{1,5}$/.test(rawPort) || Number(rawPort) > 65535) {
    throw new RangeError("PORT must be an integer between 0 and 65535");
  }

  return { host, port: Number(rawPort) };
}
