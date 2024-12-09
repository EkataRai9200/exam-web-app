import { Badge } from "@/components/ui/badge";

const IndonesiaInstructionsContent = () => {
  return (
    <div>
      <div>
        <h5 className="font-semibold underline">
          Bacalah Petunjuk berikut dengan hati-hati
          <br />
          <b>
            <u>Petunjuk Umum:</u>
          </b>
          <br />
        </h5>
      </div>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2">
        <li>
          Waktu telah diatur pada server ujian dan hitungan waktu mundur berada
          pada sudut sebelah kanan atas di layar komputer anda, yang akan
          menunjukkan sisa waktu yang anda miliki untuk menyelesaikan ujian.
          Ketika waktu ujian telah habis maka ujian secara otomatis akan
          berakhir. Anda tidak perlu untuk mengakhiri ataupun menekan tombol
          kirim ujian.
        </li>
        <li>
          Palet soal pada sebelah kanan layar anda menunjukkan status dari
          setiap nomor soal:
          <div className="flex flex-col gap-2">
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-200 text-dark">
                1
              </Badge>
              <span>Anda belum mengunjungi soal tersebut sama sekali</span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-600">
                1
              </Badge>
              <span>Anda belum menjawab soal tersebu. </span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-600">
                1
              </Badge>
              <span>Anda telah menjawab soal tersebut</span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-600">
                1
              </Badge>
              <span>
                Anda belum menjawab soal tersebut tetapi telah menandainya untuk
                ditinjau ulang.
              </span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-600">
                1
              </Badge>
              <span>
                Anda telah menjawab soal tersebut dan menandainya untuk di
                tinjau ulang.
              </span>
            </div>
          </div>
        </li>
        <li style={{ listStyleType: "none" }}>
          Pilihan “Mark for Review “ sederhananya berfungsi sebagai pengingat
          bahwa anda menandai soal terkait untuk ditinjau ulang.{" "}
          <i className="text-red-600">
            Jika jawaban terpilih untuk sebuah soal yang ditandai untuk ditinjau
            ulang, jawaban tersebut akan dipertimbangan sebagai evaluasi jawaban
            terakhir.
          </i>
        </li>
      </ol>
      <br />
      <b>
        <u>Panduan soal:</u>
      </b>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={4}>
        <li>
          Untuk memilih jawaban, anda bisa memilih satu dari cara berikut:
          <ol
            className="my-4 ml-2 md:ml-6 list-[lower-alpha] [&>li]:mt-2"
            type="a"
          >
            <li>
              Ketuk nomor soal pada kolom palet soal yang ada disebelah kanan
              layar anda untuk secara langsung diarahkan ke soal sesuai nomor
              yang sudah ditentukan. Perlu dicatat bahwa menggunakan cara ini
              TIDAK akan secara langsung menyimpan jawaban anda kepada soal
              terkait
            </li>
            <li>
              Ketuk <b>“Save and Next”</b> (Simpan dan Lanjutkan) untuk
              menyimpan jawaban pada soal terkait dan untuk melanjutkan ke soal
              ataupun laman soal selanjutnya. Klik tombol{" "}
              <b>“Mark for Review & Next”</b> untuk menyimpan jawaban soal
              terkait, dan untuk melanjutkan ke sesi pertanyaan selanjutnya.
            </li>
          </ol>
        </li>
        <li>
          Anda bisa melihat keseluruhan soal secara umum dengan mengetuk tombol{" "}
          <b>“Question Paper”</b>.
        </li>
      </ol>
      <br />
      <b>
        <u>Panduan dalam menjawab soal:</u>
      </b>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={6}>
        <li>
          Untuk tipe soal pilihan berganda,
          <ol
            className="my-4 ml-2 md:ml-6 list-[lower-alpha] [&>li]:mt-2"
            type="a"
          >
            <li>Ketuk salah satu pada tombol pilihan jawaban</li>
            <li>
              Untuk mengubah jawaban, ketuk pada tombol pilihan jawaban lain
              yang diinginkan.
            </li>
            <li>
              Untuk menyimpan jawaban, kamu HARUS mengetuk tombol{" "}
              <b>“Save and Next”</b> (Simpan dan Lanjutkan)
            </li>
            <li>
              Untuk membatalkan pilihan, ketuk pada tombol jawaban yang dipilih
              sebelumnya dan tekan tombol <b>“Clear Response”</b> (Bersihkan
              Jawaban)
            </li>
            <li>
              Untuk menandai soal untuk ditinjau ulang, ketuk{" "}
              <b>“Mark for Review and Next”</b>.{" "}
              <i className="text-red-600">
                Jika jawaban yang dipilih untuk sebuah soal ditandai untuk
                ditinjau ulang (“Mark for Review) jawaban tersebut akan
                dipertimbangan sebagai evaluasi jawaban terakhir
              </i>
            </li>
          </ol>
        </li>
        <li>
          Untuk mengubah jawaban dari soal terkait, pertama pilih soal tersebut
          kemudian klik pilihan jawaban yang baru dan pilih tombol{" "}
          <b>“Save & Next”</b>
        </li>
        <li>
          Soal yang disimpan dan ditandai untuk ditinjau ulang setelah menjawab
          soal tersebut, HANYA akan dipertimbangkan sebagai evaluasi saja.
        </li>
      </ol>
      <br />
      <b>
        <u>Panduan antar laman ujian:</u>
      </b>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={9}>
        <li>
          Laman ujian untuk lembar soal ini akan ditampilkan pada bagian kolom
          atas di layar anda. Soal dari laman ujian terkait bisa dilihat dengan
          mengetuk nama laman ujian. Laman ujian yang sedang anda buka akan
          disorot.
        </li>
        <li>
          Setelah mengetuk tombol <b>“Save and Next”</b> pada soal terakhir
          sebuah laman ujian, anda akan secara otomatis dialihkan ke laman ujian
          berikutnya.
        </li>
        <li>
          Anda bisa menggerakkan kursor pada setiap nama laman ujian untuk
          melihat status soal dari laman ujian terkait
        </li>
        <li>
          Anda bisa mengacak antar soal dan laman ujian sesuai dengan kenyamanan
          anda selama ujian berlangsung.
        </li>
      </ol>
    </div>
  );
};

export default IndonesiaInstructionsContent;
