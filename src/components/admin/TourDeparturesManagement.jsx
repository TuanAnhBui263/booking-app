import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Users,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  RefreshCw
} from 'lucide-react';

export default function TourDeparturesManagement() {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedDeparture, setSelectedDeparture] = useState(null);

  const [formData, setFormData] = useState({
    departureDate: '',
    returnDate: '',
    availableSlots: '',
    priceAdjustment: 0,
    status: 0,
    guideId: null,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Bulk generate state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFormData, setBulkFormData] = useState({
    startDate: '',
    endDate: '',
    frequency: 'weekly', // daily, weekly, biweekly, monthly
    daysOfWeek: [], // [0-6] for weekly
    dayOfMonth: 1, // for monthly
    availableSlots: '',
    priceAdjustment: 0,
    guideId: null
  });

  useEffect(() => {
    fetchTourAndDepartures();
  }, [tourId]);

  const fetchTourAndDepartures = async () => {
    try {
      setLoading(true);
      const [tourData, departuresData] = await Promise.all([
        tourService.getTourById(tourId),
        tourService.getDepartures(tourId, null, false)
      ]);

      setTour(tourData);
      
      let deps = [];
      if (Array.isArray(departuresData)) {
        deps = departuresData;
      } else if (departuresData.items || departuresData.Items) {
        deps = departuresData.items || departuresData.Items;
      } else if (departuresData.data || departuresData.Data) {
        deps = departuresData.data || departuresData.Data;
      }
      
      setDepartures(deps);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu tour');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, departure = null) => {
    setModalMode(mode);
    setSelectedDeparture(departure);

    if (mode === 'edit' && departure) {
      setFormData({
        departureDate: departure.DepartureDate || departure.departureDate || '',
        returnDate: departure.ReturnDate || departure.returnDate || '',
        availableSlots: departure.AvailableSlots || departure.availableSlots || '',
        priceAdjustment: departure.PriceAdjustment || departure.priceAdjustment || 0,
        status: departure.Status !== undefined ? departure.Status : (departure.status || 0),
        guideId: departure.GuideId || departure.guideId || null,
        notes: departure.Notes || departure.notes || ''
      });
    } else {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tourDays = tour?.DurationDays || tour?.durationDays || 1;
      const returnDate = new Date(tomorrow);
      returnDate.setDate(returnDate.getDate() + tourDays - 1);

      setFormData({
        departureDate: tomorrow.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
        availableSlots: tour?.MaxGuests || tour?.maxGuests || '',
        priceAdjustment: 0,
        status: 0,
        guideId: null,
        notes: ''
      });
    }

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDeparture(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.departureDate) newErrors.departureDate = 'Ngày khởi hành là bắt buộc';
    if (!formData.returnDate) newErrors.returnDate = 'Ngày kết thúc là bắt buộc';
    if (!formData.availableSlots || formData.availableSlots < 0) {
      newErrors.availableSlots = 'Số chỗ hợp lệ là bắt buộc';
    }
    
    if (formData.departureDate && formData.returnDate) {
      const depDate = new Date(formData.departureDate);
      const retDate = new Date(formData.returnDate);
      if (retDate <= depDate) {
        newErrors.returnDate = 'Ngày kết thúc phải sau ngày khởi hành';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const submitData = {
        departureDate: new Date(formData.departureDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
        availableSlots: parseInt(formData.availableSlots),
        priceAdjustment: parseFloat(formData.priceAdjustment),
        status: parseInt(formData.status),
        guideId: formData.guideId || null,
        notes: formData.notes || null
      };

      if (modalMode === 'create') {
        await tourService.createDeparture(tourId, submitData);
        alert('Tạo chuyến khởi hành thành công!');
      } else if (modalMode === 'edit') {
        const departureId = selectedDeparture.Id || selectedDeparture.id;
        await tourService.updateDeparture(tourId, departureId, submitData);
        alert('Cập nhật chuyến khởi hành thành công!');
      }

      closeModal();
      fetchTourAndDepartures();
    } catch (error) {
      console.error('Lỗi khi lưu chuyến khởi hành:', error);
      alert('Không thể lưu chuyến khởi hành');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDeparture) return;

    try {
      setLoading(true);
      const departureId = selectedDeparture.Id || selectedDeparture.id;
      await tourService.deleteDeparture(tourId, departureId);
      alert('Xóa chuyến khởi hành thành công!');
      closeModal();
      fetchTourAndDepartures();
    } catch (error) {
      console.error('Lỗi khi xóa chuyến khởi hành:', error);
      alert('Không thể xóa chuyến khởi hành');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const generateRequest = {
        startDate: new Date(bulkFormData.startDate).toISOString(),
        endDate: new Date(bulkFormData.endDate).toISOString(),
        frequency: bulkFormData.frequency,
        daysOfWeek: bulkFormData.frequency === 'weekly' ? bulkFormData.daysOfWeek : null,
        dayOfMonth: bulkFormData.frequency === 'monthly' ? parseInt(bulkFormData.dayOfMonth) : null,
        availableSlots: parseInt(bulkFormData.availableSlots),
        priceAdjustment: parseFloat(bulkFormData.priceAdjustment),
        guideId: bulkFormData.guideId || null
      };

      await tourService.generateDepartures(tourId, generateRequest);
      alert('Tạo hàng loạt chuyến khởi hành thành công!');
      setShowBulkModal(false);
      fetchTourAndDepartures();
    } catch (error) {
      console.error('Lỗi khi tạo hàng loạt:', error);
      alert('Không thể tạo hàng loạt chuyến khởi hành');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const badges = {
      0: { label: 'Có sẵn', class: 'bg-green-100 text-green-800' },
      1: { label: 'Đã đầy', class: 'bg-red-100 text-red-800' },
      2: { label: 'Đã hủy', class: 'bg-gray-100 text-gray-800' },
      3: { label: 'Đã hoàn thành', class: 'bg-blue-100 text-blue-800' }
    };
    return badges[status] || badges[0];
  };

  if (loading && !tour) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/tours')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý chuyến khởi hành
              </h1>
              <p className="text-gray-600 mt-1">
                {tour?.Name || tour?.name}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => openModal('create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Thêm chuyến đi
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Calendar size={20} />
              Tạo hàng loạt
            </button>
            <button
              onClick={fetchTourAndDepartures}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw size={20} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Departures List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày khởi hành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Chỗ trống
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Giá điều chỉnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departures.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
                      <p>Chưa có chuyến khởi hành nào</p>
                    </td>
                  </tr>
                ) : (
                  departures.map(dep => {
                    const d = {
                      id: dep.Id || dep.id,
                      departureDate: dep.DepartureDate || dep.departureDate,
                      returnDate: dep.ReturnDate || dep.returnDate,
                      availableSlots: dep.AvailableSlots || dep.availableSlots,
                      bookedSlots: dep.BookedSlots || dep.bookedSlots || 0,
                      priceAdjustment: dep.PriceAdjustment || dep.priceAdjustment,
                      status: dep.Status !== undefined ? dep.Status : dep.status
                    };

                    return (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(d.departureDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(d.returnDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-400" />
                            <span>
                              {d.availableSlots - d.bookedSlots} / {d.availableSlots}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {d.priceAdjustment > 0 ? '+' : ''}
                          {d.priceAdjustment?.toLocaleString()} đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(d.status).class}`}>
                            {getStatusBadge(d.status).label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => openModal('edit', dep)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => openModal('delete', dep)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Single Departure Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' && 'Thêm chuyến khởi hành'}
                {modalMode === 'edit' && 'Chỉnh sửa chuyến khởi hành'}
                {modalMode === 'delete' && 'Xóa chuyến khởi hành'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {modalMode === 'delete' ? (
                <div>
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle size={48} />
                    <div>
                      <h3 className="text-lg font-semibold">Bạn có chắc chắn?</h3>
                      <p className="text-gray-600">Hành động này không thể hoàn tác.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày khởi hành <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.departureDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.returnDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số chỗ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.availableSlots}
                        onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.availableSlots ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.availableSlots && <p className="text-red-500 text-xs mt-1">{errors.availableSlots}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Điều chỉnh giá (đ)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.priceAdjustment}
                        onChange={(e) => setFormData({ ...formData, priceAdjustment: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={0}>Có sẵn</option>
                      <option value={1}>Đã đầy</option>
                      <option value={2}>Đã hủy</option>
                      <option value={3}>Đã hoàn thành</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {loading ? 'Đang lưu...' : (modalMode === 'create' ? 'Tạo' : 'Cập nhật')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Generate Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Tạo hàng loạt chuyến khởi hành</h2>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleBulkGenerate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Từ ngày <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bulkFormData.startDate}
                      onChange={(e) => setBulkFormData({ ...bulkFormData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đến ngày <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bulkFormData.endDate}
                      onChange={(e) => setBulkFormData({ ...bulkFormData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tần suất <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bulkFormData.frequency}
                    onChange={(e) => setBulkFormData({ ...bulkFormData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="biweekly">Hai tuần một lần</option>
                    <option value="monthly">Hàng tháng</option>
                  </select>
                </div>

                {bulkFormData.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày trong tuần
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={bulkFormData.daysOfWeek.includes(idx)}
                            onChange={(e) => {
                              const days = [...bulkFormData.daysOfWeek];
                              if (e.target.checked) {
                                days.push(idx);
                              } else {
                                const index = days.indexOf(idx);
                                if (index > -1) days.splice(index, 1);
                              }
                              setBulkFormData({ ...bulkFormData, daysOfWeek: days });
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số chỗ mỗi chuyến <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={bulkFormData.availableSlots}
                      onChange={(e) => setBulkFormData({ ...bulkFormData, availableSlots: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điều chỉnh giá (đ)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={bulkFormData.priceAdjustment}
                      onChange={(e) => setBulkFormData({ ...bulkFormData, priceAdjustment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {loading ? 'Đang tạo...' : 'Tạo hàng loạt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}