import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
let chartFile = "./src/components/SvgTrainingChart.jsx";
try {
  require.resolve("recharts");
  chartFile = "./src/components/RechartsTrainingChart.jsx";
} catch {
  /* Fallback offline, lihat README. */
}
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#training-chart": fileURLToPath(new URL(chartFile, import.meta.url)),
    },
  },
});
