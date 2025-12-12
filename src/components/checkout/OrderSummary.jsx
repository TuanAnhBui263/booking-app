import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, Users, MapPin, Lock, Award, Coins } from 'lucide-react';

const OrderSummary = ({ tourData }) => {
  const getTourImage = (tour) =>
    tour.image || tour.primaryImageUrl || tour.PrimaryImageUrl || tour.imageUrl ||
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

  const getTourTitle = (tour) => tour.title || tour.name || tour.Name || 'Tour';

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

  // Lấy dữ liệu
  const price = tourData.price || 0;
  const guests = tourData.guests || 1;
  const serviceFee = tourData.serviceFee || Math.round(price * guests * 0.1);
  const insurance = tourData.insurance || 0;

  // Lấy loyalty data
  const loyaltyData = tourData.loyaltyData || {};
  const memberDiscount = loyaltyData.memberDiscount;
  const pointsRedemption = loyaltyData.pointsRedemption;

  // Tính toán
  const subtotal = price * guests;
  const memberDiscountAmount = memberDiscount?.discountAmount || 0;
  const pointsDiscountAmount = pointsRedemption?.pointsDiscount || 0;
  
  const totalAmount = subtotal + serviceFee + insurance - memberDiscountAmount - pointsDiscountAmount;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn đặt tour</h2>

      {/* Hình ảnh */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={getTourImage(tourData)}
          alt={getTourTitle(tourData)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tên tour */}
      <h3 className="text-xl font-bold mb-3">{getTourTitle(tourData)}</h3>

      {/* Thông tin */}
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
        {/* Giá tour */}
        <div className="flex justify-between text-gray-600">
          <span>{formatCurrency(price)} x {guests} khách</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {/* Phí dịch vụ */}
        {serviceFee > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Phí dịch vụ</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
        )}

        {/* Bảo hiểm */}
        {insurance > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Bảo hiểm</span>
            <span>{formatCurrency(insurance)}</span>
          </div>
        )}

        {/* Member Discount */}
        {memberDiscount && memberDiscountAmount > 0 && (
          <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Award size={18} />
              <span>Giảm giá hạng {memberDiscount.tierName}</span>
            </div>
            <span className="font-semibold">-{formatCurrency(memberDiscountAmount)}</span>
          </div>
        )}

        {/* Points Redemption */}
        {pointsRedemption && pointsDiscountAmount > 0 && (
          <div className="flex justify-between text-cyan-600 bg-cyan-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins size={18} />
              <span>Đổi {pointsRedemption.pointsToRedeem} điểm</span>
            </div>
            <span className="font-semibold">-{formatCurrency(pointsDiscountAmount)}</span>
          </div>
        )}

        {/* Tổng cộng */}
        <div className="border-t pt-3 flex justify-between text-xl font-bold">
          <span>Tổng cộng</span>
          <span className="text-orange-500">{formatCurrency(totalAmount)}</span>
        </div>

        {/* Points to earn */}
        {pointsRedemption?.pointsToEarn > 0 && (
          <div className="bg-purple-50 p-3 rounded-lg text-sm">
            <div className="flex items-center gap-2 text-purple-700">
              <Coins size={16} />
              <span>Bạn sẽ nhận được <strong>{pointsRedemption.pointsToEarn}</strong> điểm sau tour này</span>
            </div>
          </div>
        )}
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
    title: PropTypes.string,
    name: PropTypes.string,
    date: PropTypes.string,
    guests: PropTypes.number,
    location: PropTypes.string,
    price: PropTypes.number,
    serviceFee: PropTypes.number,
    insurance: PropTypes.number,
    loyaltyData: PropTypes.object,
  }).isRequired,
};

export default OrderSummary;