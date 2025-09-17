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
                Menjadi lembaga pendidikan kejuruan yang unggul, menghasilkan lulusan yang kompeten, berkarakter, dan siap bersaing di era global.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-school-purple">Misi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 text-lg">
                <li>Menyelenggarakan pendidikan dan pelatihan kejuruan yang berkualitas dan relevan dengan kebutuhan industri.</li>
                <li>Mengembangkan kurikulum yang adaptif terhadap perkembangan ilmu pengetahuan dan teknologi.</li>
                <li>Membentuk siswa yang berakhlak mulia, mandiri, dan memiliki jiwa wirausaha.</li>
                <li>Meningkatkan kerjasama dengan dunia usaha dan dunia industri untuk program magang dan penyerapan lulusan.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;