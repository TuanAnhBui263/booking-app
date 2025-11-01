import React from 'react';
import HeroSection from '../home/HeroSection';
import  AboutSection from '../home/AboutSection';
import PopularTours from '../home/PopularTours';
import DestinationsSection from '../home/DestinationsSection';
import Testimonials from '../home/Testimonials';

const HomePage = () => {
  return (
    <main className="pt-[120px]">
      <HeroSection />
      <AboutSection />
      <PopularTours />
      <DestinationsSection />
      <Testimonials />
    </main>
  );
};

export default HomePage;