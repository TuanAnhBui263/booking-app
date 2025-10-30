import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, Mỹ",
      text: "Trải nghiệm thật tuyệt vời! Hướng dẫn viên rất am hiểu và phong cảnh thì ngoạn mục. Rất đáng để thử!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      text: "Chuyến leo núi tuyệt nhất mà tôi từng tham gia. Mọi thứ đều được tổ chức chuyên nghiệp và nhóm vừa phải.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=13"
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "London, Anh",
      text: "Hành trình chinh phục Matterhorn là ước mơ thành hiện thực. Hướng dẫn viên rất chuyên nghiệp và luôn đảm bảo an toàn.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Khách hàng <span className="text-orange-500">nói gì</span> về chúng tôi
          </h2>
          <p className="text-gray-600 text-lg">Trải nghiệm thật từ những người đã tham gia</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-orange-500 text-orange-500" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
