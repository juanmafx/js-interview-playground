import assert from "node:assert/strict";
import { test } from "node:test";
import { allowedHostnames, loadConfig } from "../../backend/server/config.js";

test("loadConfig defaults to loopback on port 5500", () => {
  assert.deepEqual(loadConfig({}), { host: "127.0.0.1", port: 5500 });
});

test("loadConfig reads HOST and PORT", () => {
  assert.deepEqual(loadConfig({ HOST: "::1", PORT: "8080" }), { host: "::1", port: 8080 });
});

test("allowedHostnames keeps loopback names and adds a specific host", () => {
  assert.deepEqual(allowedHostnames("127.0.0.1"), ["localhost", "127.0.0.1", "[::1]"]);
  assert.deepEqual(allowedHostnames("::1"), ["localhost", "127.0.0.1", "[::1]"]);
  assert.deepEqual(allowedHostnames("Dev.Local"), ["localhost", "127.0.0.1", "[::1]", "dev.local"]);
});

test("allowedHostnames does not trust wildcard bind addresses", () => {
  for (const host of ["0.0.0.0", "::"]) {
    assert.deepEqual(allowedHostnames(host), ["localhost", "127.0.0.1", "[::1]"]);
  }
});

test("loadConfig rejects invalid ports", () => {
  for (const PORT of ["", "abc", "-1", "65536", "80.5", "123456"]) {
    assert.throws(() => loadConfig({ PORT }), RangeError);
  }
});
