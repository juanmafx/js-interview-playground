import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { request } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { createStaticServer } from "../../backend/server/static-server.js";

let server;
let port;
let sandbox;
let sandboxServer;
let sandboxPort;

function send(targetPort, requestPath, method = "GET") {
  return new Promise((resolve, reject) => {
    const outgoing = request({ host: "127.0.0.1", port: targetPort, path: requestPath, method }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () =>
        resolve({
          status: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        }),
      );
    });
    outgoing.on("error", reject);
    outgoing.end();
  });
}

function listen(instance) {
  return new Promise((resolve) => {
    instance.listen(0, "127.0.0.1", () => resolve(instance.address().port));
  });
}

function close(instance) {
  return new Promise((resolve) => instance.close(resolve));
}

before(async () => {
  server = createStaticServer();
  port = await listen(server);

  sandbox = await mkdtemp(path.join(tmpdir(), "playground-server-"));
  const publicDirectory = path.join(sandbox, "public");
  await mkdir(publicDirectory);
  await writeFile(path.join(sandbox, "private.js"), "private");
  await symlink(path.join(sandbox, "private.js"), path.join(publicDirectory, "escape.js"));
  sandboxServer = createStaticServer({ mounts: [{ prefix: "/", directory: publicDirectory }] });
  sandboxPort = await listen(sandboxServer);
});

after(async () => {
  await close(server);
  await close(sandboxServer);
  await rm(sandbox, { recursive: true, force: true });
});

test("serves the page with hardening headers", async () => {
  const response = await send(port, "/");
  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /^text\/html/);
  assert.match(response.body, /JavaScript Interview Playground/);
  assert.match(response.headers["content-security-policy"], /default-src 'none'/);
  assert.doesNotMatch(response.headers["content-security-policy"], /unsafe/);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
});

test("page has no inline script, style, or event handler", async () => {
  const { body } = await send(port, "/");
  assert.doesNotMatch(body, /<style|<script(?![^>]*\ssrc=)|\sstyle=|\son[a-z]+=/i);
});

test("serves every module the page needs", async () => {
  for (const asset of [
    "/styles/main.css",
    "/scripts/main.js",
    "/scripts/playground.js",
    "/shared/reports/interview-report.js",
    "/shared/algorithms/even-squares.js",
    "/shared/objects/with-role.js",
  ]) {
    const response = await send(port, asset);
    assert.equal(response.status, 200, asset);
  }
});

test("HEAD returns headers without a body", async () => {
  const response = await send(port, "/", "HEAD");
  assert.equal(response.status, 200);
  assert.equal(response.body, "");
  assert.ok(Number(response.headers["content-length"]) > 0);
});

test("rejects unsupported methods", async () => {
  for (const method of ["POST", "PUT", "DELETE"]) {
    const response = await send(port, "/", method);
    assert.equal(response.status, 405);
    assert.equal(response.headers.allow, "GET, HEAD");
  }
});

test("blocks path traversal and hidden files", async () => {
  for (const attempt of [
    "/../package.json",
    "/%2e%2e/package.json",
    "/..%2fpackage.json",
    "/shared/../../package.json",
    "/shared/%2e%2e/%2e%2e/backend/server/main.js",
    "/.git/config",
    "/%2egit/config",
    "//etc/passwd.js",
  ]) {
    const response = await send(port, attempt);
    assert.equal(response.status, 404, attempt);
  }
});

test("rejects malformed paths", async () => {
  for (const attempt of ["/%E0%A4%A", "/index.html%00.js", "/..%5cpackage.json"]) {
    const response = await send(port, attempt);
    assert.equal(response.status, 400, attempt);
  }
});

test("does not serve disallowed file types or missing files", async () => {
  for (const attempt of ["/missing.js", "/scripts", "/shared/", "/index.html/x.js"]) {
    const response = await send(port, attempt);
    assert.equal(response.status, 404, attempt);
  }
});

test("does not follow symlinks out of a mount", async () => {
  const response = await send(sandboxPort, "/escape.js");
  assert.equal(response.status, 404);
  assert.doesNotMatch(response.body, /private/);
});
