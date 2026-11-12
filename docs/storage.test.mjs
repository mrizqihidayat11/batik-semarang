import test from "node:test";
import assert from "node:assert/strict";
import { readHistory } from "../src/utils/storage.js";
const predictions = [
  { class_name: "Batik A", confidence: 0.8 },
  { class_name: "Batik B", confidence: 0.2 },
];
const valid = {
  id: "id",
  filename: "batik.png",
  createdAt: "2026-11-12T00:00:00Z",
  result: {
    predicted_class: "Batik A",
    confidence: 0.8,
    predictions,
    processing_time: 0.2,
    is_demo: true,
  },
};
test("corrupted history never reaches result view", () => {
  globalThis.localStorage = {
    getItem: () =>
      JSON.stringify([
        valid,
        {
          id: "bad",
          result: { predictions: [{ class_name: "Batik A", confidence: 0.8 }] },
        },
        null,
      ]),
  };
  assert.deepEqual(readHistory(), [valid]);
});
test("malformed JSON and unavailable storage recover with empty history", () => {
  globalThis.localStorage = { getItem: () => "{bad" };
  assert.deepEqual(readHistory(), []);
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("disabled");
    },
  };
  assert.deepEqual(readHistory(), []);
});
