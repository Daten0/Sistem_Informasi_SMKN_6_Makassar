import principalImage from "@/assets/principal.png";

const PrincipalProfile = () => {
  return (
    <section className="py-16 px-6 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side: Image and Name */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
            <div className="relative w-full max-w-xs">
              <img
                src={principalImage}
                alt="Principal Profile"
                className="rounded-lg object-cover shadow-lg w-full"
              />
            </div>
            <div className="mt-4 text-center md:text-left w-full">
              <h3 className="text-xl font-bold text-foreground mt-4">
                A. Nursyidah Galigo, S.Pd.,M.Pd
              </h3>
              <p className="text-muted-foreground">
                Kepala Sekolah SMK Negeri 6 Makassar
              </p>
            </div>
          </div>

          {/* Right side: Welcome message */}
          <div className="w-full md:w-2/3">
            <p className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Sambutan Kepala Sekolah
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Selamat Datang Untukmu Para Pendekar Baru
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Puji Syukur kita panjatkan ke hadirat Tuhan yang Maha Kuasa, atas segala 
                rahmat dan hidayah-Nya sehingga kita masih diberi kesempatan untuk 
                berkarya dan berkembang di bidang pendidikan; karena pendidikan merupakan upaya kita untuk menyiapkan generasi yang berkualitas, elegan, dan Terdidik
                yang akan menjadi teladan di era penuh Teknologi ke depan nya.
              </p>
              <p>
                Kami mengucapkan selamat datang di website resmi SMK Negeri 6 
                Makassar yang dapat digunakan sebagai salah satu media penyedia informasi berkualitas
                terkait pemberitaan mengenai keseharian, Informasi Tiap Kejuruan, dan juga para pengajar di SMK Negeri 6 Makassar
              </p>
              <p>
                Mari kita berjuang dengan mendorong kualitas pendidikan, dan mengharapkan
                ridho dan keikhlasan Tuhan yang tulus demi menyiapkan generasi bangsa 
                yang berintegritas dan berprestasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalProfile;