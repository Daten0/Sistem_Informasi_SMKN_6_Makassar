import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import carousel1 from "@/assets/carousel-1.jpg";
import carousel2 from "@/assets/carousel-2.jpg";
import carousel3 from "@/assets/carousel-3.jpg";
import carousel4 from "@/assets/carousel-4.jpg";
import carousel5 from "@/assets/carousel-5.jpg";
import carousel6 from "@/assets/carousel-6.jpg";

const carouselImages = [
  {
    src: carousel1,
    alt: "Gambar Desain Komunikasi Visual",
    title: "Desain Komunikasi Visual",
    description: "Program Desain Komunikasi Visual"
  },
  {
    src: carousel2,
    alt: "Gambar Tata Boga", 
    title: "Tata Boga",
    description: "Program Tata Boga"
  },
  {
    src: carousel3,
    alt: "Perhotelan",
    title: "Perhotelan", 
    description: "Program Perhotelan"
  },
  {
    src: carousel4,
    alt: "Akutansi",
    title: "Akutansi",
    description: "Program Akutansi"
  },
  {
    src: carousel5,
    alt: "Tata Kecantikan",
    title: "Tata Kecantikan",
    description: "Program Tata Kecantikan"
  },
  {
    src: carousel6,
    alt: "Tata Busana",
    title: "Tata Busana",
    description: "Program Tata Busana"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section className="relative h-[600px] bg-hero-bg overflow-hidden">
      {/* Background Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-hero-text max-w-4xl px-6">
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {carouselImages[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              {carouselImages[currentSlide].description}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-hero-text hover:bg-white/10"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-hero-text hover:bg-white/10"
        onClick={nextSlide}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-white" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;