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
  Filter
} from 'lucide-react';

const TourListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    duration: [],
    difficulty: [],
    groupSize: 'all',
    rating: 0
  });

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
    },
    {
      id: 7,
      title: "Khám Phá Dãy Pyrenees",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      price: 279,
      duration: "4 ngày",
      groupSize: "12-16 người",
      location: "Pháp",
      rating: 4,
      reviews: 67,
      difficulty: "Dễ",
      featured: false
    },
    {
      id: 8,
      title: "Thiên Đường Núi Alps",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      price: 529,
      duration: "7 ngày",
      groupSize: "6-10 người",
      location: "Ý",
      rating: 5,
      reviews: 143,
      difficulty: "Thử thách",
      featured: false
    },
    {
      id: 9,
      title: "Hành Trình Glacier Express",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      price: 689,
      duration: "9 ngày",
      groupSize: "4-8 người",
      location: "Thụy Sĩ",
      rating: 5,
      reviews: 98,
      difficulty: "Thử thách",
      featured: true
    }
  ];

  const handleBookNow = (tour) => {
    navigate('/checkout', { state: { tour } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Phần tiêu đề */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Khám Phá Tất Cả Tour</h1>
          <p className="text-xl mb-8 text-orange-100">Trải nghiệm những cuộc phiêu lưu leo núi tuyệt vời khắp dãy Alps</p>
          
          {/* Thanh tìm kiếm */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Tìm tour theo tên, địa điểm hoặc hoạt động..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:ring-4 focus:ring-orange-300 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Bộ lọc bên trái */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Bộ lọc */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    Bộ lọc
                  </h2>
                  <button className="text-orange-500 text-sm hover:underline">
                    Xóa tất cả
                  </button>
                </div>

                {/* Giá */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign size={18} />
                    Khoảng giá
                  </h3>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>$0</span>
                    <span>$1000+</span>
                  </div>
                </div>

                {/* Thời lượng */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock size={18} />
                    Thời lượng
                  </h3>
                  <div className="space-y-2">
                    {['1-3 ngày', '4-6 ngày', '7-9 ngày', '10+ ngày'].map(duration => (
                      <label key={duration} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-orange-500" />
                        <span className="text-gray-700">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mức độ khó */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Mountain size={18} />
                    Mức độ khó
                  </h3>
                  <div className="space-y-2">
                    {['Dễ', 'Trung bình', 'Thử thách', 'Chuyên nghiệp'].map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-orange-500" />
                        <span className="text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Đánh giá */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star size={18} />
                    Đánh giá tối thiểu
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2].map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rating" className="accent-orange-500" />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} size={16} className="fill-orange-500 text-orange-500" />
                          ))}
                          <span className="text-gray-700 ml-1">& trở lên</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quy mô nhóm */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} />
                    Quy mô nhóm
                  </h3>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Tất cả</option>
                    <option>Nhỏ (1-8)</option>
                    <option>Trung bình (9-15)</option>
                    <option>Lớn (16+)</option>
                  </select>
                </div>
              </div>

              {/* Ưu đãi mùa hè */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={24} />
                  <h3 className="text-xl font-bold">Ưu đãi mùa hè!</h3>
                </div>
                <p className="mb-4">Đặt ngay để tiết kiệm đến 30% cho các tour chọn lọc</p>
                <button className="w-full bg-white text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                  Xem ưu đãi
                </button>
              </div>

              {/* Điểm đến phổ biến */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin size={18} />
                  Điểm đến phổ biến
                </h3>
                <div className="space-y-3">
                  {['Thụy Sĩ', 'Pháp', 'Ý', 'Áo'].map(dest => (
                    <button 
                      key={dest}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Huy hiệu giải thưởng */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Award className="mx-auto text-orange-500 mb-3" size={48} />
                <h3 className="font-bold mb-2">Công ty tour tốt nhất 2024</h3>
                <p className="text-sm text-gray-600">Được bình chọn bởi Travel Excellence</p>
              </div>
            </div>
          </aside>

          {/* Nút bộ lọc di động */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-2xl z-40 hover:bg-orange-600 transition-colors"
          >
            <Filter size={24} />
          </button>

          {/* Danh sách tour */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">{allTours.length} tour hiện có</h2>
                <p className="text-gray-600">Hãy chọn hành trình phù hợp nhất với bạn</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Sắp xếp: Gợi ý</option>
                <option>Giá: Tăng dần</option>
                <option>Giá: Giảm dần</option>
                <option>Đánh giá: Cao nhất</option>
                <option>Thời lượng: Ngắn đến dài</option>
              </select>
            </div>

            {/* Lưới hiển thị tour */}
            <div className="grid md:grid-cols-2 gap-6">
              {allTours.map(tour => (
                <div 
                  key={tour.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                      ${tour.price}
                    </div>
                    {tour.featured && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
                        <TrendingUp size={14} />
                        Nổi bật
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < tour.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"} />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({tour.reviews} đánh giá)</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 hover:text-orange-500 cursor-pointer">
                      {tour.title}
                    </h3>

                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        tour.difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
                        tour.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tour.difficulty}
                      </span>
                    </div>
                    
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
                    
                    <button 
                      onClick={() => handleBookNow(tour)}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Đặt ngay
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Trước
              </button>
              {[1, 2, 3, 4, 5].map(page => (
                <button 
                  key={page}
                  className={`px-4 py-2 rounded-lg ${
                    page === 1 
                      ? 'bg-orange-500 text-white' 
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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
