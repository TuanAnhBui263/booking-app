import React, { useState } from 'react';
import { MessageSquare, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Diana Carter",
      role: "Khách hàng của chúng tôi",
      text: "Có nhiều biến thể của các đoạn văn có sẵn nhưng đa số đã bị thay đổi dưới một số hình thức, bằng sự hài hước được chèn vào hoặc các từ ngẫu nhiên.",
      rating: 5,
      image: "https://i.pravatar.cc/200?img=1"
    },
    {
      id: 2,
      name: "Brandon Wigfall",
      role: "Khách hàng của chúng tôi",
      text: "Có nhiều biến thể của các đoạn văn có sẵn nhưng đa số đã bị thay đổi dưới một số hình thức, bằng sự hài hước được chèn vào hoặc các từ ngẫu nhiên.",
      rating: 5,
      image: "https://i.pravatar.cc/200?img=13"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Khách hàng của chúng tôi",
      text: "Trải nghiệm thật tuyệt vời! Hướng dẫn viên rất am hiểu và phong cảnh thì ngoạn mục. Rất đáng để thử! Mọi thứ đều được tổ chức chuyên nghiệp.",
      rating: 5,
      image: "https://i.pravatar.cc/200?img=5"
    },
    {
      id: 4,
      name: "Michael Chen",
      role: "Khách hàng của chúng tôi",
      text: "Chuyến leo núi tuyệt nhất mà tôi từng tham gia. Mọi thứ đều được tổ chức chuyên nghiệp và nhóm vừa phải. Tôi chắc chắn sẽ quay lại!",
      rating: 5,
      image: "https://i.pravatar.cc/200?img=12"
    }
  ];

  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage >= testimonials.length ? 0 : prev + itemsPerPage));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - itemsPerPage < 0 ? Math.max(0, testimonials.length - itemsPerPage) : prev - itemsPerPage));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm text-cyan-300 px-4 py-2 rounded-full mb-4 border border-cyan-400/30">
            <MessageSquare size={16} />
            <span className="font-semibold text-xs uppercase tracking-wider">Đánh Giá</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Khách Hàng Nói Gì Về Chúng Tôi?
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative max-w-3xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-cyan-400/50 overflow-hidden shadow-lg">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name and Role */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-1">
                {testimonials[currentIndex].name}
              </h3>
              <p className="text-cyan-300 text-sm">
                {testimonials[currentIndex].role}
              </p>
            </div>

            {/* Review Text */}
            <p className="text-white/90 text-center leading-relaxed mb-8 text-lg">
              "{testimonials[currentIndex].text}"
            </p>

            {/* Rating Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  className="fill-cyan-400 text-cyan-400" 
                />
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all rounded-full ${
                    currentIndex === idx
                      ? 'w-8 h-2 bg-cyan-400'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;