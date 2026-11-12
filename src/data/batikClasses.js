// Daftar galeri bukan urutan output model. Mapping model harus diekspor dari Colab.
const names = [
  "Asem Arang",
  "Asem Sinom",
  "Asem Warak",
  "Blekok",
  "Blekok Warak",
  "Gambang Semarangan",
  "Kembang Sepatu",
  "Semarangan",
  "Tugu Muda",
  "Warak Beras Utah",
];
export const batikClasses = names.map((name, index) => ({
  id: String(index + 1).padStart(2, "0"),
  name: `Batik Cap ${name}`,
  shortName: name,
  image: `/images/motif-${index + 1}.svg`,
  description:
    "Dokumentasi dan deskripsi motif ini belum ditambahkan. Informasi akan dilengkapi menggunakan sumber penelitian yang terverifikasi.",
}));
