import React, { useState } from 'react';
import { Clock, Users, MapPin, Star, ChevronRight, Heart, TrendingUp } from 'lucide-react';

const TourCard = ({ tour, onBookNow }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          ${tour.price}
        </div>

        {/* Featured Badge */}
        {tour.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <TrendingUp size={14} />
            NỔI BẬT
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-all transform hover:scale-110 ${
            isLiked
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
          }`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
        </button>

        {/* Difficulty Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
            tour.difficulty === 'Dễ' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
            tour.difficulty === 'Trung bình' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
            'bg-gradient-to-r from-red-500 to-pink-500 text-white'
          }`}>
            {tour.difficulty}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin size={16} className="text-cyan-500" />
          <span className="font-medium">{tour.location}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2 min-h-[56px]">
          {tour.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < tour.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            ({tour.reviews} đánh giá)
          </span>
        </div>
        
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Clock size={16} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Thời lượng</p>
              <p className="font-semibold text-gray-900">{tour.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nhóm</p>
              <p className="font-semibold text-gray-900">{tour.groupSize}</p>
            </div>
          </div>
        </div>
        
        {/* Book Button */}
        <button 
          onClick={() => onBookNow(tour)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
        >
          <span>Đặt ngay</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TourCard;