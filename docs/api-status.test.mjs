import test from "node:test";
import assert from "node:assert/strict";
import { getConnectionStatus } from "../src/utils/apiStatus.js";
test("API ready only when health and loaded model are confirmed", () => {
  assert.equal(
    getConnectionStatus({ status: "ok", model_connected: true }, false).state,
    "connected",
  );
  assert.equal(
    getConnectionStatus({ status: "ok", model_connected: false }, false).state,
    "model_unavailable",
  );
});
test("missing or malformed health never appears connected", () => {
  for (const data of [
    null,
    {},
    { status: "ok" },
    { status: "error", model_connected: true },
  ])
    assert.equal(getConnectionStatus(data, false).state, "offline");
});
test("demo configuration is explicitly identified even if backend exists", () => {
  assert.equal(
    getConnectionStatus({ status: "ok", model_connected: true }, true).state,
    "demo",
  );
});
