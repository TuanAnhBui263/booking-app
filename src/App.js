import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Import pages
import HomePage from './components/pages/HomePage';
import TourListPage from './components/tours/TourListPage';
import TourDetailPage from './components/tours/TourDetailPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import BookingHistoryPage from './components/pages/BookingHistoryPage';  // ← THÊM DÒNG NÀY
import LoginPage from './components/auth/LoginPage';
import AdminPage from './components/pages/AdminPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />

          {/* Danh sách tour */}
          <Route path="/tours" element={
            <>
              <Header />
              <main className="pt-[120px]">
                <TourListPage />
              </main>
              <Footer />
            </>
          } />

          {/* Chi tiết tour */}
          <Route path="/tour/:id" element={
            <>
              <Header />
              <main className="pt-[80px]">
                <TourDetailPage />
              </main>
              <Footer />
            </>
          } />

          {/* Checkout */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Lịch sử đặt tour */}
          <Route path="/bookings" element={
            <>
              <Header />
              <main className="pt-[150px]">   {/* 👈 Thêm padding-top cho phần nội dung */}
                <BookingHistoryPage />
              </main>
              <Footer />
            </>
          } />  {/* ← THÊM ROUTE NÀY */}

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;