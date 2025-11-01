import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Heart, ArrowRight } from 'lucide-react';

const PopularTours = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedTours, setLikedTours] = useState([]);

  const filters = [
    { id: 'all', label: 'Tất cả Tour' },
    { id: 'historical', label: 'Lịch sử' },
    { id: 'weekend', label: 'Cuối tuần' },
    { id: 'special', label: 'Đặc biệt' },
    { id: 'holiday', label: 'Kỳ nghỉ' }
  ];

  const tours = [
    {
      id: 1,
      title: "Tour Lịch Sử Canada",
      category: "historical",
      image: "https://images.unsplash.com/photo-1503891617560-5b8c2e28cbf6?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: "25% GIẢM",
      featured: false
    },
    {
      id: 2,
      title: "Tour Cuối Tuần Canada",
      category: "weekend",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: null,
      featured: false
    },
    {
      id: 3,
      title: "Tour Đặc Biệt Canada",
      category: "special",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: null,
      featured: false
    },
    {
      id: 4,
      title: "Tour Kỳ Nghỉ Canada",
      category: "holiday",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: null,
      featured: false
    },
    {
      id: 5,
      title: "Tour Mạo Hiểm Núi Cao",
      category: "special",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: null,
      featured: true
    },
    {
      id: 6,
      title: "Tour Khám Phá Biển",
      category: "weekend",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: null,
      featured: false
    },
    {
      id: 7,
      title: "Tour Thành Phổ Cổ",
      category: "historical",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: null,
      featured: false
    },
    {
      id: 8,
      title: "Tour Núi Non Hùng Vĩ",
      category: "holiday",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      location: "25/B Milford Road, New York",
      rating: 5.0,
      reviews: 2500,
      duration: "5 ngày 4 đêm",
      places: 10,
      price: 500,
      badge: "25% GIẢM",
      featured: false
    }
  ];

  const filteredTours = activeFilter === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === activeFilter);

  const toggleLike = (tourId) => {
    setLikedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  return (
    <section id="tours" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full mb-4">
            <MapPin size={18} />
            <span className="font-semibold text-sm uppercase tracking-wide">TOURS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tour Phổ Biến Nhất
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTours.map((tour) => (
            <div 
              key={tour.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={tour.image} 
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {tour.badge && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {tour.badge}
                    </span>
                  )}
                  {tour.featured && (
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg ml-auto">
                      NỔI BẬT
                    </span>
                  )}
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(tour.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all transform hover:scale-110 ${
                    likedTours.includes(tour.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart 
                    size={18} 
                    className={likedTours.includes(tour.id) ? 'fill-current' : ''} 
                  />
                </button>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-cyan-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <MapPin size={14} />
                    {tour.category === 'historical' ? 'Lịch sử' : 
                     tour.category === 'weekend' ? 'Cuối tuần' :
                     tour.category === 'special' ? 'Đặc biệt' : 'Kỳ nghỉ'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MapPin size={16} className="text-cyan-500" />
                  <span className="truncate">{tour.location}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2">
                  {tour.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-yellow-600">{tour.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Xuất sắc <span className="font-medium">({tour.reviews.toLocaleString('vi-VN')} Đánh giá)</span>
                  </span>
                </div>

                {/* Duration & Places */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-cyan-500" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-cyan-500" />
                    <span>{tour.places} Địa điểm</span>
                  </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Từ </span>
                    <span className="text-2xl font-bold text-red-500">
                      ${tour.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/tour`)}
                    className="flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all group"
                  >
                    <span>Xem thêm</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
          >
            <span>Xem tất cả tour</span>
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;