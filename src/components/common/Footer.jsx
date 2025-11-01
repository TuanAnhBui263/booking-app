import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Send, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Đăng ký nhận thông tin</h3>
              <p className="text-gray-400">Nhận ưu đãi và tin tức du lịch mới nhất từ Van Vi Vu</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="flex-1 md:w-80 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2">
                <Send size={18} />
                <span className="hidden sm:inline">Đăng ký</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img
                src="https://res.cloudinary.com/dosyknq32/image/upload/v1761962915/VanVivu_lifxyr.jpg"
                alt="Van Vi Vu Logo"
                className="h-20 w-auto object-contain rounded-lg mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-lg"
              />
              <p className="text-gray-400 leading-relaxed text-sm">
                Khám phá thế giới cùng Van Vi Vu - Đối tác du lịch đáng tin cậy của bạn với dịch vụ chuyên nghiệp và giá cả cạnh tranh.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 transition-all group"
              >
                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 transition-all group"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 transition-all group"
              >
                <Twitter size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 transition-all group"
              >
                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-cyan-400">Dịch vụ</h3>
            <ul className="space-y-3">
              {['Đặt vé máy bay', 'Khách sạn & Resort', 'Tours du lịch', 'Hoạt động & Trải nghiệm', 'Thuê xe', 'Visa & Hộ chiếu'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2 group">
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-cyan-400">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              {[
                'Trung tâm trợ giúp',
                'Chính sách thanh toán',
                'Chính sách hoàn hủy',
                'Điều khoản sử dụng',
                'Chính sách bảo mật',
                'Câu hỏi thường gặp'
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition flex items-center gap-2 group">
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-cyan-400">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 hover:text-cyan-400 transition group">
                <Phone size={20} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-white mb-1">Hotline 24/7</p>
                  <a href="tel:+41216340505" className="hover:underline">+41 21 634 05 05</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400 hover:text-cyan-400 transition group">
                <Mail size={20} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-white mb-1">Email hỗ trợ</p>
                  <a href="mailto:Booking@alpsshiking.co" className="hover:underline break-all">
                    Booking@alpsshiking.co
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400 group">
                <MapPin size={20} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-white mb-1">Địa chỉ</p>
                  <p>123 Đường Du Lịch, Quận 1<br />TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Phương thức thanh toán</p>
              <div className="flex gap-2 flex-wrap">
                {['Visa', 'Mastercard', 'JCB', 'Momo'].map((method) => (
                  <div 
                    key={method}
                    className="px-3 py-1.5 bg-white/10 rounded border border-white/20 text-xs font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; 2025 Van Vi Vu Travel. Mọi quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-cyan-400 transition">Điều khoản</a>
              <a href="#" className="hover:text-cyan-400 transition">Quyền riêng tư</a>
              <a href="#" className="hover:text-cyan-400 transition">Sitemap</a>
            </div>
          </div>
          
          {/* Certifications */}
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 items-center">
            <p className="text-xs text-gray-500">Chứng nhận & Đối tác:</p>
            {['Bộ VHTTDL', 'IATA', 'ASTA', 'PATA'].map((cert) => (
              <div 
                key={cert}
                className="px-3 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/10"
              >
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;