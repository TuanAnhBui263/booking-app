import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Import pages
import HomePage from './components/pages/HomePage';
import TourListPage from './components/tours/TourListPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import LoginPage from './components/auth/LoginPage';
import AdminPage from './components/pages/AdminPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />

          {}
          <Route path="/tours" element={
            <>
              <Header />
              <main className="pt-[120px]">
                <TourListPage />
              </main>
              <Footer />
            </>
          } />

          {}
          <Route path="/checkout" element={<CheckoutPage />} />

          {}
          <Route path="/login" element={<LoginPage />} />

          {}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;