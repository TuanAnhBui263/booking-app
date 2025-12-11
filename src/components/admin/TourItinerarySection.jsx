import React from 'react';
import { Plus, Trash2, Calendar, MapPin, Utensils, Home, X } from 'lucide-react';

// Component quản lý lịch trình tour
export default function TourItinerarySection({ formData, setFormData, errors = {} }) {
  
  // Thêm lịch trình mới
  const handleAddItinerary = () => {
    const newDayNumber = formData.itineraries.length + 1;
    setFormData(prev => ({
      ...prev,
      itineraries: [
        ...prev.itineraries,
        {
          dayNumber: newDayNumber,
          title: '',
          description: '',
          activities: '',
          meals: '',
          accommodation: ''
        }
      ]
    }));
  };

  // Xóa lịch trình
  const handleRemoveItinerary = (index) => {
    setFormData(prev => {
      const newItineraries = prev.itineraries.filter((_, i) => i !== index);
      // Cập nhật lại dayNumber cho các ngày sau
      return {
        ...prev,
        itineraries: newItineraries.map((item, i) => ({
          ...item,
          dayNumber: i + 1
        }))
      };
    });
  };

  // Cập nhật thông tin lịch trình
  const handleItineraryChange = (index, field, value) => {
    setFormData(prev => {
      const newItineraries = [...prev.itineraries];
      newItineraries[index] = {
        ...newItineraries[index],
        [field]: value
      };
      return { ...prev, itineraries: newItineraries };
    });
  };

  // Di chuyển lịch trình lên
  const handleMoveUp = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const newItineraries = [...prev.itineraries];
      [newItineraries[index - 1], newItineraries[index]] = 
      [newItineraries[index], newItineraries[index - 1]];
      
      // Cập nhật lại dayNumber
      return {
        ...prev,
        itineraries: newItineraries.map((item, i) => ({
          ...item,
          dayNumber: i + 1
        }))
      };
    });
  };

  // Di chuyển lịch trình xuống
  const handleMoveDown = (index) => {
    if (index === formData.itineraries.length - 1) return;
    setFormData(prev => {
      const newItineraries = [...prev.itineraries];
      [newItineraries[index], newItineraries[index + 1]] = 
      [newItineraries[index + 1], newItineraries[index]];
      
      // Cập nhật lại dayNumber
      return {
        ...prev,
        itineraries: newItineraries.map((item, i) => ({
          ...item,
          dayNumber: i + 1
        }))
      };
    });
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lịch trình tour</h3>
          <p className="text-sm text-gray-600">Chi tiết từng ngày trong chuyến đi</p>
        </div>
        <button
          type="button"
          onClick={handleAddItinerary}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={16} />
          Thêm ngày {formData.itineraries.length + 1}
        </button>
      </div>

      {formData.itineraries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-sm text-gray-600 mb-1">Chưa có lịch trình nào</p>
          <p className="text-xs text-gray-500 mb-4">
            Thêm lịch trình chi tiết cho từng ngày trong tour
          </p>
          <button
            type="button"
            onClick={handleAddItinerary}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} />
            Thêm ngày đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {formData.itineraries.map((itinerary, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              {/* Header ngày */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {itinerary.dayNumber}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ngày {itinerary.dayNumber}</h4>
                    <p className="text-xs text-gray-500">
                      {itinerary.title || 'Chưa có tiêu đề'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Nút di chuyển */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Di chuyển lên"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === formData.itineraries.length - 1}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Di chuyển xuống"
                    >
                      ↓
                    </button>
                  </div>

                  {/* Nút xóa */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItinerary(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Xóa ngày này"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Form chi tiết */}
              <div className="space-y-3">
                {/* Tiêu đề */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tiêu đề ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Khám phá Hà Nội - Thăm Văn Miếu"
                    value={itinerary.title}
                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors[`itineraries.${index}.title`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`itineraries.${index}.title`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`itineraries.${index}.title`]}
                    </p>
                  )}
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Mô tả chi tiết các hoạt động trong ngày..."
                    value={itinerary.description}
                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors[`itineraries.${index}.description`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`itineraries.${index}.description`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`itineraries.${index}.description`]}
                    </p>
                  )}
                </div>

                {/* Hoạt động */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    Hoạt động
                  </label>
                  <textarea
                    placeholder="VD: Tham quan Văn Miếu Quốc Tử Giám, đi dạo quanh Hồ Hoàn Kiếm..."
                    value={itinerary.activities || ''}
                    onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Bữa ăn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Utensils size={16} className="text-gray-500" />
                    Bữa ăn
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Sáng: Phở, Trưa: Bún chả, Tối: Buffet hải sản"
                    value={itinerary.meals || ''}
                    onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Chỗ ở */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Home size={16} className="text-gray-500" />
                    Chỗ ở
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Khách sạn 4 sao trung tâm Hà Nội"
                    value={itinerary.accommodation || ''}
                    onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tóm tắt */}
      {formData.itineraries.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Calendar className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">Tóm tắt lịch trình</h4>
              <p className="text-sm text-blue-800">
                Tour này có <strong>{formData.itineraries.length} ngày</strong> với{' '}
                <strong>
                  {formData.itineraries.filter(i => i.title && i.description).length}
                </strong>{' '}
                ngày đã hoàn thiện thông tin
              </p>
              {formData.itineraries.some(i => !i.title || !i.description) && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <X size={14} />
                  Vui lòng điền đầy đủ tiêu đề và mô tả cho tất cả các ngày
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
