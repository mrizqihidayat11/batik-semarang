import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Classification from "./pages/Classification";
import BatikData from "./pages/BatikData";
import Evaluation from "./pages/Evaluation";
import useApiStatus from "./hooks/useApiStatus";
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const names = {
      "/": "Beranda",
      "/tentang": "Tentang",
      "/klasifikasi": "Klasifikasi",
      "/data-batik": "Data Batik",
      "/evaluasi": "Evaluasi Model",
    };
    document.title = `${names[pathname] || "Halaman tidak ditemukan"} | BatikSemarang`;
  }, [pathname]);
  return null;
}
export default function App() {
  const connection = useApiStatus();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper focus:p-3"
      >
        Lewati ke konten
      </a>
      <div id="top" />
      <Navbar connection={connection} />
      <main id="main" className="min-h-[65vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<About />} />
          <Route
            path="/klasifikasi"
            element={<Classification connection={connection} />}
          />
          <Route path="/data-batik" element={<BatikData />} />
          <Route path="/evaluasi" element={<Evaluation />} />
          <Route
            path="*"
            element={
              <div className="px-5 py-24 text-center">
                <p className="text-xs tracking-widest text-brown">404</p>
                <h1 className="mt-4 font-display text-4xl">
                  Halaman tidak ditemukan.
                </h1>
                <Link
                  to="/"
                  className="mt-6 inline-block text-sm text-brown underline"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
