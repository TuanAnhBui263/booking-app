import './index.css';
import Header from './components/common/Header';
import HeroSection from './components/home/HeroSection';
import FeaturesSection from './components/home/FeaturesSection';
import PopularTours from './components/home/PopularTours';
import SearchForm from './components/home/SearchForm';
import Testimonials from './components/home/Testimonials';
import Footer from './components/common/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[120px]">
        <HeroSection />
        <FeaturesSection />
        <PopularTours />
        <SearchForm />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default App;
