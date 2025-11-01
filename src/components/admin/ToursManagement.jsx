import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Eye,
  MoreVertical,
  X,
  Image as ImageIcon,
  Calendar,
  Mountain,
  Award,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const ToursManagement = () => {
  const [tours, setTours] = useState([
    { 
      id: 1, 
      name: 'Hành Trình Dưới Chân Matterhorn', 
      location: 'Zermatt, Thụy Sĩ',
      country: 'Thụy Sĩ',
      price: 299, 
      duration: '5 ngày 4 đêm', 
      status: 'Active', 
      bookings: 45,
      rating: 4.9,
      reviews: 128,
      maxGuests: 12,
      difficulty: 'Trung bình',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      description: 'Khám phá vẻ đẹp hùng vĩ của đỉnh Matterhorn',
      featured: true
    },
    { 
      id: 2, 
      name: 'Vòng Quanh Núi Mont Blanc', 
      location: 'Chamonix, Pháp',
      country: 'Pháp',
      price: 499, 
      duration: '7 ngày 6 đêm', 
      status: 'Active', 
      bookings: 32,
      rating: 4.8,
      reviews: 94,
      maxGuests: 10,
      difficulty: 'Thử thách',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
      description: 'Hành trình vòng quanh ngọn núi cao nhất châu Âu',
      featured: true
    },
    { 
      id: 3, 
      name: 'Phiêu Lưu Dolomites', 
      location: 'Dolomites, Ý',
      country: 'Ý',
      price: 399, 
      duration: '6 ngày 5 đêm', 
      status: 'Inactive', 
      bookings: 18,
      rating: 4.7,
      reviews: 76,
      maxGuests: 14,
      difficulty: 'Trung bình',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
      description: 'Khám phá dãy núi đá vôi tuyệt đẹp của Ý',
      featured: false
    },
    { 
      id: 4, 
      name: 'Khám Phá Dãy Alps Thụy Sĩ', 
      location: 'Interlaken, Thụy Sĩ',
      country: 'Thụy Sĩ',
      price: 599, 
      duration: '8 ngày 7 đêm', 
      status: 'Active', 
      bookings: 28,
      rating: 4.9,
      reviews: 112,
      maxGuests: 8,
      difficulty: 'Thử thách',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      description: 'Trải nghiệm hoàn chỉnh vùng Alps Thụy Sĩ',
      featured: false
    },
    { 
      id: 5, 
      name: 'Đường Mòn Núi Austria', 
      location: 'Innsbruck, Áo',
      country: 'Áo',
      price: 349, 
      duration: '5 ngày 4 đêm', 
      status: 'Active', 
      bookings: 41,
      rating: 4.6,
      reviews: 89,
      maxGuests: 15,
      difficulty: 'Dễ',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
      description: 'Khám phá vùng núi xinh đẹp của Áo',
      featured: false
    },
    { 
      id: 6, 
      name: 'Hành Trình Khu Vực Jungfrau', 
      location: 'Grindelwald, Thụy Sĩ',
      country: 'Thụy Sĩ',
      price: 449, 
      duration: '6 ngày 5 đêm', 
      status: 'Active', 
      bookings: 52,
      rating: 5.0,
      reviews: 156,
      maxGuests: 12,
      difficulty: 'Trung bình',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      description: 'Tour đỉnh cao qua khu vực Jungfrau',
      featured: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Statistics
  const stats = {
    total: tours.length,
    active: tours.filter(t => t.status === 'Active').length,
    inactive: tours.filter(t => t.status === 'Inactive').length,
    totalBookings: tours.reduce((sum, t) => sum + t.bookings, 0),
    avgRating: (tours.reduce((sum, t) => sum + t.rating, 0) / tours.length).toFixed(1)
  };

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = 
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || tour.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getDifficultyBadge = (difficulty) => {
    const difficultyConfig = {
      'Dễ': { bg: 'bg-green-100', text: 'text-green-700' },
      'Trung bình': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'Thử thách': { bg: 'bg-red-100', text: 'text-red-700' },
      'Chuyên nghiệp': { bg: 'bg-purple-100', text: 'text-purple-700' }
    };
    
    const config = difficultyConfig[difficulty];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Mountain size={12} />
        {difficulty}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        status === 'Active' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-gray-100 text-gray-700'
      }`}>
        {status === 'Active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
        {status === 'Active' ? 'Hoạt động' : 'Tạm dừng'}
      </span>
    );
  };

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    setShowDetailModal(true);
    setShowActionMenu(null);
  };

  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  const handleDeleteTour = (tourId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      setTours(tours.filter(t => t.id !== tourId));
      setShowActionMenu(null);
    }
  };

  const handleToggleStatus = (tourId) => {
    setTours(tours.map(t => 
      t.id === tourId 
        ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } 
        : t
    ));
    setShowActionMenu(null);
  };

  const handleToggleFeatured = (tourId) => {
    setTours(tours.map(t => 
      t.id === tourId 
        ? { ...t, featured: !t.featured } 
        : t
    ));
    setShowActionMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Tours</h1>
            <p className="text-gray-600 mt-1">Quản lý và cập nhật tất cả các tour du lịch</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold">
              <Download size={18} />
              Export
            </button>
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold">
              <RefreshCw size={18} />
              Làm mới
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm Tour Mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-600">
                <MapPin size={24} />
                <span className="font-semibold">Tổng tours</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">Tours hiện có</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={24} />
                <span className="font-semibold">Hoạt động</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            <p className="text-sm text-gray-500 mt-1">Tours đang bán</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-gray-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-600">
                <AlertCircle size={24} />
                <span className="font-semibold">Tạm dừng</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
            <p className="text-sm text-gray-500 mt-1">Tours dừng bán</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-yellow-600">
                <Users size={24} />
                <span className="font-semibold">Tổng booking</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            <p className="text-sm text-gray-500 mt-1">Lượt đặt tour</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-purple-600">
                <Star size={24} />
                <span className="font-semibold">Đánh giá TB</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
            <p className="text-sm text-gray-500 mt-1">Trên 5 sao</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên tour, địa điểm..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Tạm dừng</option>
            </select>
            
            <select 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-medium"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">Tất cả độ khó</option>
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thử thách">Thử thách</option>
              <option value="Chuyên nghiệp">Chuyên nghiệp</option>
            </select>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy tour nào</h3>
              <p className="text-gray-500 mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm của bạn</p>
              <button 
                onClick={() => {
                  setStatusFilter('all');
                  setDifficultyFilter('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredTours.map(tour => (
              <div key={tour.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Featured Badge */}
                  {tour.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <TrendingUp size={12} />
                      NỔI BẬT
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(tour.status)}
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    ${tour.price}
                  </div>

                  {/* Difficulty */}
                  <div className="absolute bottom-3 right-3">
                    {getDifficultyBadge(tour.difficulty)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <MapPin size={14} className="text-orange-500" />
                    <span className="font-medium">{tour.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {tour.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <Star size={14} className="fill-current" />
                        <span className="font-bold text-sm text-gray-900">{tour.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{tour.reviews} reviews</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                        <Users size={14} />
                        <span className="font-bold text-sm text-gray-900">{tour.bookings}</span>
                      </div>
                      <p className="text-xs text-gray-500">Đã đặt</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                        <Clock size={14} />
                        <span className="font-bold text-sm text-gray-900">{tour.duration.split(' ')[0]}</span>
                      </div>
                      <p className="text-xs text-gray-500">Ngày</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(tour)}
                      className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleEditTour(tour)}
                      className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Sửa
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === tour.id ? null : tour.id)}
                        className="p-2.5 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {showActionMenu === tour.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                          <button
                            onClick={() => handleToggleStatus(tour.id)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 border-b border-gray-100"
                          >
                            {tour.status === 'Active' ? (
                              <>
                                <AlertCircle size={16} className="text-gray-500" />
                                Tạm dừng tour
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="text-green-500" />
                                Kích hoạt tour
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleToggleFeatured(tour.id)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 border-b border-gray-100"
                          >
                            <Award size={16} className="text-purple-500" />
                            {tour.featured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600"
                          >
                            <Trash2 size={16} />
                            Xóa tour
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-5 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium">
            Trước
          </button>
          {[1, 2, 3].map(page => (
            <button
              key={page}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                page === 1
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-5 py-2 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium">
            Sau
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTour && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chi Tiết Tour</h2>
                  <p className="text-orange-100">ID: {selectedTour.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="relative h-80 rounded-xl overflow-hidden">
                <img 
                  src={selectedTour.image} 
                  alt={selectedTour.name}
                  className="w-full h-full object-cover"
                />
                {selectedTour.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <TrendingUp size={16} />
                    TOUR NỔI BẬT
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="bg-orange-50 rounded-xl p-5">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedTour.name}</h3>
                <p className="text-gray-700 mb-4">{selectedTour.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-lg">
                      <MapPin size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Địa điểm</p>
                      <p className="font-semibold text-gray-900">{selectedTour.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-lg">
                      <DollarSign size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giá tour</p>
                      <p className="font-bold text-2xl text-green-600">${selectedTour.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-lg">
                      <Clock size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thời lượng</p>
                      <p className="font-semibold text-gray-900">{selectedTour.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-lg">
                      <Users size={20} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số khách tối đa</p>
                      <p className="font-semibold text-gray-900">{selectedTour.maxGuests} người</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Star size={24} className="text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-700">Đánh giá</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{selectedTour.rating}</p>
                  <p className="text-sm text-gray-500">{selectedTour.reviews} đánh giá</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={24} className="text-blue-500" />
                    <span className="font-semibold text-gray-700">Booking</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{selectedTour.bookings}</p>
                  <p className="text-sm text-gray-500">Lượt đặt tour</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign size={24} className="text-green-500" />
                    <span className="font-semibold text-gray-700">Doanh thu</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">${selectedTour.price * selectedTour.bookings}</p>
                  <p className="text-sm text-gray-500">Tổng thu nhập</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Mountain size={18} className="text-gray-600" />
                    Độ khó
                  </h4>
                  {getDifficultyBadge(selectedTour.difficulty)}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-gray-600" />
                    Trạng thái
                  </h4>
                  {getStatusBadge(selectedTour.status)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditTour(selectedTour);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Chỉnh sửa tour
                </button>
                <button 
                  onClick={() => handleToggleStatus(selectedTour.id)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  {selectedTour.status === 'Active' ? (
                    <>
                      <AlertCircle size={18} />
                      Tạm dừng
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Kích hoạt
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    handleDeleteTour(selectedTour.id);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Xóa tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {showAddModal ? 'Thêm Tour Mới' : 'Chỉnh Sửa Tour'}
                  </h2>
                  <p className="text-orange-100">
                    {showAddModal ? 'Điền thông tin tour mới' : `ID: ${selectedTour?.id}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedTour(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Tour Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên tour *
                </label>
                <input
                  type="text"
                  placeholder="VD: Hành Trình Dưới Chân Matterhorn"
                  defaultValue={showEditModal ? selectedTour?.name : ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Location & Country */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Zermatt"
                    defaultValue={showEditModal ? selectedTour?.location : ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quốc gia *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Thụy Sĩ"
                    defaultValue={showEditModal ? selectedTour?.country : ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  placeholder="Mô tả chi tiết về tour..."
                  defaultValue={showEditModal ? selectedTour?.description : ''}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Price & Duration */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá (USD) *
                  </label>
                  <input
                    type="number"
                    placeholder="299"
                    defaultValue={showEditModal ? selectedTour?.price : ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thời lượng *
                  </label>
                  <input
                    type="text"
                    placeholder="5 ngày 4 đêm"
                    defaultValue={showEditModal ? selectedTour?.duration : ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Max Guests & Difficulty */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số khách tối đa *
                  </label>
                  <input
                    type="number"
                    placeholder="12"
                    defaultValue={showEditModal ? selectedTour?.maxGuests : ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Độ khó *
                  </label>
                  <select 
                    defaultValue={showEditModal ? selectedTour?.difficulty : ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Chọn độ khó</option>
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thử thách">Thử thách</option>
                    <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL hình ảnh *
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  defaultValue={showEditModal ? selectedTour?.image : ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Status & Featured */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select 
                    defaultValue={showEditModal ? selectedTour?.status : 'Active'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Tạm dừng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tour nổi bật
                  </label>
                  <div className="flex items-center gap-3 h-12">
                    <input
                      type="checkbox"
                      defaultChecked={showEditModal ? selectedTour?.featured : false}
                      className="w-5 h-5 accent-orange-500 rounded"
                    />
                    <span className="text-gray-700">Đặt làm tour nổi bật</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedTour(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert(showAddModal ? 'Tour đã được thêm!' : 'Tour đã được cập nhật!');
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedTour(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {showAddModal ? 'Thêm tour' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursManagement;