import React, { useEffect, useMemo, useState } from 'react';
import {
  WalletCards,
  ShoppingBag,
  Users,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader
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
  Pending: { label: 'Chờ xử lý', classes: 'bg-amber-100 text-amber-700' },
  Confirmed: { label: 'Đã xác nhận', classes: 'bg-green-100 text-green-700' },
  Completed: { label: 'Đã hoàn thành', classes: 'bg-blue-100 text-blue-700' },
  Cancelled: { label: 'Đã hủy', classes: 'bg-red-100 text-red-700' },
  NoShow: { label: 'Không tham gia', classes: 'bg-gray-200 text-gray-700' }
};

const getStatusBadge = (status) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    activeTours: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setRefreshing(true);

      const [bookingsResponse, tourStatsResponse, customersResponse] = await Promise.all([
        bookingService.getAllBookings(1, 50),
        tourService.getStatistics().catch(() => null),
        userService.getAllUsers(1, 1).catch(() => null)
      ]);

      const bookingData = getArrayFromPayload(bookingsResponse);
      const normalizedBookings = bookingData
        .map((booking) => ({
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
          paymentStatus: booking.paymentStatus || booking.PaymentStatus || 'Pending'
        }))
        .sort((a, b) => {
          const dateA = new Date(a.bookingDate || a.tourDate || 0).getTime();
          const dateB = new Date(b.bookingDate || b.tourDate || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 6);

      const revenueFromApi =
        getNumberFromPayload(bookingsResponse, ['totalRevenue', 'TotalRevenue', 'revenue', 'Revenue']) ??
        getNumberFromPayload(bookingsResponse?.summary, ['totalRevenue', 'TotalRevenue']);

      const totalRevenue =
        revenueFromApi ??
        normalizedBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

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

      setRecentBookings(normalizedBookings);
      setStats({
        totalRevenue,
        totalBookings,
        totalCustomers,
        activeTours
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

  const statCards = useMemo(
    () => [
      {
        id: 'revenue',
        label: 'Tổng doanh thu',
        value: formatCurrency(stats.totalRevenue),
        iconBg: 'bg-orange-100 text-orange-500',
        icon: WalletCards
      },
      {
        id: 'bookings',
        label: 'Tổng lượt đặt tour',
        value: stats.totalBookings.toLocaleString('vi-VN'),
        iconBg: 'bg-blue-100 text-blue-500',
        icon: ShoppingBag
      },
      {
        id: 'customers',
        label: 'Khách hàng hoạt động',
        value: stats.totalCustomers.toLocaleString('vi-VN'),
        iconBg: 'bg-green-100 text-green-500',
        icon: Users
      },
      {
        id: 'tours',
        label: 'Tour đang hoạt động',
        value: stats.activeTours.toLocaleString('vi-VN'),
        iconBg: 'bg-purple-100 text-purple-500',
        icon: MapPin
      }
    ],
    [stats]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan bảng điều khiển</h1>
          <p className="text-gray-500 mt-1">
            {lastUpdated
              ? `Cập nhật lần cuối lúc ${new Date(lastUpdated).toLocaleTimeString('vi-VN')}`
              : 'Đang đồng bộ dữ liệu...'}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="inline-flex items-center justify-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-medium rounded-lg transition-colors"
        >
          <RefreshCw
            size={18}
            className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}
          />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold mb-1">Không thể tải dữ liệu</p>
            <p className="text-sm mb-2">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="text-sm font-medium text-red-700 underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{card.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-2">
                {lastUpdated ? 'Dữ liệu theo thời gian thực' : 'Đang xử lý...'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Đặt tour gần đây</h2>
            <p className="text-sm text-gray-500">Từ API đặt tour</p>
          </div>
          <span className="text-sm text-gray-500">
            {recentBookings.length > 0
              ? `${recentBookings.length} đơn mới nhất`
              : 'Chưa có dữ liệu'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 text-gray-600 text-sm font-semibold">Khách hàng</th>
                <th className="text-left py-3 px-6 text-gray-600 text-sm font-semibold">Tour</th>
                <th className="text-left py-3 px-6 text-gray-600 text-sm font-semibold">Ngày đặt</th>
                <th className="text-left py-3 px-6 text-gray-600 text-sm font-semibold">Số tiền</th>
                <th className="text-left py-3 px-6 text-gray-600 text-sm font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={20} />
                      Đang tải dữ liệu đặt tour...
                    </div>
                  </td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    Chưa có booking nào
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id || booking.bookingCode} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{booking.customerName}</p>
                      {booking.customerEmail && (
                        <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{booking.tourName}</p>
                      <p className="text-sm text-gray-500">
                        Khởi hành: {formatDate(booking.tourDate)}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{formatDate(booking.bookingDate)}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      {formatCurrency(booking.amount)}
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {booking.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(booking.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
