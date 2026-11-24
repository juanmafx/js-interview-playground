export const LOOPBACK_HOSTNAMES = Object.freeze(["localhost", "127.0.0.1", "[::1]"]);

const WILDCARD_HOSTNAMES = new Set(["0.0.0.0", "[::]"]);

export function allowedHostnames(host) {
  const hostname = (host.includes(":") ? `[${host}]` : host).toLowerCase();
  if (WILDCARD_HOSTNAMES.has(hostname)) {
    return [...LOOPBACK_HOSTNAMES];
  }
  return [...new Set([...LOOPBACK_HOSTNAMES, hostname])];
}

export function loadConfig(environment = process.env) {
  const host = environment.HOST || "127.0.0.1";
  const rawPort = environment.PORT ?? "5500";

  if (!/^\d{1,5}$/.test(rawPort) || Number(rawPort) > 65535) {
    throw new RangeError("PORT must be an integer between 0 and 65535");
  }

  return { host, port: Number(rawPort) };
}
