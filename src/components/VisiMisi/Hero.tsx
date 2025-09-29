import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Hero = () => {
  return (
    <section className="py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
            Visi & Misi
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Panduan kami untuk masa depan yang lebih cerah dalam pendidikan kejuruan.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-school-green">Visi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Menjadi lembaga pendidikan kejuruan yang berkualitas dan berdaya saing tinggi
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-school-purple">Misi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 text-lg">
                <li>Merancang Pembelajaran yang menarik dan menyenangkan yang mampu memotivasi peserta didik untuk selalu belajar dan menemukan Pembelajaran </li>
                <li>menciptakan lingkungan sekolah yang membentuk Peserta didik memiliki Akhlak Mulia melalui Rutinitas Kegiatan Keagamaan dan Menerapkan Ajaran Agama melalui cara berinteraksi di sekolah</li>
                <li>Mengembangkan Program Sekolah dengan Ide dan Gagasan Cepat tanggap terhadap Perubahan yang terjadi untuk merancang inovasi</li>
                <li>Mengembangkan dan Memfasilitasi Peningkatan Prestasi Peserta didik sesuai minat dan bakatnya melalui proses Pendampingan dan Kerjasama dengan Orang Tua.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;