import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  ChevronRight,
  WalletCards,
  Mountain,
  TrendingUp,
  Award,
  X,
  Filter,
  Heart,
  Loader
} from 'lucide-react';

const TourListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [likedTours, setLikedTours] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    difficulty: [],
    rating: null,
    duration: []
  });

  useEffect(() => {
    fetchTours();
  }, [page, searchQuery, filters]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const searchParams = {
        keyword: searchQuery || null,
        pageNumber: page,
        pageSize: pageSize,
        minPrice: filters.minPrice > 0 ? filters.minPrice : null,
        maxPrice: filters.maxPrice < 10000000 ? filters.maxPrice : null,
        minRating: filters.rating || null,
        sortBy: 'created',
        sortDesc: true
      };
      
      console.log('Fetching tours with params:', searchParams);
      const response = await tourService.searchTours(searchParams);
      console.log('Search tours response:', response);
      
      let toursData = [];
      let totalPagesCount = 1;
      
      if (Array.isArray(response)) {
        toursData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        toursData = response.data;
        totalPagesCount = response.totalPages || response.TotalPages || 1;
      } else if (response?.Data && Array.isArray(response.Data)) {
        toursData = response.Data;
        totalPagesCount = response.TotalPages || response.totalPages || 1;
      } else if (response?.items && Array.isArray(response.items)) {
        toursData = response.items;
        totalPagesCount = response.totalPages || 1;
      } else if (response?.Items && Array.isArray(response.Items)) {
        toursData = response.Items;
        totalPagesCount = response.TotalPages || 1;
      } else {
        console.log('Trying fallback: getAllTours');
        const allToursResponse = await tourService.getAllTours(page, pageSize);
        console.log('All tours response:', allToursResponse);
        
        if (Array.isArray(allToursResponse)) {
          toursData = allToursResponse;
        } else if (allToursResponse?.data && Array.isArray(allToursResponse.data)) {
          toursData = allToursResponse.data;
          totalPagesCount = allToursResponse.totalPages || allToursResponse.TotalPages || 1;
        } else if (allToursResponse?.Data && Array.isArray(allToursResponse.Data)) {
          toursData = allToursResponse.Data;
          totalPagesCount = allToursResponse.TotalPages || allToursResponse.totalPages || 1;
        } else if (allToursResponse?.items && Array.isArray(allToursResponse.items)) {
          toursData = allToursResponse.items;
          totalPagesCount = allToursResponse.totalPages || 1;
        } else if (allToursResponse?.Items && Array.isArray(allToursResponse.Items)) {
          toursData = allToursResponse.Items;
          totalPagesCount = allToursResponse.TotalPages || 1;
        }
      }
      
      toursData = applyClientFilters(toursData);
      
      console.log('Final tours data:', toursData);
      setTours(toursData);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error('Error fetching tours:', error);
      try {
        const featuredResponse = await tourService.getFeaturedTours(10);
        let toursData = [];
        if (Array.isArray(featuredResponse)) {
          toursData = featuredResponse;
        } else if (featuredResponse?.data && Array.isArray(featuredResponse.data)) {
          toursData = featuredResponse.data;
        } else if (featuredResponse?.Data && Array.isArray(featuredResponse.Data)) {
          toursData = featuredResponse.Data;
        }
        toursData = applyClientFilters(toursData);
        setTours(toursData);
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
        setTours([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyClientFilters = (toursData) => {
    let filtered = [...toursData];

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(tour => {
        const tourDifficulty = (tour.difficulty || tour.Difficulty || '').toLowerCase();
        return filters.difficulty.some(d => {
          if (d === 'Dễ') return tourDifficulty === 'easy' || tourDifficulty === 'dễ';
          if (d === 'Trung bình') return tourDifficulty === 'medium' || tourDifficulty === 'trung bình';
          if (d === 'Thử thách') return tourDifficulty === 'hard' || tourDifficulty === 'thử thách' || tourDifficulty === 'challenging';
          if (d === 'Chuyên nghiệp') return tourDifficulty === 'expert' || tourDifficulty === 'chuyên nghiệp' || tourDifficulty === 'professional';
          return false;
        });
      });
    }

    if (filters.duration.length > 0) {
      filtered = filtered.filter(tour => {
        const durationDays = tour.durationDays || tour.DurationDays || 0;
        return filters.duration.some(d => {
          if (d === '1-3 ngày') return durationDays >= 1 && durationDays <= 3;
          if (d === '4-6 ngày') return durationDays >= 4 && durationDays <= 6;
          if (d === '7-9 ngày') return durationDays >= 7 && durationDays <= 9;
          if (d === '10+ ngày') return durationDays >= 10;
          return false;
        });
      });
    }

    return filtered;
  };

  const fetchFavorites = async () => {
    try {
      const response = await favoriteService.getMyFavorites();
      console.log('Favorites response:', response);
      if (Array.isArray(response)) {
        const favoriteIds = response.map(fav => fav.tourId || fav.TourId);
        setLikedTours(favoriteIds);
        console.log('Liked tours:', favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleLike = async (tourId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Optimistic UI update
    const isCurrentlyLiked = likedTours.includes(tourId);
    if (isCurrentlyLiked) {
      setLikedTours(prev => prev.filter(id => id !== tourId));
    } else {
      setLikedTours(prev => [...prev, tourId]);
    }

    try {
      const response = await favoriteService.toggleFavorite(tourId);
      console.log('Toggle favorite response:', response);
      
      // Sync with server response
      if (response.isFavorite || response.IsFavorite) {
        setLikedTours(prev => prev.includes(tourId) ? prev : [...prev, tourId]);
      } else {
        setLikedTours(prev => prev.filter(id => id !== tourId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      if (isCurrentlyLiked) {
        setLikedTours(prev => [...prev, tourId]);
      } else {
        setLikedTours(prev => prev.filter(id => id !== tourId));
      }
    }
  };

  const handleBookTour = (tour) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const tourId = tour.id || tour.Id;
    
    if (!tourId) {
      console.error('Tour ID is missing:', tour);
      alert('Không thể xác định tour. Vui lòng thử lại.');
      return;
    }
    
    navigate(`/tour?id=${tourId}`, {
      state: {
        tourData: tour
      }
    });
  };

  const handleSearch = () => {
    setPage(1);
    fetchTours();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'difficulty' || filterType === 'duration') {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else if (filterType === 'rating') {
        newFilters.rating = newFilters.rating === value ? null : value;
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 10000000,
      difficulty: [],
      rating: null,
      duration: []
    });
    setSearchQuery('');
    setPage(1);
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const FilterSection = ({ mobile = false }) => (
    <div className={mobile ? "p-6" : "p-6"}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-cyan-600" />
          Bộ lọc
        </h2>
        <button 
          onClick={clearAllFilters}
          className="text-cyan-600 text-sm font-semibold hover:underline"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Price Range Slider */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
          <WalletCards size={18} className="text-cyan-600" />
          Khoảng giá
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Giá tối thiểu: {formatCurrency(filters.minPrice)} đ</label>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Giá tối đa: {formatCurrency(filters.maxPrice)} đ</label>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              {formatCurrency(filters.minPrice)} đ
            </span>
            <span className="text-xs text-gray-400">đến</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              {formatCurrency(filters.maxPrice)} đ
            </span>
          </div>
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
              <input 
                type="checkbox" 
                className="accent-cyan-600 w-4 h-4 rounded"
                checked={filters.duration.includes(duration)}
                onChange={() => handleFilterChange('duration', duration)}
              />
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
              <input 
                type="checkbox" 
                className="accent-cyan-600 w-4 h-4 rounded"
                checked={filters.difficulty.includes(level)}
                onChange={() => handleFilterChange('difficulty', level)}
              />
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
              <input 
                type="radio" 
                name={mobile ? "rating-mobile" : "rating"} 
                className="accent-cyan-600 w-4 h-4"
                checked={filters.rating === rating}
                onChange={() => handleFilterChange('rating', rating)}
              />
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="Mountain background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

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
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
                >
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
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <FilterSection />
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

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="text-xl font-bold">Bộ lọc</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
                <FilterSection mobile={true} />
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-bold"
                  >
                    Áp dụng bộ lọc
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-2xl z-40 hover:shadow-cyan-500/50 transition-all"
          >
            <Filter size={24} />
          </button>

          {/* Tours Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {loading ? 'Đang tải...' : `${tours.length} tour hiện có`}
                </h2>
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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-cyan-500" size={48} />
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Không tìm thấy tour nào</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {tours.map((tour, index) => {
                  const tourId = tour.id || tour.Id;
                  const tourName = tour.name || tour.Name || tour.title || 'Tour';
                  const tourImage = tour.primaryImageUrl || tour.PrimaryImageUrl || tour.imageUrl || tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
                  const tourLocation = tour.location || tour.Location || tour.destinationName || tour.DestinationName || 'N/A';
                  const tourPrice = tour.price || tour.Price || 0;
                  const tourRating = tour.averageRating || tour.AverageRating || tour.rating || 0;
                  const tourReviews = tour.totalReviews || tour.TotalReviews || tour.reviews || 0;
                  const tourDuration = tour.duration || tour.Duration || `${tour.durationDays || tour.DurationDays || 0} ngày`;
                  const tourMaxGuests = tour.maxGuests || tour.MaxGuests || tour.places || 0;
                  const tourIsFeatured = tour.isFeatured || tour.IsFeatured || false;
                  const tourDifficulty = tour.difficulty || tour.Difficulty || '';
                  
                  return (
                  <div
                    key={tourId || `tour-${index}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={tourImage}
                      alt={tourName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(tourPrice)}
                    </div>

                    {tourIsFeatured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <TrendingUp size={14} />
                        NỔI BẬT
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(tourId);
                      }}
                      className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-all ${likedTours.includes(tourId)
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                          : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
                        }`}
                    >
                      <Heart size={18} className={likedTours.includes(tourId) ? 'fill-current' : ''} />
                    </button>

                    {tourDifficulty && (
                    <div className="absolute bottom-4 left-4">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                          tourDifficulty === 'Easy' || tourDifficulty === 'Dễ' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                          tourDifficulty === 'Medium' || tourDifficulty === 'Trung bình' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                            'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        }`}>
                          {tourDifficulty}
                      </span>
                    </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <MapPin size={16} className="text-cyan-500" />
                      <span className="font-medium">{tourLocation}</span>
                    </div>

                    <h3
                      onClick={() => {
                        const id = tourId || tour.id || tour.Id;
                        if (id) {
                          navigate(`/tour?id=${id}`);
                        }
                      }}
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors cursor-pointer hover:underline"
                    >
                      {tourName}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.floor(tourRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">({tourReviews})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-cyan-50 rounded-lg">
                          <Clock size={16} className="text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Thời lượng</p>
                          <p className="font-semibold text-gray-900">{tourDuration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nhóm</p>
                          <p className="font-semibold text-gray-900">Tối đa {tourMaxGuests} người</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const tourWithId = {
                          ...tour,
                          id: tourId || tour.id || tour.Id
                        };
                        handleBookTour(tourWithId);
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Đặt ngay</span>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                );
                })}
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
                <button 
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Trước
              </button>
                {[...Array(totalPages)].map((_, idx) => {
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
                  className="px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Sau
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListPage;