import React, { useEffect, useState } from 'react';
import {
  WalletCards,
  ShoppingBag,
  Users,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  ArrowRight,
  Trophy 
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { tourService } from '../../services/tourService';
import { userService } from '../../services/userService';

const pickNumber = (source, keys = []) => {
  if (!source) return null;
  for (const key of keys) {
    if (source[key] === undefined || source[key] === null) continue;
    const value = source[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return null;
};

const getNumberFromPayload = (payload, keys, fallback = 0) => {
  const candidates = [
    pickNumber(payload, keys),
    pickNumber(payload?.data, keys),
    pickNumber(payload?.Data, keys),
    pickNumber(payload?.statistics, keys),
    pickNumber(payload?.Statistics, keys),
    pickNumber(payload?.summary, keys),
    pickNumber(payload?.Summary, keys),
  ].filter((value) => value !== null);

  if (candidates.length > 0) {
    return candidates[0];
  }

  return fallback;
};

const getArrayFromPayload = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.Data)) return payload.Data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.Items)) return payload.Items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.Data?.Items)) return payload.Data.Items;
  return [];
};

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const STATUS_CONFIG = {
  Pending: { label: 'Chờ xử lý', classes: 'bg-yellow-100 text-yellow-700', icon: Clock },
  Confirmed: { label: 'Đã xác nhận', classes: 'bg-green-100 text-green-700', icon: CheckCircle },
  Completed: { label: 'Đã hoàn thành', classes: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  Cancelled: { label: 'Đã hủy', classes: 'bg-red-100 text-red-700', icon: XCircle },
  NoShow: { label: 'Không tham gia', classes: 'bg-gray-200 text-gray-700', icon: XCircle }
};

const getStatusBadge = (status) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    activeTours: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topTours, setTopTours] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setRefreshing(true);

      const [bookingsResponse, tourStatsResponse, customersResponse] = await Promise.all([
        bookingService.getAllBookings(1, 100),
        tourService.getStatistics().catch(() => null),
        userService.getAllUsers(1, 1).catch(() => null)
      ]);

      const bookingData = getArrayFromPayload(bookingsResponse);
      const normalizedBookings = bookingData.map((booking) => ({
        id: booking.id || booking.Id,
        bookingCode: booking.bookingCode || booking.BookingCode,
        customerName:
          booking.customerName ||
          booking.CustomerName ||
          booking.fullName ||
          booking.FullName ||
          'Khách hàng',
        customerEmail: booking.customerEmail || booking.CustomerEmail || booking.email || booking.Email,
        tourName: booking.tourName || booking.TourName || booking.tour?.name || 'Tour',
        tourDate: booking.tourDate || booking.TourDate || booking.startDate || booking.StartDate,
        bookingDate:
          booking.bookingDate || booking.BookingDate || booking.createdAt || booking.CreatedAt,
        amount:
          booking.totalAmount ||
          booking.TotalAmount ||
          booking.amount ||
          booking.Amount ||
          booking.price ||
          booking.Price ||
          0,
        status: booking.status || booking.Status || 'Pending',
        paymentStatus: booking.paymentStatus || booking.PaymentStatus || 'Pending',
        numberOfGuests: booking.numberOfGuests || booking.NumberOfGuests || 0
      }));

      const totalRevenue = normalizedBookings
        .filter(booking => booking.paymentStatus === 'Paid')
        .reduce((sum, booking) => sum + (booking.amount || 0), 0);

      const tourRevenueMap = {};
      normalizedBookings
        .filter(b => b.paymentStatus === 'Paid')
        .forEach(b => {
          const tour = b.tourName || 'Tour không tên';
          tourRevenueMap[tour] = (tourRevenueMap[tour] || 0) + (b.amount || 0);
        });

      const topToursList = Object.entries(tourRevenueMap)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

      setTopTours(topToursList);

      // Các thống kê khác
      const confirmedBookings = normalizedBookings.filter(b => b.status === 'Confirmed').length;
      const pendingBookings = normalizedBookings.filter(b => b.status === 'Pending').length;
      const cancelledBookings = normalizedBookings.filter(b => b.status === 'Cancelled').length;

      const totalBookings =
        getNumberFromPayload(bookingsResponse, [
          'totalBookings',
          'TotalBookings',
          'totalCount',
          'TotalCount',
          'count',
          'Count'
        ]) || bookingData.length;

      const customersData = getArrayFromPayload(customersResponse);
      const totalCustomers =
        getNumberFromPayload(customersResponse, [
          'totalCustomers',
          'TotalCustomers',
          'totalCount',
          'TotalCount'
        ]) || customersData.length;

      const activeTours =
        getNumberFromPayload(tourStatsResponse, [
          'activeTours',
          'ActiveTours',
          'totalActiveTours',
          'TotalActiveTours',
          'totalTours',
          'TotalTours'
        ]) || 0;

      const sortedBookings = normalizedBookings
        .sort((a, b) => {
          const dateA = new Date(a.bookingDate || a.tourDate || 0).getTime();
          const dateB = new Date(b.bookingDate || b.tourDate || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 8);

      setRecentBookings(sortedBookings);
      setStats({
        totalRevenue,
        totalBookings,
        totalCustomers,
        activeTours,
        confirmedBookings,
        pendingBookings,
        cancelledBookings
      });
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-cyan-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Tổng Quan</h1>
            <p className="text-gray-600 mt-1">
              {lastUpdated
                ? `Cập nhật lúc ${new Date(lastUpdated).toLocaleTimeString('vi-VN')}`
                : 'Đang tải...'}
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
          >
            <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="flex-shrink-0 text-red-500 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-red-700 mb-1">Không thể tải dữ liệu</p>
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="text-sm font-medium text-red-700 underline hover:text-red-800"
              >
                Thử lại ngay
              </button>
            </div>
          </div>
        )}

        {/* Main Stats - 4 Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <WalletCards size={28} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp size={14} />
                +12%
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Tổng Doanh Thu</h3>
            <p className="text-3xl font-bold mb-2">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-white/70 text-xs">Từ booking đã thanh toán</p>
          </div>

          {/* Các card khác giữ nguyên */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp size={14} />
                +8%
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Tổng Booking</h3>
            <p className="text-3xl font-bold mb-2">{stats.totalBookings.toLocaleString('vi-VN')}</p>
            <p className="text-white/70 text-xs">Tất cả đặt tour</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Users size={28} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp size={14} />
                +15%
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Khách Hàng</h3>
            <p className="text-3xl font-bold mb-2">{stats.totalCustomers.toLocaleString('vi-VN')}</p>
            <p className="text-white/70 text-xs">Người dùng đăng ký</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <MapPin size={28} />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp size={14} />
                +5%
              </div>
            </div>
            <h3 className=" hinter-white/80 text-sm font-medium mb-1">Tour Hoạt Động</h3>
            <p className="text-3xl font-bold mb-2">{stats.activeTours.toLocaleString('vi-VN')}</p>
            <p className="text-white/70 text-xs">Tour đang mở</p>
          </div>
        </div>

        {/* Booking Status Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* ... giữ nguyên 3 card Confirmed / Pending / Cancelled ... */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã Xác Nhận</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <TrendingUp size={12} />
              Tăng 12% so với tháng trước
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-500 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
              <Clock size={12} />
              Cần xử lý sớm
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã Hủy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <TrendingDown size={12} />
              Giảm 5% so với tháng trước
            </div>
          </div>
        </div>

        {/* NEW: Top 3 Tours by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="text-amber-600" size={28} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top 3 Tour Doanh Thu Cao Nhất</h2>
                <p className="text-sm text-gray-600">Dựa trên booking đã thanh toán</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {topTours.length === 0 ? (
              <div className="text-center py-12">
                <Trophy size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có dữ liệu doanh thu tour</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topTours.map((tour, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tour.name}</p>
                        <p className="text-sm text-gray-500">Doanh thu từ booking đã thanh toán</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(tour.revenue)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* ... phần Recent Bookings giữ nguyên ... */}
          <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={24} className="text-cyan-500" />
                Booking Gần Đây
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {recentBookings.length} đơn đặt tour mới nhất
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm">
              Xem tất cả
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Mã Booking</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Khách Hàng</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Tour</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Ngày Đặt</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Số Tiền</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <AlertCircle size={48} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Chưa có booking nào</p>
                      <p className="text-gray-400 text-sm mt-1">Booking mới sẽ hiển thị ở đây</p>
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr 
                      key={booking.id || booking.bookingCode} 
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-bold text-cyan-600">
                          {booking.bookingCode || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customerName}</p>
                          {booking.customerEmail && (
                            <p className="text-xs text-gray-500 mt-0.5">{booking.customerEmail}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{booking.tourName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Khởi hành: {formatDate(booking.tourDate)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(booking.bookingDate)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-900">{formatCurrency(booking.amount)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {booking.paymentStatus === 'Paid' ? '✓ Đã thanh toán' : '○ Chưa thanh toán'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(booking.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* ... giữ nguyên 3 quick action buttons ... */}
          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left group">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
              <ShoppingBag size={24} className="text-cyan-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quản Lý Booking</h3>
            <p className="text-sm text-gray-600 mb-4">Xem và quản lý tất cả đặt tour</p>
            <div className="flex items-center gap-2 text-cyan-600 font-medium text-sm">
              Đi tới
              <ArrowRight size={16} />
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <MapPin size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quản Lý Tour</h3>
            <p className="text-sm text-gray-600 mb-4">Thêm, sửa và xóa tour du lịch</p>
            <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
              Đi tới
              <ArrowRight size={16} />
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-left group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Users size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quản Lý Khách Hàng</h3>
            <p className="text-sm text-gray-600 mb-4">Xem danh sách và lịch sử khách</p>
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              Đi tới
              <ArrowRight size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;