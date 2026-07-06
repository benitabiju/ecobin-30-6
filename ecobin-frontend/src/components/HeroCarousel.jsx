import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../assets/images/hero_bg_1.png';
import hero2 from '../assets/images/hero_bg_2.png';

export default function HeroCarousel() {
 const [currentSlide, setCurrentSlide] = useState(0);

 const slides = [
 {
 title: "Routed by Data, Not Guesswork",
 subtitle: "EcoBin connects citizens, collectors, and admins around real bin fill-levels and recycling outcomes.",
 accent: "text-eco-sage",
 image: hero1
 },
 {
 title: "Smart Pickups, Cleaner Cities",
 subtitle: "Stop worrying about trash accumalation. Our Platform helps with clear it out.",
 accent: "text-eco-sage",
 image: hero2
 }
 ];

 // Auto-slide logic
 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
 }, 7000);
 return () => clearInterval(timer);
 }, [slides.length]);

 return (
 <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-eco-darkBg border-b border-eco-sage/10">

 {slides.map((slide, index) => (
 <div
 key={index}
 className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
 }`}
 >
 {/* Background Image with Overlay */}
 <div
 className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[10000ms] ease-out scale-105"
 style={{
 backgroundImage: `url(${slide.image})`,
 transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)'
 }}
 />
 <div className="absolute inset-0 bg-gradient-to-r from-eco-darkBg via-eco-darkBg/70 to-transparent" />
 <div className="absolute inset-0 bg-eco-darkBg/30" />

 {/* Text Content */}
 <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
 <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-start text-left">
 <span className="text-xs uppercase tracking-widest text-eco-earth font-bold bg-eco-sage/20 border border-eco-sage/30 py-1.5 px-4 rounded-full mb-6 backdrop-blur-md">
 Welcome to EcoBin
 </span>
 <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] drop-shadow-2xl">
 {slide.title.split(',')[0]}
 {slide.title.includes(',') && ','}
 <br />
 <span className={`${slide.accent} drop-shadow-[0_0_15px_rgba(144,169,85,0.4)]`}>
 {slide.title.split(',')[1]}
 </span>
 </h1>
 <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg leading-relaxed drop-shadow-md">
 {slide.subtitle}
 </p>
 <div className="flex flex-col sm:flex-row gap-4">
 <Link to="/login" className="bg-eco-mint hover:bg-eco-sage text-white font-bold tracking-widest text-sm uppercase py-4 px-8 rounded-lg transition-all glow-emerald text-center">
 Request Pickup
 </Link>
 <Link to="/about" className="glass-panel text-white hover:bg-white/10 font-bold tracking-widest text-sm uppercase py-4 px-8 rounded-lg transition-all text-center">
 Explore Platform
 </Link>
 </div>
 </div>
 </div>
 </div>
 ))}

 {/* Carousel Dots */}
 <div className="absolute bottom-8 left-6 md:left-auto md:right-12 z-30 flex gap-3">
 {slides.map((_, index) => (
 <button
 key={index}
 onClick={() => setCurrentSlide(index)}
 className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-eco-sage w-8 shadow-[0_0_10px_rgba(144,169,85,0.8)]' : 'bg-white/40 w-2.5 hover:bg-white/70'
 }`}
 aria-label={`Go to slide ${index + 1}`}
 />
 ))}
 </div>
 </div>
 );
}