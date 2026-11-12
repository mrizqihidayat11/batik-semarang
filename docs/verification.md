# Verification - 12 November 2026

- Frontend production build: PASS.
- ESLint: PASS.
- Node tests: 8 PASS (uploads, evaluation schema, corrupted history).
- Python unittest: 7 PASS (evaluation validator, including DEMO rejection).
- Python compileall: PASS.
- Chrome browser: PASS for DEMO upload/prediction, decoding lock, delete/resave, persistence, download, gallery, modal, evaluation, mobile menu.
- Responsive overflow: PASS for all five routes at 375, 768, 1440 pixels.
- Browser API mode: PASS with intercepted test HTTP response; multipart payload, low-confidence warning, and backend 503 without DEMO fallback verified.
- Independent code review: three findings fixed and re-reviewed; no important remaining findings.

## Limits

Real Python HTTP endpoints not started: FastAPI/Pillow dependencies unavailable and terminal network restricted. Recharts adapter exists; SVG chart fallback is active and verified because Recharts is not cached locally. Actual model, preprocessing, mapping, and evaluation artifacts are not supplied. Gallery assets are decorative placeholders. No inference accuracy or actual dataset count is claimed.

## Browser reproduction

Run frontend DEMO at 5173, then npm run test:browser.
For API test, launch a separate Vite process in API mode at port 5174, then npm run test:browser:api.
The API test intercepts network requests and does not validate the Python implementation.


## Model integration update

User supplied batik_final.tflite, labels.txt, and preprocess_spec.json. TensorFlow 2.21.0 is installed in backend/.venv. Ten Python tests pass, including exact preprocessing parity with the notebook pipeline and actual TFLite inference. Live HTTP smoke checks passed: health connected, ten verified classes, multipart inference with is_demo false, CORS, corrupt image 400, and metrics unavailable. Smoke inputs are synthetic and do not measure accuracy. The earlier backend-unavailable limitation is resolved. Frontend mode remains unchanged pending the next guided step; evaluation artifacts and Colab reference-image comparison remain outstanding.


## Dataset and Keras artifact update

Dataset counts extracted directly from saved notebook outputs (cell index 3): 3021 initial, 28 duplicate files ignored, 2993 unique, per-class totals checked against labels.txt. API now exposes the validated summary and unique total. Keras confusion_matrix.png is served as a separate original image with explicit Keras FP32 provenance, not relabeled TFLite. The TFLite confusion_matrix JSON field remains null. Original training_curves.png is also served, with numeric training history left empty. Frontend dataset information uses API metadata rather than copied counts.
