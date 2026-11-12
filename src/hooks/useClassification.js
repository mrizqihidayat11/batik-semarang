import { useState, useEffect, useRef } from "react";
import { predictImage } from "../services/predictionService";
import { validateImage } from "../utils/validation";
export default function useClassification() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const selectionVersion = useRef(0);
  const decoding = useRef(false);
  const working = useRef(false);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(
    () => () => {
      selectionVersion.current += 1;
    },
    [],
  );
  async function selectFile(next) {
    if (working.current) return;
    // Hanya pilihan terbaru yang boleh mengubah gambar, meski decoding selesai tidak berurutan.
    const version = ++selectionVersion.current;
    const message = validateImage(next);
    if (message) {
      decoding.current = false;
      setSelecting(false);
      setError(message);
      return;
    }
    decoding.current = true;
    setSelecting(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(next);
      bitmap.close();
      if (version !== selectionVersion.current) return;
      setFile(next);
      setPreview(URL.createObjectURL(next));
      setResult(null);
    } catch {
      if (version === selectionVersion.current)
        setError(
          "Gambar tidak dapat dibaca. Pilih file JPG atau PNG yang valid.",
        );
    } finally {
      if (version === selectionVersion.current) {
        decoding.current = false;
        setSelecting(false);
      }
    }
  }
  async function classify() {
    if (!file || working.current || decoding.current) return;
    working.current = true;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await predictImage(file));
    } catch (err) {
      setError(err.message || "Klasifikasi gagal. Coba kembali.");
    } finally {
      working.current = false;
      setLoading(false);
    }
  }
  function reset() {
    if (working.current) return;
    selectionVersion.current += 1;
    decoding.current = false;
    setSelecting(false);
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  }
  return {
    file,
    preview,
    result,
    error,
    loading,
    selecting,
    selectFile,
    classify,
    reset,
  };
}
