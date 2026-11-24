import { readFile, realpath } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SECURITY_HEADERS } from "./security-headers.js";

const PROJECT_ROOT = fileURLToPath(new URL("../../", import.meta.url));

export const DEFAULT_MOUNTS = Object.freeze([
  { prefix: "/shared/", directory: path.join(PROJECT_ROOT, "shared") },
  { prefix: "/", directory: path.join(PROJECT_ROOT, "frontend") },
]);

const CONTENT_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
]);

const NOT_FOUND_CODES = new Set(["EISDIR", "ENOENT", "ENOTDIR"]);

function parsePathname(rawUrl) {
  const rawPath = rawUrl.split(/[?#]/, 1)[0];
  if (!rawPath.startsWith("/") || rawPath.includes("\\")) {
    return null;
  }
  try {
    const decoded = decodeURIComponent(rawPath);
    return decoded.includes("\0") || decoded.includes("\\") ? null : decoded;
  } catch {
    return null;
  }
}

function isInside(directory, candidate) {
  const relative = path.relative(directory, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function resolveFile(pathname, mounts) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const segments = requested.split("/").slice(1);

  if (segments.some((segment) => segment === "" || segment.startsWith("."))) {
    return null;
  }
  if (!CONTENT_TYPES.has(path.extname(requested))) {
    return null;
  }

  const mount = mounts.find(({ prefix }) => requested.startsWith(prefix));
  if (!mount) {
    return null;
  }

  const root = await realpath(mount.directory);
  const resolved = await realpath(path.join(root, requested.slice(mount.prefix.length)));
  return isInside(root, resolved) ? resolved : null;
}

function respond(response, status, body, headers = {}) {
  response.writeHead(status, {
    ...SECURITY_HEADERS,
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  response.end(response.req.method === "HEAD" ? undefined : body);
}

async function handleRequest(request, response, mounts) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    respond(response, 405, "Method Not Allowed", { Allow: "GET, HEAD" });
    return;
  }

  const pathname = parsePathname(request.url);
  if (pathname === null) {
    respond(response, 400, "Bad Request");
    return;
  }

  try {
    const file = await resolveFile(pathname, mounts);
    if (!file) {
      respond(response, 404, "Not Found");
      return;
    }
    const body = await readFile(file);
    respond(response, 200, body, { "Content-Type": CONTENT_TYPES.get(path.extname(file)) });
  } catch (error) {
    if (NOT_FOUND_CODES.has(error.code)) {
      respond(response, 404, "Not Found");
      return;
    }
    respond(response, 500, "Internal Server Error");
  }
}

export function createStaticServer({ mounts = DEFAULT_MOUNTS } = {}) {
  return createServer((request, response) => {
    void handleRequest(request, response, mounts);
  });
}
