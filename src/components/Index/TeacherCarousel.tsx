import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TeacherCard } from "./TeacherCard";
import { Teacher } from "@/contexts/TeachersContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeacherCarouselProps {
  teachers: Teacher[];
  autoplayDelay?: number;
}

export const TeacherCarousel = ({
  teachers,
  autoplayDelay = 4000,
}: TeacherCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(autoplay);
  }, [emblaApi, autoplayDelay]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center text-card-foreground mb-8">
        Tenaga Pendidik
      </h2>
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-2"
              >
                <TeacherCard teacher={teacher} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {teachers.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-8 bg-primary"
                : "w-2 bg-border hover:bg-primary/50"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to teacher ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
