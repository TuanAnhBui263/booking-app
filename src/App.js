import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

import HomePage from './components/pages/HomePage';
import TourListPage from './components/tours/TourListPage';
import CheckoutPage from './components/checkout/CheckoutPage';
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />

          {/* Tour List Page Route */}
          <Route path="/tours" element={
            <>
              <Header />
              <main className="pt-[120px]">
                <TourListPage />
              </main>
              <Footer />
            </>
          } />

          {/* Checkout Page Route */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;