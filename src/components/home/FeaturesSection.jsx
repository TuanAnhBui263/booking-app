import React from 'react';
import { Mountain, MapPin, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mountain className="text-orange-500" size={48} />,
      title: "Hướng dẫn viên chuyên nghiệp",
      description: "Hướng dẫn viên địa phương giàu kinh nghiệm, am hiểu địa hình núi"
    },
    {
      icon: <MapPin className="text-orange-500" size={48} />,
      title: "Lộ trình an toàn",
      description: "Các cung đường được chọn lọc và bảo trì cẩn thận"
    },
    {
      icon: <Users className="text-orange-500" size={48} />,
      title: "Nhóm nhỏ",
      description: "Số lượng nhóm nhỏ để trải nghiệm được cá nhân hóa"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tại sao chọn <span className="text-orange-500">chúng tôi</span>
          </h2>
          <p className="text-gray-600 text-lg">Trải nghiệm dãy Alps như chưa từng có</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
