import { useCallback, useEffect, useState } from "react";
import { DEMO_MODE, request } from "../services/api";
import { getConnectionStatus } from "../utils/apiStatus";

export default function useApiStatus() {
  const [connection, setConnection] = useState(() =>
    DEMO_MODE
      ? { ...getConnectionStatus(null, true), checking: false }
      : {
          state: "checking",
          label: "Memeriksa API...",
          message: "Memeriksa koneksi backend dan kesiapan model.",
          checking: true,
        },
  );
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => {
    if (DEMO_MODE) return;
    setConnection((previous) => ({ ...previous, checking: true }));
    setVersion((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) return;
    let disposed = false;
    let inFlight = false;
    const controller = new AbortController();
    async function check() {
      if (inFlight || disposed) return;
      inFlight = true;
      try {
        const signal = AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(5000),
        ]);
        const health = await request("/health", { signal });
        if (!disposed)
          setConnection({ ...getConnectionStatus(health), checking: false });
      } catch {
        if (!disposed)
          setConnection({ ...getConnectionStatus(null), checking: false });
      } finally {
        inFlight = false;
      }
    }
    function checkWhenVisible() {
      if (document.visibilityState === "visible") check();
    }
    check();
    // Satu polling bersama untuk seluruh halaman, bukan satu polling per indikator.
    const interval = setInterval(checkWhenVisible, 15000);
    window.addEventListener("focus", checkWhenVisible);
    window.addEventListener("online", checkWhenVisible);
    window.addEventListener("offline", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      disposed = true;
      controller.abort();
      clearInterval(interval);
      window.removeEventListener("focus", checkWhenVisible);
      window.removeEventListener("online", checkWhenVisible);
      window.removeEventListener("offline", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [version]);
  return { ...connection, refresh };
}
