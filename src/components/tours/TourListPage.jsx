import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  ChevronRight,
  DollarSign,
  Mountain,
  TrendingUp,
  Award,
  X,
  Filter,
  Heart
} from 'lucide-react';

const TourListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [likedTours, setLikedTours] = useState([]);

  const allTours = [
    {
      id: 1,
      title: "Hành Trình Dưới Chân Matterhorn",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      price: 299,
      duration: "5 ngày",
      groupSize: "8-12 người",
      location: "Thụy Sĩ",
      rating: 5,
      reviews: 128,
      difficulty: "Trung bình",
      featured: true
    },
    {
      id: 2,
      title: "Vòng Quanh Núi Mont Blanc",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      price: 499,
      duration: "7 ngày",
      groupSize: "6-10 người",
      location: "Pháp",
      rating: 5,
      reviews: 94,
      difficulty: "Thử thách",
      featured: true
    },
    {
      id: 3,
      title: "Phiêu Lưu Dolomites",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      price: 399,
      duration: "6 ngày",
      groupSize: "8-14 người",
      location: "Ý",
      rating: 4,
      reviews: 76,
      difficulty: "Trung bình",
      featured: false
    },
    {
      id: 4,
      title: "Khám Phá Dãy Alps Thụy Sĩ",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      price: 599,
      duration: "8 ngày",
      groupSize: "6-8 người",
      location: "Thụy Sĩ",
      rating: 5,
      reviews: 112,
      difficulty: "Thử thách",
      featured: false
    },
    {
      id: 5,
      title: "Đường Mòn Núi Austria",
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
      price: 349,
      duration: "5 ngày",
      groupSize: "10-15 người",
      location: "Áo",
      rating: 4,
      reviews: 89,
      difficulty: "Dễ",
      featured: false
    },
    {
      id: 6,
      title: "Hành Trình Khu Vực Jungfrau",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      price: 449,
      duration: "6 ngày",
      groupSize: "8-12 người",
      location: "Thụy Sĩ",
      rating: 5,
      reviews: 156,
      difficulty: "Trung bình",
      featured: false
    }
  ];

  const toggleLike = (tourId) => {
    setLikedTours(prev =>
      prev.includes(tourId)
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleBookTour = (tour) => {
    // Điều hướng đến trang checkout và truyền dữ liệu tour
    navigate('/checkout', {
      state: {
        tourData: {
          id: tour.id,
          title: tour.title,
          image: tour.image,
          price: tour.price,
          location: tour.location,
          duration: tour.duration,
          groupSize: tour.groupSize
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="Mountain background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{
          clipPath: 'ellipse(80% 100% at 50% 100%)'
        }}></div>

        <div className="max-w-7xl mx-auto relative z-10 text-white">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 border border-white/30">
              <MapPin size={18} />
              <span className="font-semibold text-sm uppercase tracking-wide">TOURS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">Khám Phá Tất Cả Tour</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Trải nghiệm những cuộc phiêu lưu leo núi tuyệt vời khắp dãy Alps
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-2">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="text-gray-600" size={24} />
                  <input
                    type="text"
                    placeholder="Tìm tour theo tên, địa điểm hoặc hoạt động..."
                    className="w-full py-4 text-gray-800 text-lg focus:outline-none placeholder:text-gray-400 bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap">
                  Tìm kiếm
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filters Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-cyan-600" />
                    Bộ lọc
                  </h2>
                  <button className="text-cyan-600 text-sm font-semibold hover:underline">
                    Xóa tất cả
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <DollarSign size={18} className="text-cyan-600" />
                    Khoảng giá
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    className="w-full accent-cyan-600 h-2 bg-gray-200 rounded-lg"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-3">
                    <span className="font-medium">$0</span>
                    <span className="font-medium">$1000+</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Clock size={18} className="text-cyan-600" />
                    Thời lượng
                  </h3>
                  <div className="space-y-3">
                    {['1-3 ngày', '4-6 ngày', '7-9 ngày', '10+ ngày'].map(duration => (
                      <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="accent-cyan-600 w-4 h-4 rounded" />
                        <span className="text-gray-700 group-hover:text-cyan-600 transition-colors">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Mountain size={18} className="text-cyan-600" />
                    Mức độ khó
                  </h3>
                  <div className="space-y-3">
                    {['Dễ', 'Trung bình', 'Thử thách', 'Chuyên nghiệp'].map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="accent-cyan-600 w-4 h-4 rounded" />
                        <span className="text-gray-700 group-hover:text-cyan-600 transition-colors">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Star size={18} className="text-cyan-600" />
                    Đánh giá
                  </h3>
                  <div className="space-y-3">
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="rating" className="accent-cyan-600 w-4 h-4" />
                        <div className="flex items-center gap-2">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-gray-700 group-hover:text-cyan-600 transition-colors">& hơn</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summer Deal */}
              <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={24} />
                    <h3 className="text-xl font-bold">Ưu đãi mùa hè!</h3>
                  </div>
                  <p className="mb-4 text-cyan-50">Tiết kiệm đến 30% cho các tour chọn lọc</p>
                  <button className="w-full bg-white text-cyan-600 py-3 rounded-xl font-bold hover:bg-cyan-50 transition-colors shadow-lg">
                    Xem ưu đãi
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-2xl z-40 hover:shadow-cyan-500/50 transition-all"
          >
            <Filter size={24} />
          </button>

          {/* Tours Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{allTours.length} tour hiện có</h2>
                <p className="text-gray-600 mt-1">Hãy chọn hành trình phù hợp nhất với bạn</p>
              </div>
              <select className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium text-gray-700">
                <option>Sắp xếp: Gợi ý</option>
                <option>Giá: Tăng dần</option>
                <option>Giá: Giảm dần</option>
                <option>Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Tour Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {allTours.map(tour => (
                <div
                  key={tour.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      ${tour.price}
                    </div>

                    {tour.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <TrendingUp size={14} />
                        NỔI BẬT
                      </div>
                    )}

                    <button
                      onClick={() => toggleLike(tour.id)}
                      className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-all ${likedTours.includes(tour.id)
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                          : 'bg-white/90 backdrop-blur-sm text-gray-600'
                        }`}
                    >
                      <Heart size={18} className={likedTours.includes(tour.id) ? 'fill-current' : ''} />
                    </button>

                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${tour.difficulty === 'Dễ' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                          tour.difficulty === 'Trung bình' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                            'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        }`}>
                        {tour.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <MapPin size={16} className="text-cyan-500" />
                      <span className="font-medium">{tour.location}</span>
                    </div>

                    <h3
                      onClick={() => navigate('/tour')}
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors cursor-pointer hover:underline"
                    >
                      {tour.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < tour.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">({tour.reviews})</span>
                    </div>

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

                    <button
                      onClick={() => handleBookTour(tour)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Đặt ngay</span>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium">
                Trước
              </button>
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${page === 1
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListPage;