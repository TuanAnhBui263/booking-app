import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1600&q=80')`
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8">
          <span className="text-orange-500">ALPS</span>
          <span className="text-white ml-4">HIKING</span>
        </h1>
        
        <div className="h-20 w-1 bg-white mx-auto mb-8 opacity-50" />
        
        <a href="#tours">
          <button className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
            VIEW ALL TOURS
          </button>
        </a>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;