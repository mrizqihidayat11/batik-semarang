export function getConnectionStatus(health, demoMode = false) {
  if (demoMode)
    return {
      state: "demo",
      label: "Mode DEMO",
      message:
        "Prediksi simulasi aktif. Website belum menggunakan model melalui API.",
    };
  if (health?.status === "ok" && health.model_connected === true)
    return {
      state: "connected",
      label: "API aktif",
      message:
        "Backend terhubung dan model MobileNetV3 siap melakukan prediksi.",
    };
  if (health?.status === "ok" && health.model_connected === false)
    return {
      state: "model_unavailable",
      label: "Model belum siap",
      message:
        "Backend aktif, tetapi model belum berhasil dimuat. Periksa terminal backend.",
    };
  return {
    state: "offline",
    label: "API tidak terhubung",
    message:
      "Backend belum dapat diakses. Nyalakan backend Python, lalu klik Cek koneksi.",
  };
}
