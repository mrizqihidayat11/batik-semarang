import test from "node:test";
import assert from "node:assert/strict";
import { validateImage } from "../src/utils/validation.js";
test("upload only accepts nonempty JPEG/PNG below 10 MB", () => {
  assert.equal(validateImage({ type: "image/png", size: 500 }), null);
  assert.match(validateImage({ type: "image/svg+xml", size: 500 }), /JPG/);
  assert.match(
    validateImage({ type: "image/jpeg", size: 11 * 1024 * 1024 }),
    /10 MB/,
  );
  assert.match(validateImage({ type: "image/png", size: 0 }), /kosong/);
});
