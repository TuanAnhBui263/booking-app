import React from 'react';
import { Mountain, MapPin, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mountain className="text-orange-500" size={48} />,
      title: "Professional Guides",
      description: "Expert local guides with years of mountain experience"
    },
    {
      icon: <MapPin className="text-orange-500" size={48} />,
      title: "Safe Routes",
      description: "Carefully selected and maintained hiking trails"
    },
    {
      icon: <Users className="text-orange-500" size={48} />,
      title: "Small Groups",
      description: "Intimate group sizes for personalized experience"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-orange-500">Us</span>
          </h2>
          <p className="text-gray-600 text-lg">Experience the Alps like never before</p>
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