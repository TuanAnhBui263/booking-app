import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Calendar, Users, Clock, Star, ChevronRight, X, Filter, Heart, Loader, ChevronLeft, Award } from 'lucide-react';

const TourListPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [likedTours, setLikedTours] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: 10000000,
    difficulty: [],
    rating: null,
    duration: []
  });

  // Sample data for demo
  const sampleTours = [
    {
      id: 1,
      name: 'Chinh phục đỉnh Fansipan',
      location: 'Sapa, Lào Cai',
      price: 4500000,
      rating: 4.8,
      reviews: 234,
      duration: '3 ngày 2 đêm',
      maxGuests: 12,
      difficulty: 'Thử thách',
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: 2,
      name: 'Khám phá núi Bà Đen',
      location: 'Tây Ninh',
      price: 2800000,
      rating: 4.5,
      reviews: 156,
      duration: '2 ngày 1 đêm',
      maxGuests: 15,
      difficulty: 'Trung bình',
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
    },
    {
      id: 3,
      name: 'Leo núi Pù Luông',
      location: 'Thanh Hóa',
      price: 3200000,
      rating: 4.7,
      reviews: 189,
      duration: '3 ngày 2 đêm',
      maxGuests: 10,
      difficulty: 'Trung bình',
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80'
    },
    {
      id: 4,
      name: 'Trekking Tà Xùa',
      location: 'Sơn La',
      price: 3800000,
      rating: 4.9,
      reviews: 201,
      duration: '2 ngày 1 đêm',
      maxGuests: 8,
      difficulty: 'Thử thách',
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80'
    },
    {
      id: 5,
      name: 'Chinh phục Lảo Thẩn',
      location: 'Yên Bái',
      price: 2500000,
      rating: 4.3,
      reviews: 98,
      duration: '1 ngày',
      maxGuests: 20,
      difficulty: 'Dễ',
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: 6,
      name: 'Adventure Núi Chứa Chan',
      location: 'Đồng Nai',
      price: 1800000,
      rating: 4.2,
      reviews: 145,
      duration: '1 ngày',
      maxGuests: 25,
      difficulty: 'Dễ',
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80'
    }
  ];

  useEffect(() => {
    fetchTours();
  }, [page, filters, sortBy]);

  useEffect(() => {
    setLikedTours([1, 3]);
  }, []);

  const fetchTours = () => {
    setLoading(true);
    
    setTimeout(() => {
      let filteredTours = [...sampleTours];

      // Apply search filter
      if (searchQuery.trim()) {
        filteredTours = filteredTours.filter(tour =>
          tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply price filter
      if (filters.minPrice) {
        filteredTours = filteredTours.filter(tour => tour.price >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredTours = filteredTours.filter(tour => tour.price <= parseInt(filters.maxPrice));
      }

      // Apply difficulty filter
      if (filters.difficulty.length > 0) {
        filteredTours = filteredTours.filter(tour => 
          filters.difficulty.includes(tour.difficulty)
        );
      }

      // Apply rating filter
      if (filters.rating) {
        filteredTours = filteredTours.filter(tour => tour.rating >= filters.rating);
      }

      // Apply duration filter
      if (filters.duration.length > 0) {
        filteredTours = filteredTours.filter(tour => {
          const days = parseInt(tour.duration);
          return filters.duration.some(range => {
            if (range === '1-3 ngày') return days >= 1 && days <= 3;
            if (range === '4-6 ngày') return days >= 4 && days <= 6;
            if (range === '7-9 ngày') return days >= 7 && days <= 9;
            if (range === '10+ ngày') return days >= 10;
            return false;
          });
        });
      }

      // Apply sorting
      if (sortBy === 'price-asc') {
        filteredTours.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filteredTours.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filteredTours.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'featured') {
        filteredTours.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }

      setTours(filteredTours);
      setTotalPages(Math.ceil(filteredTours.length / pageSize));
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    setPage(1);
    fetchTours();
  };

  const toggleLike = (tourId) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    setLikedTours(prev => {
      if (prev.includes(tourId)) {
        return prev.filter(id => id !== tourId);
      } else {
        return [...prev, tourId];
      }
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'difficulty' || filterType === 'duration') {
        const currentValues = prev[filterType];
        if (currentValues.includes(value)) {
          return { ...prev, [filterType]: currentValues.filter(v => v !== value) };
        } else {
          return { ...prev, [filterType]: [...currentValues, value] };
        }
      } else {
        return { ...prev, [filterType]: value };
      }
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: 10000000,
      difficulty: [],
      rating: null,
      duration: []
    });
    setSearchQuery('');
    setPage(1);
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`bg-white rounded-2xl shadow-lg ${isMobile ? 'p-6' : 'p-6 sticky top-24'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-500" />
          Bộ lọc
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Khoảng giá</h4>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="10000000"
            step="100000"
            value={filters.maxPrice || 10000000}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-sm text-gray-700 mt-3 mb-2">
            <span>0 đ</span>
            <span className="font-semibold text-cyan-600">
              {filters.maxPrice 
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(filters.maxPrice)
                : '10,000,000+ đ'}
            </span>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Kéo để chọn giá tối đa
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Thời lượng</h4>
        <div className="space-y-2">
          {['1-3 ngày', '4-6 ngày', '7-9 ngày', '10+ ngày'].map(duration => (
            <label key={duration} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.duration.includes(duration)}
                onChange={() => handleFilterChange('duration', duration)}
                className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-700 group-hover:text-cyan-600 transition-colors">
                {duration}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Mức độ khó</h4>
        <div className="space-y-2">
          {['Dễ', 'Trung bình', 'Thử thách', 'Chuyên nghiệp'].map(level => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.difficulty.includes(level)}
                onChange={() => handleFilterChange('difficulty', level)}
                className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-700 group-hover:text-cyan-600 transition-colors">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Đánh giá</h4>
        <div className="space-y-2">
          {[5, 4, 3].map(rating => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleFilterChange('rating', rating)}
                className="w-5 h-5 text-cyan-500 focus:ring-cyan-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-700 ml-1">& hơn</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Summer Deal Banner */}
      <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl p-4 text-white">
        <div className="flex items-start gap-3">
          <Award className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-1">Ưu đãi mùa hè!</h4>
            <p className="text-sm opacity-90 mb-3">Tiết kiệm đến 30% cho các tour chọn lọc</p>
            <button className="bg-white text-pink-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all">
              Xem ưu đãi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const displayedTours = tours.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🏔️ TOURS
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Khám Phá Tất Cả Tour
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Trải nghiệm những cuộc phiêu lưu leo núi tuyệt vời khắp Việt Nam
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2 max-w-2xl mx-auto relative z-10">
              <div className="flex-1 flex items-center gap-3 px-4 bg-white">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tour, địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full py-3 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex-shrink-0"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSection />
          </div>

          {/* Tours Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Đang tải...' : `${tours.length} tour hiện có`}
                </h2>
                <p className="text-gray-600 mt-1">Hãy chọn hành trình phù hợp nhất với bạn</p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none bg-white"
              >
                <option value="featured">Gợi ý</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Tour Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-12 h-12 text-cyan-500 animate-spin" />
              </div>
            ) : displayedTours.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">Không tìm thấy tour nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}
                      </div>

                      {tour.isFeatured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          NỔI BẬT
                        </div>
                      )}

                      <button
                        onClick={() => toggleLike(tour.id)}
                        className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-all ${
                          likedTours.includes(tour.id)
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                            : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedTours.includes(tour.id) ? 'fill-current' : ''}`} />
                      </button>

                      {tour.difficulty && (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                          {tour.difficulty}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm">{tour.location}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors cursor-pointer">
                        {tour.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(tour.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {tour.rating} ({tour.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-500" />
                          <span>Thời lượng</span>
                        </div>
                        <span className="font-semibold">{tour.duration}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-500" />
                          <span>Nhóm</span>
                        </div>
                        <span className="font-semibold">Tối đa {tour.maxGuests} người</span>
                      </div>

                      <button
                        onClick={() => navigate(`/tour?id=${tour.id}`)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group"
                      >
                        Đặt ngay
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </button>

                {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-5 py-3 rounded-xl font-medium transition-all ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                          : 'border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-2xl z-40 hover:shadow-cyan-500/50 transition-all"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Bộ lọc</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <FilterSection isMobile />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => {
                  setShowMobileFilters(false);
                  fetchTours();
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourListPage;