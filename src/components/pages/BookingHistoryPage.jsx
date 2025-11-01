import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Star,
  Filter,
  Search,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data
  const user = {
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "+84 912 345 678",
    avatar: "https://i.pravatar.cc/200?img=8",
    memberSince: "2023",
    totalBookings: 12,
    totalSpent: 8500
  };

  // Mock booking history data
  const bookings = [
    {
      id: "BK001",
      tourId: 1,
      tourName: "Hành Trình Dưới Chân Matterhorn",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      location: "Zermatt, Thụy Sĩ",
      bookingDate: "2024-10-15",
      tourDate: "2024-12-20",
      guests: 2,
      duration: "5 ngày 4 đêm",
      totalPrice: 642,
      status: "confirmed",
      paymentMethod: "VNPay",
      guide: "Hans Mueller"
    },
    {
      id: "BK002",
      tourId: 2,
      tourName: "Vòng Quanh Núi Mont Blanc",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
      location: "Pháp",
      bookingDate: "2024-09-20",
      tourDate: "2024-11-10",
      guests: 3,
      duration: "7 ngày 6 đêm",
      totalPrice: 1497,
      status: "pending",
      paymentMethod: "PayPal",
      guide: "Sophie Martin"
    },
    {
      id: "BK003",
      tourId: 3,
      tourName: "Phiêu Lưu Dolomites",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80",
      location: "Ý",
      bookingDate: "2024-08-05",
      tourDate: "2024-09-15",
      guests: 2,
      duration: "6 ngày 5 đêm",
      totalPrice: 878,
      status: "completed",
      paymentMethod: "Credit Card",
      guide: "Marco Rossi",
      rating: 5,
      review: "Trải nghiệm tuyệt vời! Hướng dẫn viên rất chuyên nghiệp."
    },
    {
      id: "BK004",
      tourId: 4,
      tourName: "Khám Phá Dãy Alps Thụy Sĩ",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      location: "Thụy Sĩ",
      bookingDate: "2024-07-10",
      tourDate: "2024-08-25",
      guests: 4,
      duration: "8 ngày 7 đêm",
      totalPrice: 2636,
      status: "completed",
      paymentMethod: "VNPay",
      guide: "Hans Mueller",
      rating: 5,
      review: "Tour tuyệt vời, cảnh đẹp không thể tả!"
    },
    {
      id: "BK005",
      tourId: 5,
      tourName: "Đường Mòn Núi Austria",
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80",
      location: "Áo",
      bookingDate: "2024-06-20",
      tourDate: "2024-07-05",
      guests: 2,
      duration: "5 ngày 4 đêm",
      totalPrice: 767,
      status: "cancelled",
      paymentMethod: "PayPal",
      guide: "Franz Schmidt",
      cancelReason: "Lý do cá nhân"
    },
    {
      id: "BK006",
      tourId: 6,
      tourName: "Hành Trình Khu Vực Jungfrau",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      location: "Thụy Sĩ",
      bookingDate: "2024-05-15",
      tourDate: "2024-06-20",
      guests: 3,
      duration: "6 ngày 5 đêm",
      totalPrice: 1482,
      status: "completed",
      paymentMethod: "Credit Card",
      guide: "Hans Mueller",
      rating: 4,
      review: "Tour tốt nhưng thời tiết không thuận lợi."
    }
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả', count: bookings.length },
    { id: 'confirmed', label: 'Đã xác nhận', count: bookings.filter(b => b.status === 'confirmed').length },
    { id: 'pending', label: 'Chờ xác nhận', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'completed', label: 'Đã hoàn thành', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Đã hủy', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        icon: CheckCircle,
        label: 'Đã xác nhận'
      },
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        icon: AlertCircle,
        label: 'Chờ xác nhận'
      },
      completed: { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        icon: CheckCircle,
        label: 'Đã hoàn thành'
      },
      cancelled: { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        icon: XCircle,
        label: 'Đã hủy'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lịch Sử Đặt Tour</h1>
              <p className="text-cyan-100">Quản lý và theo dõi các chuyến đi của bạn</p>
            </div>
            <button 
              onClick={() => navigate('/tours')}
              className="bg-white text-cyan-600 px-6 py-3 rounded-xl font-semibold hover:bg-cyan-50 transition-all flex items-center gap-2"
            >
              <span>Đặt tour mới</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-cyan-100">Thành viên từ {user.memberSince}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-cyan-100 text-sm mb-1">Tổng đặt tour</p>
              <p className="text-2xl font-bold">{user.totalBookings}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-cyan-100 text-sm mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-bold">${user.totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-cyan-100 text-sm mb-1">Liên hệ</p>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên tour hoặc địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-colors">
              <Filter size={20} />
              <span className="font-semibold">Lọc</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm của bạn</p>
              <button 
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="lg:w-64 flex-shrink-0">
                      <img 
                        src={booking.image} 
                        alt={booking.tourName}
                        className="w-full h-48 lg:h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{booking.tourName}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} className="text-cyan-500" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Mã đặt tour</p>
                          <p className="font-bold text-cyan-600">{booking.id}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Calendar size={16} className="text-cyan-500" />
                            <span>Ngày đặt</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Calendar size={16} className="text-cyan-500" />
                            <span>Ngày khởi hành</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.tourDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Users size={16} className="text-cyan-500" />
                            <span>Số khách</span>
                          </div>
                          <p className="font-semibold text-gray-900">{booking.guests} người</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Clock size={16} className="text-cyan-500" />
                            <span>Thời gian</span>
                          </div>
                          <p className="font-semibold text-gray-900">{booking.duration}</p>
                        </div>
                      </div>

                      {/* Guide & Payment */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Hướng dẫn viên</p>
                            <p className="font-semibold text-gray-900">{booking.guide}</p>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div>
                            <p className="text-sm text-gray-500">Thanh toán qua</p>
                            <p className="font-semibold text-gray-900">{booking.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Tổng giá</p>
                          <p className="text-2xl font-bold text-cyan-600">${booking.totalPrice}</p>
                        </div>
                      </div>

                      {/* Rating & Review (if completed) */}
                      {booking.status === 'completed' && booking.rating && (
                        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < booking.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Đánh giá của bạn</span>
                          </div>
                          <p className="text-sm text-gray-700">{booking.review}</p>
                        </div>
                      )}

                      {/* Cancel Reason */}
                      {booking.status === 'cancelled' && booking.cancelReason && (
                        <div className="bg-red-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-red-700 mb-1">Lý do hủy</p>
                          <p className="text-sm text-gray-700">{booking.cancelReason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => navigate(`/tour/${booking.tourId}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-all"
                        >
                          <Eye size={18} />
                          <span>Xem chi tiết</span>
                        </button>
                        
                        {booking.status === 'confirmed' && (
                          <>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all">
                              <Download size={18} />
                              <span>Tải vé</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all">
                              <MessageSquare size={18} />
                              <span>Liên hệ</span>
                            </button>
                          </>
                        )}

                        {booking.status === 'completed' && !booking.rating && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all">
                            <Star size={18} />
                            <span>Đánh giá</span>
                          </button>
                        )}

                        {booking.status === 'completed' && (
                          <button 
                            onClick={() => navigate('/tours')}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-cyan-500 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-all"
                          >
                            <ChevronRight size={18} />
                            <span>Đặt lại</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryPage;