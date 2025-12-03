import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";

const HeroCarousel = () => {
  const { newsItems, loading } = useNews();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredNews, setFilteredNews] = useState([]);

  // Filter news items for hero carousel (published news only)
  useEffect(() => {
    if (newsItems && newsItems.length > 0) {
      const publishedNews = newsItems
        .filter(item => item.publikasi_berita === 'publikasi')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setFilteredNews(publishedNews);
    } else {
      setFilteredNews([]);
    }
  }, [newsItems]);

  useEffect(() => {
    if (filteredNews.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % filteredNews.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [filteredNews.length]);

  const nextSlide = () => {
    if (filteredNews.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % filteredNews.length);
    }
  };

  const prevSlide = () => {
    if (filteredNews.length > 1) {
      setCurrentSlide(
        (prev) => (prev - 1 + filteredNews.length) % filteredNews.length
      );
    }
  };

  if (loading) {
    return (
      <section className="relative h-[600px] bg-hero-bg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold">Loading...</h2>
        </div>
      </section>
    );
  }

  if (filteredNews.length === 0) {
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
      {filteredNews.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={item.gambar_berita}
            alt={item.judul_berita}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if loading fails
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-hero-text max-w-4xl px-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {filteredNews[currentSlide]?.judul_berita}
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              {filteredNews[currentSlide]?.ringkasan}
            </p>
            <Link to={`/preview/${filteredNews[currentSlide]?.id}`}>
              <Button variant="secondary" className="mt-4">Read More</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {filteredNews.length > 1 && (
        <>
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
        </>
      )}

      {/* Slide Indicators */}
      {filteredNews.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {filteredNews.map((_, index) => (
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
      )}
    </section>
  );
};

export default HeroCarousel;