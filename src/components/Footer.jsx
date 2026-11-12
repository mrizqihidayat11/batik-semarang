import { Link } from "react-router-dom";
import { ArrowUpRight, Heart } from "lucide-react";
import Brand from "./Brand";
export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#EFECE4]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] lg:px-12">
        <div>
          <Link to="/">
            <Brand />
          </Link>
          <p className="mt-4 max-w-sm text-xs leading-6 text-muted">
            Menjembatani warisan budaya Semarang dengan teknologi kecerdasan
            buatan.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold">Jelajahi aplikasi</p>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
            <Link to="/tentang">Tentang penelitian</Link>
            <Link to="/data-batik">Koleksi motif</Link>
            <Link to="/evaluasi">Evaluasi model</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold">
            Dibangun untuk penelitian{" "}
            <ArrowUpRight className="ml-1 inline" size={13} />
          </p>
          <p className="text-xs leading-6 text-muted">
            MobileNetV3 · Deep Learning
            <br />
            Batik Semarang Classification System
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1224px] flex-wrap justify-between gap-3 border-t border-line px-5 py-5 text-[10px] text-muted">
        <span>
          © {new Date().getFullYear()} BatikSemarang. Proyek penelitian
          akademik.
        </span>
        <span className="flex items-center gap-1.5">
          Dibuat dengan <Heart size={11} className="text-brown" /> untuk warisan
          budaya Indonesia
        </span>
      </div>
    </footer>
  );
}
