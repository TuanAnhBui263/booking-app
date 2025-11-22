import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, Users, MapPin, Lock } from 'lucide-react';

const OrderSummary = ({ tourData }) => {
  // --- Helper ---
  const getTourImage = (tour) =>
    tour.image || tour.primaryImageUrl || tour.PrimaryImageUrl || tour.imageUrl ||
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

  const getTourTitle = (tour) => tour.title || tour.name || tour.Name || 'Tour';

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

  // --- Lấy dữ liệu từng khoản ---
  const price = tourData.price || 0;
  const guests = tourData.guests || 1;
  const serviceFee = tourData.serviceFee || 0;
  const insurance = tourData.insurance || 0;

  // --- Tính tổng ---
  const totalAmount = price * guests + serviceFee + insurance;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn đặt tour</h2>

      {/* Hình ảnh tour */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={getTourImage(tourData)}
          alt={getTourTitle(tourData)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tên tour */}
      <h3 className="text-xl font-bold mb-3">{getTourTitle(tourData)}</h3>

      {/* Thông tin tour */}
      <div className="space-y-3 mb-6 text-gray-600">
        {tourData.date && (
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>
              {new Date(tourData.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
        {tourData.guests && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>{tourData.guests} khách</span>
          </div>
        )}
        {tourData.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>{tourData.location}</span>
          </div>
        )}
      </div>

      {/* Chi tiết giá */}
      <div className="border-t pt-4 space-y-3">
        {/* Giá tour x khách */}
        <div className="flex justify-between text-gray-600">
          <span>{formatCurrency(price)} x {guests} khách</span>
          <span>{formatCurrency(price * guests)}</span>
        </div>

        {/* Phí dịch vụ */}
        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span>Phí dịch vụ</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
        )}

        {/* Bảo hiểm */}
        {insurance > 0 && (
          <div className="flex justify-between">
            <span>Bảo hiểm</span>
            <span>{formatCurrency(insurance)}</span>
          </div>
        )}

        {/* Tổng cộng */}
        <div className="border-t pt-3 flex justify-between text-xl font-bold">
          <span>Tổng cộng</span>
          <span className="text-orange-500">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Thanh toán an toàn */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Lock size={16} />
        <span>Thanh toán an toàn với mã hóa SSL</span>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  tourData: PropTypes.shape({
    image: PropTypes.string,
    primaryImageUrl: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    date: PropTypes.string,
    guests: PropTypes.number,
    location: PropTypes.string,
    price: PropTypes.number,
    serviceFee: PropTypes.number,
    insurance: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
};

export default OrderSummary;
