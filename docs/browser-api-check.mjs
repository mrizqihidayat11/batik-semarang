import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage();
let fail = false;
let requests = 0;
await page.route("**/api/predict", async (route) => {
  requests++;
  assert.equal(route.request().method(), "POST");
  assert.match(
    await route.request().headerValue("content-type"),
    /multipart\/form-data/,
  );
  if (fail) {
    await route.fulfill({
      status: 503,
      json: { detail: "Model pengujian tidak tersedia." },
    });
    return;
  }
  await route.fulfill({
    json: {
      success: true,
      predicted_class: "Batik Cap Asem Arang",
      confidence: 0.55,
      predictions: [
        { class_name: "Batik Cap Asem Arang", confidence: 0.55 },
        { class_name: "Batik Cap Asem Sinom", confidence: 0.3 },
        { class_name: "Batik Cap Semarangan", confidence: 0.15 },
      ],
      processing_time: 0.25,
    },
  });
});
await page.route("**/api/health", (route) =>
  route.fulfill({ json: { status: "ok", model_connected: true } }),
);
await page.goto("http://127.0.0.1:5174/klasifikasi");
await page
  .getByRole("banner")
  .getByText("API aktif", { exact: true })
  .waitFor();
await page.locator("input[type=file]").setInputFiles({
  name: "fixture.png",
  mimeType: "image/png",
  buffer: readFileSync("docs/screenshots/classification-desktop.png"),
});
await page
  .getByRole("button", { name: "Mulai Klasifikasi", exact: true })
  .click();
await page
  .getByRole("heading", { name: "Batik Cap Asem Arang", exact: true })
  .waitFor();
assert.equal(await page.getByText("DEMO DATA", { exact: true }).count(), 0);
await page
  .getByRole("alert")
  .filter({ hasText: "Confidence rendah" })
  .waitFor();
fail = true;
await page
  .getByRole("button", { name: "Klasifikasi Ulang", exact: true })
  .click();
await page
  .getByRole("alert")
  .filter({ hasText: "Model pengujian tidak tersedia." })
  .waitFor();
assert.equal(
  await page
    .getByRole("heading", { name: "Batik Cap Asem Arang", exact: true })
    .count(),
  0,
);
assert.equal(requests, 2);
console.log(
  "PASS API mode: multipart POST, renders fixture response, low-confidence warning, backend 503 surfaced without demo fallback. This test intercepts HTTP; it does not test the real Python backend.",
);
await browser.close();
