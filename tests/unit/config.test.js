import assert from "node:assert/strict";
import { test } from "node:test";
import { loadConfig } from "../../backend/server/config.js";

test("loadConfig defaults to loopback on port 5500", () => {
  assert.deepEqual(loadConfig({}), { host: "127.0.0.1", port: 5500 });
});

test("loadConfig reads HOST and PORT", () => {
  assert.deepEqual(loadConfig({ HOST: "::1", PORT: "8080" }), { host: "::1", port: 8080 });
});

test("loadConfig rejects invalid ports", () => {
  for (const PORT of ["", "abc", "-1", "65536", "80.5", "123456"]) {
    assert.throws(() => loadConfig({ PORT }), RangeError);
  }
});
