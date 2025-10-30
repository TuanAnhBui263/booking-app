import React from 'react';
import HeroSection from '../home/HeroSection';
import FeaturesSection from '../home/FeaturesSection';
import PopularTours from '../home/PopularTours';
import SearchForm from '../home/SearchForm';
import Testimonials from '../home/Testimonials';

const HomePage = () => {
  return (
    <main className="pt-[120px]">
      <HeroSection />
      <FeaturesSection />
      <PopularTours />
      <SearchForm />
      <Testimonials />
    </main>
  );
};

export default HomePage;