import React from 'react';
import { Compass, Award, Users, ArrowRight, Shield, Heart } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Chất lượng đảm bảo",
      description: "Cam kết mang đến trải nghiệm tốt nhất"
    },
    {
      icon: Shield,
      title: "An toàn tuyệt đối",
      description: "Đội ngũ hướng dẫn chuyên nghiệp"
    },
    {
      icon: Heart,
      title: "Dịch vụ tận tâm",
      description: "Hỗ trợ 24/7 trong suốt hành trình"
    },
    {
      icon: Users,
      title: "Cộng đồng sôi động",
      description: "Kết nối với hàng nghìn du khách"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Images Section */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main Large Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
                  alt="Leo núi"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Small Overlapping Image */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                  alt="Núi tuyết"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Experience Badge */}
              <div className="absolute -top-6 -left-6 z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-40">
                  <div className="text-5xl font-black text-gray-900 mb-1">30+</div>
                  <div className="text-sm font-semibold text-gray-600 leading-tight">
                    Năm kinh nghiệm
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-1/2 -left-4 w-24 h-24 bg-gray-100 rounded-full -z-10"></div>
              <div className="absolute bottom-20 -right-4 w-32 h-32 bg-gray-50 rounded-full -z-10"></div>
            </div>
          </div>

          {/* Right: Content Section */}
          <div className="order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full mb-6">
              <Compass size={18} />
              <span className="font-semibold text-sm uppercase tracking-wide">Về chúng tôi</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Đồng hành cùng bạn trên mọi{' '}
              <span className="relative inline-block">
                <span className="relative z-10">hành trình</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-gray-200 -z-10"></span>
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Với hơn 30 năm kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực 
              du lịch phiêu lưu. Mỗi hành trình là một câu chuyện, và chúng tôi ở đây để biến 
              giấc mơ của bạn thành hiện thực.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                        <feature.icon className="text-gray-700 group-hover:text-white transition-colors" size={20} strokeWidth={2} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-snug">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 hover:shadow-xl transition-all group">
              <span>Tìm hiểu thêm</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;