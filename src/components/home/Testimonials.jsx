import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "An absolutely incredible experience! The guides were knowledgeable and the views were breathtaking. Highly recommend!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      text: "Best hiking tour I've ever been on. Everything was well organized and the group size was perfect.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=13"
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "London, UK",
      text: "The Matterhorn trek was a dream come true. Professional guides made us feel safe throughout the journey.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-orange-500">Clients Say</span>
          </h2>
          <p className="text-gray-600 text-lg">Real experiences from real adventurers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
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