import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mountain, Phone, Mail, User, ShoppingBag, Menu, X, Facebook, MessageCircle, Twitter } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const searchSection = document.getElementById('search');
        if (searchSection) searchSection.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else {
      const searchSection = document.getElementById('search');
      if (searchSection) searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {}
      <div className="bg-gray-100 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <a href="tel:+41216340505" className="flex items-center gap-2 text-gray-700 hover:text-orange-500">
              <Phone size={16} />
              <span>+41 21 634 05 05</span>
            </a>
            <a href="mailto:Booking@alpsshiking.co" className="flex items-center gap-2 text-gray-700 hover:text-orange-500">
              <Mail size={16} />
              <span>Booking@alpsshiking.co</span>
            </a>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#" className="text-gray-600 hover:text-orange-500"><Facebook size={18} /></a>
            <a href="#" className="text-gray-600 hover:text-orange-500"><MessageCircle size={18} /></a>
            <a href="#" className="text-gray-600 hover:text-orange-500"><Twitter size={18} /></a>
          </div>
        </div>
      </div>

      {/* Thanh điều hướng chính */}
      <nav className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Mountain className="text-orange-500" size={32} />
            <div className="font-bold text-xl">
              <span className="text-gray-800">HIKING</span>
              <span className="text-orange-500">TOUR</span>
            </div>
          </div>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gray-800 font-medium hover:text-orange-500 transition">TRANG CHỦ</Link>
            <Link to="/tours" className="text-gray-600 hover:text-orange-500 transition">DANH SÁCH TOUR</Link>
            <button onClick={handleSearchClick} className="text-gray-600 hover:text-orange-500 transition">
              TÌM KIẾM TOUR
            </button>
            <a href="#destinations" className="text-gray-600 hover:text-orange-500 transition">ĐIỂM ĐẾN</a>
            <a href="#testimonials" className="text-gray-600 hover:text-orange-500 transition">ĐÁNH GIÁ</a>
            <a href="#contact" className="text-gray-600 hover:text-orange-500 transition">LIÊN HỆ</a>
          </div>

          {/* Menu bên phải */}
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-orange-500">
              <User size={20} />
              <span>Đăng nhập</span>
            </button>
            <button className="relative">
              <ShoppingBag className="text-gray-600 hover:text-orange-500" size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>

            {}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/" className="text-gray-800 font-medium hover:text-orange-500">TRANG CHỦ</Link>
              <Link to="/tours" className="text-gray-600 hover:text-orange-500">DANH SÁCH TOUR</Link>
              <button onClick={handleSearchClick} className="text-left text-gray-600 hover:text-orange-500">TÌM KIẾM TOUR</button>
              <a href="#destinations" className="text-gray-600 hover:text-orange-500">ĐIỂM ĐẾN</a>
              <a href="#testimonials" className="text-gray-600 hover:text-orange-500">ĐÁNH GIÁ</a>
              <a href="#contact" className="text-gray-600 hover:text-orange-500">LIÊN HỆ</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
