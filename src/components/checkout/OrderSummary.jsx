import React from 'react';
import { Calendar, Users, MapPin, Lock } from 'lucide-react';

const OrderSummary = ({ tourData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn đặt tour</h2>
      
      {/* Hình ảnh tour */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img 
          src={tourData.image} 
          alt={tourData.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin tour */}
      <h3 className="text-xl font-bold mb-3">{tourData.title}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} />
          <span>{tourData.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={18} />
          <span>{tourData.guests} khách</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} />
          <span>{tourData.location}</span>
        </div>
      </div>

      {/* Chi tiết giá */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>${tourData.price} x {tourData.guests} khách</span>
          <span>${tourData.price * tourData.guests}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí dịch vụ</span>
          <span>${tourData.serviceFee}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Bảo hiểm</span>
          <span>${tourData.insurance}</span>
        </div>
        
        <div className="border-t pt-3 flex justify-between text-xl font-bold">
          <span>Tổng cộng</span>
          <span className="text-orange-500">${tourData.total}</span>
        </div>
      </div>

      {}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Lock size={16} />
        <span>Thanh toán an toàn với mã hóa SSL</span>
      </div>
    </div>
  );
};

export default OrderSummary;
