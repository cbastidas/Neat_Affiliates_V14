import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./lib/supabaseClient";
import { useSearchParams } from "react-router-dom";
import TestimonialsEditor from "./TestimonialsEditor";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  title: string;
  content: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ------------------------------------------------------------
  // Fetch testimonials from Supabase
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setTestimonials(data || []);
    };
    fetchTestimonials();
  }, []);

  // ------------------------------------------------------------
  // Get width of ONE slide depending on device size
  // Each slide is w-full (mobile), w-1/2 (tablet), w-1/3 (desktop)
  // ------------------------------------------------------------
  const getSlideWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;

    const firstSlide = track.querySelector(".slide") as HTMLElement;
    if (!firstSlide) return 0;

    return firstSlide.clientWidth;
  }, []);

  // ------------------------------------------------------------
  // Move to specific slide using translateX
  // ------------------------------------------------------------
  const goTo = useCallback(
    (newIndex: number) => {
      const total = testimonials.length;
      const track = trackRef.current;
      if (!track) return;

      const slideWidth = getSlideWidth();

      // Infinite loop wrap
      const finalIndex = (newIndex + total) % total;

      track.style.transform = `translateX(-${finalIndex * slideWidth}px)`;
      setIndex(finalIndex);
    },
    [testimonials.length, getSlideWidth]
  );

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // ------------------------------------------------------------
  // Auto-slide every 4 seconds
  // ------------------------------------------------------------
  const startAuto = useCallback(() => {
    stopAuto();
    intervalRef.current = setInterval(() => next(), 4000);
  }, [next]);

  const stopAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    startAuto();
    return stopAuto;
  }, [testimonials, startAuto, stopAuto]);

  // ------------------------------------------------------------
  // Recalculate transform on resize
  // ------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => goTo(index);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [goTo, index]);

  if (isAdmin) return <TestimonialsEditor />;
  if (testimonials.length === 0) return null;

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <section
      id="Testimonials"
      className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50"
    >
      <h2 className="text-4xl font-bold mb-4 text-purple-900">✨ Testimonials</h2>
      <p className="text-lg text-gray-600 mb-12">
        Here is what our partners say about us.
      </p>

      <div className="max-w-6xl mx-auto relative overflow-hidden">

        {/* Left arrow */}
        <button
          onClick={prev}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 
                     bg-white p-2 rounded-full shadow border hover:bg-gray-100 z-10"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>

        {/* Slider Track */}
        <div
          ref={trackRef}
          className="flex transition-transform duration-700 ease-out"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="slide w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
            >
              <div className="bg-white p-6 rounded-xl shadow border border-gray-100 text-left h-full hover:border-purple-300 transition-all">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t.title}
                </h3>

                <p className="text-gray-700 leading-relaxed italic border-l-4 border-purple-300 pl-3">
                  "{t.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 
                     bg-white p-2 rounded-full shadow border hover:bg-gray-100 z-10"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`
                h-2.5 rounded-full transition-all
                ${i === index ? "bg-purple-700 w-6" : "bg-gray-300 w-2.5"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
