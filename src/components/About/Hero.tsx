import schoolHero from "@/assets/school-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${schoolHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-school-yellow">SMK</span>{" "}
            <span className="text-school-blue">Negeri 6</span>{" "}
            <span className="text-school-green">Makassar</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Membangun Generasi Unggul dengan Pendidikan Kejuruan Berkualitas dan Elegan
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <div className="bg-gradient-hero px-6 py-3 rounded-lg text-white font-semibold">
              🏆 Akreditasi A
            </div>
            <div className="bg-gradient-hero px-6 py-3 rounded-lg text-white font-semibold">
              ⭐ ISO 9001:2015
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;