import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let mode = "ready";
  await page.route("**/api/health", async (route) => {
    if (mode === "offline") return route.abort("failed");
    return route.fulfill({
      json: { status: "ok", model_connected: mode === "ready" },
    });
  });
  await page.goto("http://localhost:5173/klasifikasi");
  const header = page.getByRole("banner");
  await header.getByText("API aktif", { exact: true }).waitFor();
  assert.equal(await page.getByText("API aktif", { exact: true }).count(), 2);
  mode = "model";
  await page.getByRole("button", { name: "Cek koneksi", exact: true }).click();
  await header.getByText("Model belum siap", { exact: true }).waitFor();
  mode = "offline";
  await page.getByRole("button", { name: "Cek koneksi", exact: true }).click();
  await header.getByText("API tidak terhubung", { exact: true }).waitFor();
  await page
    .getByText(/Nyalakan backend Python/)
    .last()
    .waitFor();
  mode = "ready";
  await page.getByRole("button", { name: "Cek koneksi", exact: true }).click();
  await header.getByText("API aktif", { exact: true }).waitFor();
  // Real interval regression: a later outage must be noticed without reload or click.
  mode = "offline";
  await header
    .getByText("API tidak terhubung", { exact: true })
    .waitFor({ timeout: 22000 });
  mode = "ready";
  await page.getByRole("button", { name: "Cek koneksi", exact: true }).click();
  await header.getByText("API aktif", { exact: true }).waitFor();
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await header.getByText("API aktif", { exact: true }).isVisible(),
      true,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  }
  await page.screenshot({
    path: "docs/screenshots/classification-api-status.png",
    fullPage: true,
  });
  await page.goto("http://localhost:5173/");
  await header.getByText("API aktif", { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: connected, model unavailable, disconnected, manual recovery, automatic 15s outage detection, global visibility and responsive layout; no page errors.",
  );
} finally {
  await browser.close();
}
