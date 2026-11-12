import Modal from "./Modal";
export default function MotifDetail({ batik, onClose }) {
  return (
    <Modal title={batik.name} onClose={onClose}>
      <img
        src={batik.image}
        alt="Ilustrasi placeholder, bukan dokumentasi motif asli"
        className="h-60 w-full rounded-lg object-cover"
      />
      <p className="mt-3 text-[10px] font-semibold tracking-wider text-brown">
        ILUSTRASI PLACEHOLDER · BUKAN FOTO MOTIF ASLI
      </p>
      <p className="mt-5 text-sm leading-7 text-muted">{batik.description}</p>
      <div className="mt-5 rounded-lg border border-line bg-cream p-4 text-xs leading-6">
        Karakteristik, filosofi, dan sumber: belum tersedia. Ganti gambar dan
        deskripsi melalui data koleksi setelah dokumentasi penelitian tersedia.
      </div>
    </Modal>
  );
}
