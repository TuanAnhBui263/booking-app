import React from 'react';
import { Clock, Users, MapPin, Star, ChevronRight } from 'lucide-react';

const TourCard = ({ tour }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
          ${tour.price}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < tour.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"} />
          ))}
          <span className="text-sm text-gray-600 ml-2">({tour.reviews} reviews)</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 hover:text-orange-500 cursor-pointer">
          {tour.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{tour.groupSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{tour.location}</span>
          </div>
        </div>
        
        <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
          Book Now
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TourCard;