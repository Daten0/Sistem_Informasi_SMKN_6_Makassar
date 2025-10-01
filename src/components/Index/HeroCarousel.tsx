import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNews } from "@/contexts/NewsContext";
import { Link } from "react-router-dom";


const HeroCarousel = () => {
  const { newsItems } = useNews();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselItems = newsItems.slice(0, 10);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  if (carouselItems.length === 0) {
    return (
      <section className="relative h-[600px] bg-hero-bg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold">No news available</h2>
          <p className="text-lg md:text-xl text-gray-200">Please add some news to see them here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[600px] bg-hero-bg overflow-hidden">
      {/* Background Images */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
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
              {carouselItems[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              {carouselItems[currentSlide].excerpt}
            </p>
            <Link to={`/preview/${carouselItems[currentSlide].id}`}>
              <Button variant="secondary" className="mt-4">Read More</Button>
            </Link>
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
        {carouselItems.map((_, index) => (
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