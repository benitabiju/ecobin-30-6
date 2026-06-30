import React, { useState, useEffect } from 'react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Routed by Data, Not Guesswork",
      subtitle: "EcoBin connects citizens, collectors, and admins around real bin fill-levels and recycling outcomes.",
      accent: "text-[#74A980]",
      svg: (
        <svg className="w-full h-full opacity-80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4" className="text-eco-sage/20 dark:text-white/10" strokeDasharray="10 10"/>
          <path d="M100 20V180M20 100H180" stroke="currentColor" strokeWidth="4" className="text-[#74A980]"/>
          <circle cx="100" cy="100" r="40" fill="currentColor" className="text-eco-forest dark:text-eco-charcoal opacity-50"/>
          <circle cx="150" cy="50" r="12" fill="#74A980" className="animate-pulse" />
          <circle cx="50" cy="150" r="8" fill="#74A980" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
      )
    },
    {
      title: "Smart Sensors, Cleaner Cities",
      subtitle: "Stop sending trucks to empty bins. Our IoT sensors tell you exactly when a pickup is needed.",
      accent: "text-emerald-400",
      svg: (
        <svg className="w-full h-full opacity-80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="50" y="60" width="100" height="120" rx="10" stroke="currentColor" strokeWidth="6" className="text-eco-sage/20 dark:text-white/20"/>
          <path d="M40 60H160M80 60V30C80 24.4772 84.4772 20 90 20H110C115.523 20 120 24.4772 120 30V60" stroke="currentColor" strokeWidth="6" className="text-emerald-400"/>
          <path d="M70 90V150M100 90V150M130 90V150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-eco-forest dark:text-eco-sage"/>
        </svg>
      )
    },
    {
      title: "Track Your Real Eco Impact",
      subtitle: "Every completed pickup feeds real environmental reporting. See your CO₂ saved and tons recycled.",
      accent: "text-teal-400",
      svg: (
        <svg className="w-full h-full opacity-80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 180C100 180 170 140 170 80C170 40 130 20 100 50C70 20 30 40 30 80C30 140 100 180 100 180Z" stroke="currentColor" strokeWidth="6" className="text-teal-400" fill="transparent"/>
          <path d="M100 180C100 180 140 150 140 100" stroke="currentColor" strokeWidth="4" className="text-eco-sage/30 dark:text-white/20"/>
          <circle cx="100" cy="80" r="20" fill="currentColor" className="text-teal-400 opacity-50 animate-bounce" />
        </svg>
      )
    }
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-[#050A14] border-b border-eco-sage/10">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex items-center min-h-[600px]">
        
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center px-6 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pr-0 md:pr-12">
              <span className="text-xs uppercase tracking-widest text-eco-mint font-semibold bg-eco-sage/10 py-1.5 px-3 rounded-full mb-6">
                Welcome to EcoBin
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-eco-forest dark:text-white mb-6 leading-tight">
                {slide.title.split(',')[0]}
                {slide.title.includes(',') && ','}
                <br />
                <span className={slide.accent}>{slide.title.split(',')[1]}</span>
              </h1>
              <p className="text-eco-mint dark:text-eco-sage text-lg mb-10 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex gap-4">
                <button className="bg-[#74A980] hover:bg-eco-sage text-[#0A1220] font-bold tracking-widest text-sm uppercase py-3.5 px-8 rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                  Request Pickup
                </button>
                <button className="bg-white dark:bg-eco-charcoal border border-eco-sage/30 text-eco-forest dark:text-white font-bold tracking-widest text-sm uppercase py-3.5 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md">
                  Explore Platform
                </button>
              </div>
            </div>

            {/* SVG Graphic */}
            <div className="w-full md:w-1/2 h-64 md:h-96 mt-12 md:mt-0 flex justify-center items-center">
              <div className={`w-full max-w-sm transform transition-transform duration-1000 ${index === currentSlide ? 'scale-100' : 'scale-90'}`}>
                {slide.svg}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#74A980] w-8' : 'bg-eco-sage/40 hover:bg-eco-sage/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}