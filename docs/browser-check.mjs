import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("**/api/health", (r) =>
  r.fulfill({
    json: {
      status: "ok",
      model_connected: false,
      model: { framework: null, input_size: null, dataset_size: null },
    },
  }),
);
await page.route("**/api/metrics", (r) =>
  r.fulfill({ json: { available: false, is_demo: false } }),
);
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.locator("img").evaluateAll((imgs) =>
  imgs.forEach((img) => {
    img.loading = "eager";
  }),
);
await page.evaluate(() =>
  Promise.all(
    Array.from(document.images).map((img) => img.decode().catch(() => {})),
  ),
);
await page.screenshot({
  path: "docs/screenshots/home-desktop.png",
  fullPage: true,
});
const fixture = await page.locator("img").first().screenshot();
await page
  .getByRole("link", { name: "Mulai Klasifikasi", exact: true })
  .click();
await page.locator("input[type=file]").setInputFiles({
  name: "invalid.txt",
  mimeType: "text/plain",
  buffer: Buffer.from("not an image"),
});
await page.getByRole("alert").filter({ hasText: "JPG" }).waitFor();
await page.locator("input[type=file]").setInputFiles({
  name: "contoh-batik.png",
  mimeType: "image/png",
  buffer: fixture,
});
const classify = page.getByRole("button", {
  name: "Mulai Klasifikasi",
  exact: true,
});
await classify.waitFor();
await page.evaluate(() => {
  const original = window.createImageBitmap.bind(window);
  window.createImageBitmap = async (...args) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return original(...args);
  };
});
await page.locator("input[type=file]").setInputFiles({
  name: "contoh-batik.png",
  mimeType: "image/png",
  buffer: fixture,
});
await page
  .getByRole("button", { name: "Menyiapkan gambar…", exact: true })
  .waitFor();
assert.equal(
  await page
    .getByRole("button", { name: "Menyiapkan gambar…", exact: true })
    .isDisabled(),
  true,
);
await classify.waitFor();
await classify.click();
assert.equal(await page.locator("input[type=file]").isDisabled(), true);
await page
  .getByRole("heading", { name: "Batik Cap Asem Arang", exact: true })
  .waitFor();
assert.equal(await page.getByText("DEMO DATA", { exact: true }).count(), 1);
await page.getByRole("button", { name: "Simpan Riwayat", exact: true }).click();
await page.getByRole("button", { name: "Tersimpan", exact: true }).waitFor();
assert.equal(await page.locator("tbody tr").count(), 1);
await page
  .getByRole("button", { name: "Hapus contoh-batik.png", exact: true })
  .click();
assert.equal(
  await page
    .getByRole("button", { name: "Simpan Riwayat", exact: true })
    .isEnabled(),
  true,
);
await page.getByRole("button", { name: "Simpan Riwayat", exact: true }).click();
const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.getByRole("button", { name: "Unduh Laporan" }).click(),
]);
assert.equal(download.suggestedFilename(), "laporan-batik-semarang.svg");
await page.locator("img").evaluateAll((imgs) =>
  imgs.forEach((img) => {
    img.loading = "eager";
  }),
);
await page.evaluate(() =>
  Promise.all(
    Array.from(document.images).map((img) => img.decode().catch(() => {})),
  ),
);
await page.screenshot({
  path: "docs/screenshots/classification-desktop.png",
  fullPage: true,
});
await page.reload();
await page
  .getByRole("button", { name: "Lihat hasil contoh-batik.png" })
  .click();
await page.getByRole("dialog").waitFor();
assert.equal(
  await page
    .getByRole("dialog")
    .getByText("DEMO DATA", { exact: true })
    .count(),
  1,
);
await page.getByRole("button", { name: "Tutup detail" }).click();
await page.getByRole("textbox", { name: "Cari riwayat" }).fill("not-found");
await page.getByText("Riwayat tidak ditemukan", { exact: true }).waitFor();
await page.getByRole("button", { name: "Reset filter" }).click();
await page.getByRole("button", { name: "Hapus semua", exact: true }).click();
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Hapus semua", exact: true })
  .click();
await page
  .getByText("Belum ada riwayat klasifikasi", { exact: true })
  .waitFor();
await page.getByRole("link", { name: "Data Batik", exact: true }).click();
await page.getByRole("textbox", { name: "Cari nama motif" }).fill("blekok");
assert.equal(await page.getByRole("button", { name: /Koleksi/ }).count(), 2);
await page
  .getByRole("textbox", { name: "Cari nama motif" })
  .fill("no-such-motif");
await page.getByText("Motif tidak ditemukan", { exact: true }).waitFor();
await page.getByRole("button", { name: "Reset pencarian" }).click();
await page
  .getByRole("combobox", { name: "Filter kelas motif" })
  .selectOption("09");
assert.equal(await page.getByRole("button", { name: /Koleksi/ }).count(), 1);
await page.getByRole("button", { name: /Koleksi 09/ }).click();
await page.getByRole("dialog").waitFor();
await page.keyboard.press("Escape");
assert.equal(await page.getByRole("dialog").count(), 0);
await page.getByRole("link", { name: "Evaluasi Model", exact: true }).click();
await page
  .getByRole("heading", { name: "Data evaluasi belum tersedia" })
  .waitFor();
assert.equal(await page.getByRole("button", { name: /DEMO/ }).count(), 0);
assert.equal(await page.locator("tbody tr").count(), 0);
for (const width of [375, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/",
    "/tentang",
    "/klasifikasi",
    "/data-batik",
    "/evaluasi",
  ]) {
    await page.goto(`http://127.0.0.1:5173${route}`, {
      waitUntil: "networkidle",
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${route} overflows at ${width}`,
    );
  }
}
await page.setViewportSize({ width: 375, height: 812 });
await page.goto("http://127.0.0.1:5173/");
await page.getByRole("button", { name: "Buka menu" }).click();
await page
  .getByRole("navigation", { name: "Navigasi seluler" })
  .getByRole("link", { name: "Tentang", exact: true })
  .click();
assert.equal(
  await page.getByRole("navigation", { name: "Navigasi seluler" }).count(),
  0,
);
await page.goto("http://127.0.0.1:5173/");
await page.locator("img").evaluateAll((imgs) =>
  imgs.forEach((img) => {
    img.loading = "eager";
  }),
);
await page.evaluate(() =>
  Promise.all(
    Array.from(document.images).map((img) => img.decode().catch(() => {})),
  ),
);
await page.screenshot({
  path: "docs/screenshots/home-mobile.png",
  fullPage: true,
});
assert.deepEqual(errors, []);
console.log(
  "PASS: upload validation, demo prediction, upload lock, report download, save/reload/detail/delete history, gallery search/filter/modal, evaluation unavailable without demo controls, 15 route/viewport checks, mobile navigation; no page errors.",
);
await browser.close();
