import React, { useState } from 'react';
import { 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  DollarSign,
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([
    { 
      id: 'BK001', 
      customer: 'Nguyễn Văn An', 
      email: 'nguyenvanan@email.com',
      phone: '+84 912 345 678',
      tour: 'Hành Trình Dưới Chân Matterhorn', 
      location: 'Zermatt, Thụy Sĩ',
      date: '2024-12-20', 
      bookingDate: '2024-10-15',
      guests: 2, 
      amount: 642, 
      status: 'Confirmed', 
      payment: 'Paid',
      paymentMethod: 'VNPay',
      guide: 'Hans Mueller',
      duration: '5 ngày'
    },
    { 
      id: 'BK002', 
      customer: 'Trần Thị Bình', 
      email: 'tranthibinh@email.com',
      phone: '+84 923 456 789',
      tour: 'Vòng Quanh Núi Mont Blanc', 
      location: 'Pháp',
      date: '2024-11-10', 
      bookingDate: '2024-09-20',
      guests: 4, 
      amount: 1996, 
      status: 'Pending', 
      payment: 'Pending',
      paymentMethod: 'PayPal',
      guide: 'Sophie Martin',
      duration: '7 ngày'
    },
    { 
      id: 'BK003', 
      customer: 'Lê Hoàng Minh', 
      email: 'lehoangminh@email.com',
      phone: '+84 934 567 890',
      tour: 'Phiêu Lưu Dolomites', 
      location: 'Ý',
      date: '2024-11-25', 
      bookingDate: '2024-10-01',
      guests: 3, 
      amount: 1197, 
      status: 'Confirmed', 
      payment: 'Paid',
      paymentMethod: 'Credit Card',
      guide: 'Marco Rossi',
      duration: '6 ngày'
    },
    { 
      id: 'BK004', 
      customer: 'Phạm Thu Hương', 
      email: 'phamthuhuong@email.com',
      phone: '+84 945 678 901',
      tour: 'Khám Phá Dãy Alps Thụy Sĩ', 
      location: 'Thụy Sĩ',
      date: '2024-12-01', 
      bookingDate: '2024-10-10',
      guests: 2, 
      amount: 1198, 
      status: 'Cancelled', 
      payment: 'Refunded',
      paymentMethod: 'VNPay',
      guide: 'Hans Mueller',
      duration: '8 ngày',
      cancelReason: 'Lý do cá nhân'
    },
    { 
      id: 'BK005', 
      customer: 'Hoàng Văn Đức', 
      email: 'hoangvanduc@email.com',
      phone: '+84 956 789 012',
      tour: 'Đường Mòn Núi Austria', 
      location: 'Áo',
      date: '2024-11-15', 
      bookingDate: '2024-09-25',
      guests: 5, 
      amount: 1745, 
      status: 'Confirmed', 
      payment: 'Paid',
      paymentMethod: 'PayPal',
      guide: 'Franz Schmidt',
      duration: '5 ngày'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Statistics
  const stats = {
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    revenue: bookings.filter(b => b.payment === 'Paid').reduce((sum, b) => sum + b.amount, 0)
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.payment === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Confirmed': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    const paymentConfig = {
      'Paid': { bg: 'bg-green-100', text: 'text-green-700' },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'Refunded': { bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    
    const config = paymentConfig[payment];
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {payment}
      </span>
    );
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
    setShowActionMenu(null);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
    setShowActionMenu(null);
  };

  const handleUpdatePayment = (bookingId, newPayment) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, payment: newPayment } : b
    ));
    setShowActionMenu(null);
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa booking này?')) {
      setBookings(bookings.filter(b => b.id !== bookingId));
      setShowActionMenu(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Booking</h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả đặt tour</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold">
              <Download size={18} />
              Export
            </button>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 flex items-center gap-2 font-semibold">
              <RefreshCw size={18} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={24} />
                <span className="font-semibold">Đã xác nhận</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
            <p className="text-sm text-gray-500 mt-1">Booking đã xác nhận</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock size={24} />
                <span className="font-semibold">Chờ xác nhận</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Cần xử lý</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle size={24} />
                <span className="font-semibold">Đã hủy</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.cancelled}</p>
            <p className="text-sm text-gray-500 mt-1">Booking bị hủy</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-600">
                <DollarSign size={24} />
                <span className="font-semibold">Doanh thu</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Tổng thu nhập</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã booking, khách hàng, tour..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="Pending">Chờ xác nhận</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
            
            <select 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none font-medium"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Pending">Chờ thanh toán</option>
              <option value="Refunded">Đã hoàn tiền</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Mã Booking</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Khách hàng</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Tour</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Ngày khởi hành</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Số khách</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Tổng tiền</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Thanh toán</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <AlertCircle size={48} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Không tìm thấy booking nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-cyan-600">{booking.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customer}</p>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{booking.tour}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin size={12} />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-gray-900 font-medium">
                            {new Date(booking.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="font-semibold text-gray-900">{booking.guests}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-lg text-gray-900">${booking.amount}</span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-4 px-6">
                        {getPaymentBadge(booking.payment)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-600" />
                          </button>
                          
                          {showActionMenu === booking.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 border-b border-gray-100"
                              >
                                <Eye size={16} className="text-cyan-500" />
                                Xem chi tiết
                              </button>
                              
                              {booking.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 border-b border-gray-100"
                                >
                                  <CheckCircle size={16} className="text-green-500" />
                                  Xác nhận booking
                                </button>
                              )}
                              
                              {booking.payment === 'Pending' && (
                                <button
                                  onClick={() => handleUpdatePayment(booking.id, 'Paid')}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 border-b border-gray-100"
                                >
                                  <DollarSign size={16} className="text-blue-500" />
                                  Xác nhận thanh toán
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600"
                              >
                                <Trash2 size={16} />
                                Xóa booking
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button className="px-5 py-2 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium">
            Trước
          </button>
          {[1, 2, 3].map(page => (
            <button
              key={page}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                page === 1
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-5 py-2 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:text-cyan-600 transition-colors font-medium">
            Sau
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chi Tiết Booking</h2>
                  <p className="text-cyan-100">Mã: {selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users size={20} className="text-cyan-500" />
                  Thông tin khách hàng
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {selectedBooking.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số khách</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.guests} người</p>
                  </div>
                </div>
              </div>

              {/* Tour Info */}
              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" />
                  Thông tin tour
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tên tour</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.tour}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                      <p className="font-semibold text-gray-900">{selectedBooking.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Thời lượng</p>
                      <p className="font-semibold text-gray-900">{selectedBooking.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Hướng dẫn viên</p>
                      <p className="font-semibold text-gray-900">{selectedBooking.guide}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-green-50 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-green-500" />
                  Chi tiết đặt tour
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày khởi hành</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedBooking.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Thanh toán</p>
                    <div className="mt-1">{getPaymentBadge(selectedBooking.payment)}</div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-purple-50 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-purple-500" />
                  Thông tin thanh toán
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phương thức</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                    <p className="font-bold text-2xl text-purple-600">${selectedBooking.amount}</p>
                  </div>
                </div>
              </div>

              {/* Cancel Reason */}
              {selectedBooking.status === 'Cancelled' && selectedBooking.cancelReason && (
                <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
                  <h3 className="font-bold text-lg mb-2 text-red-700">Lý do hủy</h3>
                  <p className="text-gray-700">{selectedBooking.cancelReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Mail size={18} />
                  Gửi email
                </button>
                <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                  <Phone size={18} />
                  Gọi điện
                </button>
                <button className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center justify-center gap-2">
                  <Download size={18} />
                  Tải PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;