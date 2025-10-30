import React from 'react';
import { Mountain, Phone, Mail, MapPin, Facebook, MessageCircle, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Thông tin công ty */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="text-orange-500" size={32} />
              <div className="font-bold text-xl">
                <span>HIKING</span>
                <span className="text-orange-500">TOUR</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Trải nghiệm vẻ đẹp hùng vĩ của dãy Alps cùng đội ngũ hướng dẫn viên chuyên nghiệp và những hành trình khó quên.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-500"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500"><MessageCircle size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-orange-500">Trang chủ</a></li>
              <li><a href="#tours" className="text-gray-400 hover:text-orange-500">Tour du lịch</a></li>
              <li><a href="#destinations" className="text-gray-400 hover:text-orange-500">Điểm đến</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-orange-500">Đánh giá</a></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500">Câu hỏi thường gặp (FAQ)</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ với chúng tôi</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} />
                <span>+41 21 634 05 05</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                <span>Booking@alpsshiking.co</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} />
                <span>Khu vực dãy Alps, Thụy Sĩ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Alps Hiking Tour. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
