export const API_URL = (
  import.meta.env?.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");
export const DEMO_MODE = import.meta.env?.VITE_PREDICTION_MODE !== "api";
export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    signal: options.signal || AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Permintaan gagal. Periksa backend dan coba kembali.",
    );
  return data;
}
