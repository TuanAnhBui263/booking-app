import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { favoriteService } from '../../services/favoriteService';
import { loyaltyService } from '../../services/loyaltyService';
import { useAuth } from '../../contexts/AuthContext';
import TourReviewsSection from '../reviews/TourReviewsSection';
import {
  MapPin,
  Star,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Mountain,
  Compass,
  Heart,
  Share2,
  ChevronRight,
  ArrowLeft,
  Phone,
  Mail,
  Award,
  Shield,
  WalletCards,
  Loader,
  TrendingUp,
  Coins,
  AlertCircle,
  Info
} from 'lucide-react';

const TourDetailPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const tourId = searchParams.get('id') || location.state?.tourData?.id;

  // Tour states
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');
  const [liked, setLiked] = useState(false);
  const [availableDepartures, setAvailableDepartures] = useState([]);

  // Loyalty states
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [memberDiscount, setMemberDiscount] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redeemPreview, setRedeemPreview] = useState(null);
  const [loyaltyError, setLoyaltyError] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (tourId) {
      fetchTourDetails();
    } else {
      setError('Tour ID không hợp lệ');
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    if (tour) {
      loadDepartures();
    }
  }, [tour]);

  useEffect(() => {
    if (isAuthenticated && tourId) {
      checkFavorite();
    }
  }, [isAuthenticated, tourId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLoyaltyInfo();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && loyaltyInfo && selectedDeparture && numberOfGuests > 0) {
      calculateMemberDiscount();
    }
  }, [isAuthenticated, loyaltyInfo, selectedDeparture, numberOfGuests]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pointsToRedeem > 0 && selectedDeparture && numberOfGuests > 0) {
        previewRedemption();
      } else {
        setRedeemPreview(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pointsToRedeem, selectedDeparture, numberOfGuests]);

  const fetchTourDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tourService.getTourById(tourId);
      let tourData = response;
      if (response?.data) tourData = response.data;
      else if (response?.Data) tourData = response.Data;
      setTour(tourData);
    } catch (err) {
      console.error('Error fetching tour details:', err);
      setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartures = async () => {
    try {
      const tourDepartures = tour.departures || tour.Departures || [];
      
      if (tourDepartures.length > 0) {
        const now = new Date();
        const available = tourDepartures.filter(dep => {
          const depDate = new Date(dep.departureDate || dep.DepartureDate);
          const availableSlots = dep.availableSlots ?? dep.AvailableSlots ?? 0;
          return depDate > now && availableSlots > 0;
        });
        setAvailableDepartures(available);
        if (available.length > 0) {
          setSelectedDeparture(available[0]);
        }
      } else {
        const response = await tourService.getDepartures(tourId, new Date().toISOString(), true);
        const departures = Array.isArray(response) ? response : (response?.data || response?.Data || []);
        setAvailableDepartures(departures);
        if (departures.length > 0) {
          setSelectedDeparture(departures[0]);
        }
      }
    } catch (error) {
      console.error('Error loading departures:', error);
      setAvailableDepartures([]);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await favoriteService.checkFavorite(tourId);
      if (response?.isFavorite !== undefined) {
        setLiked(response.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await favoriteService.toggleFavorite(tourId);
      if (response?.isFavorite !== undefined) {
        setLiked(response.isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const loadLoyaltyInfo = async () => {
    try {
      setLoyaltyLoading(true);
      const response = await loyaltyService.getMyLoyaltyInfo();
      if (response?.success && response?.data) {
        setLoyaltyInfo(response.data);
      }
    } catch (err) {
      console.error('Error loading loyalty info:', err);
    } finally {
      setLoyaltyLoading(false);
    }
  };

  const calculateMemberDiscount = async () => {
    try {
      const bookingAmount = getBaseAmount();
      const response = await loyaltyService.calculateDiscount(bookingAmount);
      if (response?.success && response?.data) {
        setMemberDiscount(response.data);
      }
    } catch (err) {
      console.error('Error calculating discount:', err);
    }
  };

  const previewRedemption = async () => {
    if (pointsToRedeem % 100 !== 0) {
      setLoyaltyError('Số điểm phải là bội số của 100');
      return;
    }

    try {
      setPreviewLoading(true);
      setLoyaltyError(null);

      const bookingAmount = getBaseAmount();
      const response = await loyaltyService.previewPointsRedemption(bookingAmount, pointsToRedeem);

      if (response?.success && response?.data) {
        setRedeemPreview(response.data);
        if (response.data.note) {
          setLoyaltyError(response.data.note);
        }
      } else {
        setLoyaltyError(response?.message || 'Không thể tính toán đổi điểm');
        setRedeemPreview(null);
      }
    } catch (err) {
      console.error('Error previewing redemption:', err);
      setLoyaltyError(err.message || 'Lỗi khi tính toán đổi điểm');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePointsInputChange = (value) => {
    const points = parseInt(value) || 0;
    const currentPoints = loyaltyInfo?.currentPoints ?? 0;

    if (points > currentPoints) {
      setLoyaltyError(`Bạn chỉ có ${currentPoints.toLocaleString()} điểm`);
      return;
    }

    setPointsToRedeem(points);
    setLoyaltyError(null);
  };

  const applyMaxPoints = () => {
    if (!redeemPreview?.maxRedeemablePoints) return;
    const maxPointsStr = redeemPreview.maxRedeemablePoints.replace(/[^\d]/g, '');
    const maxPoints = parseInt(maxPointsStr) || 0;
    const currentPoints = loyaltyInfo?.currentPoints ?? 0;
    setPointsToRedeem(Math.min(maxPoints, currentPoints));
  };

  const getBaseAmount = () => {
    if (!selectedDeparture) return 0;
    const price = selectedDeparture.price || selectedDeparture.Price || getTourField('price', 0);
    const basePrice = price * numberOfGuests;
    const serviceFee = Math.round(basePrice * 0.1);
    return basePrice + serviceFee;
  };

  const calculateFinalAmount = () => {
    let total = getBaseAmount();

    if (memberDiscount?.discountAmount) {
      const discount = parseFloat(memberDiscount.discountAmount.replace(/[^\d]/g, '')) || 0;
      total -= discount;
    }

    if (redeemPreview?.pointsDiscount) {
      const pointsDiscount = parseFloat(redeemPreview.pointsDiscount.replace(/[^\d]/g, '')) || 0;
      total -= pointsDiscount;
    }

    return Math.max(0, Math.round(total));
  };

  const handleBookNow = () => {
    if (!selectedDeparture) {
      alert('Vui lòng chọn ngày khởi hành');
      return;
    }

    const availableSlots = selectedDeparture.availableSlots ?? selectedDeparture.AvailableSlots ?? 0;
    if (numberOfGuests > availableSlots) {
      alert(`Chỉ còn ${availableSlots} chỗ trống cho chuyến này`);
      return;
    }

    if (!tour) return;

    const tourIdValue = tour.id || tour.Id;
    const tourName = tour.name || tour.Name || tour.title || '';
    const tourImage = tour.primaryImageUrl || tour.PrimaryImageUrl || tour.imageUrl || tour.image || '';
    const tourPrice = selectedDeparture.price || selectedDeparture.Price || tour.price || tour.Price || 0;
    const tourLocation = tour.location || tour.Location || tour.destinationName || tour.DestinationName || '';
    const tourDuration = tour.duration || tour.Duration || '';
    const departureDate = selectedDeparture.departureDate || selectedDeparture.DepartureDate;
    const departureId = selectedDeparture.id || selectedDeparture.Id;

    navigate('/checkout', {
      state: {
        tourData: {
          id: tourIdValue,
          title: tourName,
          name: tourName,
          image: tourImage,
          price: tourPrice,
          location: tourLocation,
          duration: tourDuration,
          date: departureDate,
          guests: numberOfGuests,
          departureId: departureId,
          availableSlots: availableSlots,
          memberDiscount,
          pointsToRedeem,
          redeemPreview,
          finalAmount: calculateFinalAmount()
        }
      }
    });
  };

  const getTourField = (field, defaultValue = '') => {
    if (!tour) return defaultValue;
    const pascalField = field.charAt(0).toUpperCase() + field.slice(1);
    return tour[field] ?? tour[pascalField] ?? defaultValue;
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-cyan-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Tour không tồn tại'}</p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
          >
            Quay lại danh sách tour
          </button>
        </div>
      </div>
    );
  }

  const firstImage = (() => {
    const images = tour.images || tour.Images || [];
    if (images.length > 0) {
      const img = images[0];
      return typeof img === 'string' ? img : (img.imageUrl || img.ImageUrl || img.url || img.Url || '');
    }
    return '';
  })();
  const tourImage = firstImage;

  const tourLocation = getTourField('location', getTourField('destinationName', 'N/A'));
  const tourName = getTourField('name', getTourField('title', 'Tour'));
  const tourPrice = getTourField('price', 0);
  const tourDuration = getTourField('duration', `${getTourField('durationDays', 0)} ngày`);
  const tourRating = Number(getTourField('averageRating', getTourField('rating', 0))) || 0;
  const tourReviews = Number(getTourField('totalReviews', getTourField('reviews', 0))) || 0;
  const tourDifficulty = getTourField('difficulty', '');
  const tourCategory = getTourField('category', getTourField('type', ''));
  const tourDescription = getTourField('description', '');
  const tourMaxGuests = Number(getTourField('maxGuests', 0)) || 0;

  const tourImages = (tour.images || tour.Images || tour.gallery || tour.Gallery || [])
    .map(img => typeof img === 'string' ? img : (img.imageUrl || img.ImageUrl || img.url || img.Url || ''))
    .filter(Boolean);

  const tourItinerary = tour.itineraries || tour.Itineraries || tour.itinerary || [];
  const tourIncludes = tour.includes || tour.Includes || [];
  const tourExcludes = tour.excludes || tour.Excludes || [];

  const currentPoints = loyaltyInfo?.currentPoints ?? 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[500px]">
        <img src={tourImage || '/placeholder-tour.jpg'} alt={tourName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart size={20} className={liked ? 'fill-current' : ''} />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:bg-white transition-all">
            <Share2 size={20} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              {tourCategory && (
                <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-sm font-semibold">
                  {tourCategory}
                </span>
              )}
              {tourDifficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  ['Easy', 'Dễ'].includes(tourDifficulty) ? 'bg-green-500 text-white' :
                  ['Medium', 'Trung bình'].includes(tourDifficulty) ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {tourDifficulty}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tourName}</h1>
            {tourDescription && (
              <p className="text-xl text-white/90 line-clamp-2">{tourDescription}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl">
                <Clock className="text-cyan-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Thời lượng</p>
                <p className="font-bold text-gray-900">{tourDuration}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                <Users className="text-blue-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Nhóm</p>
                <p className="font-bold text-gray-900">Tối đa {tourMaxGuests} người</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                <MapPin className="text-purple-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Địa điểm</p>
                <p className="font-bold text-gray-900">{tourLocation}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                <Star className="text-yellow-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Đánh giá</p>
                <p className="font-bold text-gray-900">{tourRating.toFixed(1)} ({tourReviews})</p>
              </div>
            </div>

            {/* Loyalty Section - Chỉ hiện khi đã đăng nhập */}
            {isAuthenticated && selectedDeparture && loyaltyInfo && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-cyan-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Ưu đãi thành viên</h2>
                    <p className="text-sm text-gray-600">
                      Hạng {loyaltyInfo.currentTierName || 'Thành viên'} -{' '}
                      {currentPoints.toLocaleString()} điểm
                    </p>
                  </div>
                </div>

                {/* Member Discount */}
                {memberDiscount && (
                  <div className="bg-white rounded-lg p-4 mb-4 border border-cyan-200">
                    <div className="flex items-start gap-3 mb-3">
                      <TrendingUp className="text-green-500 flex-shrink-0 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Giảm giá hạng {memberDiscount.memberTier || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Bạn được giảm {(memberDiscount.discountPercentage || 0) * 100}% cho đơn hàng này
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-gray-600">Giá gốc</p>
                        <p className="font-bold text-gray-900">{memberDiscount.originalAmount || '0 ₫'}</p>
                      </div>
                      <div className="bg-green-50 rounded p-3">
                        <p className="text-gray-600">Giảm giá</p>
                        <p className="font-bold text-green-600">-{memberDiscount.discountAmount || '0 ₫'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Points Redemption */}
                <div className="bg-white rounded-lg p-4 border border-cyan-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Coins className="text-cyan-600" size={20} />
                      <span className="font-semibold text-gray-900">Đổi điểm thưởng</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentPoints.toLocaleString()} điểm có sẵn
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          value={pointsToRedeem || ''}
                          onChange={(e) => handlePointsInputChange(e.target.value)}
                          placeholder="Nhập số điểm (bội số của 100)"
                          step="100"
                          min="0"
                          max={currentPoints}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        {previewLoading && (
                          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={20} />
                        )}
                      </div>
                      <button
                        onClick={applyMaxPoints}
                        disabled={!redeemPreview}
                        className="px-4 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        Tối đa
                      </button>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      <Info size={16} className="flex-shrink-0 mt-0.5" />
                      <span>100 điểm = 1.000 VND. Tối đa 50% giá trị đơn hàng</span>
                    </div>

                    {loyaltyError && (
                      <div className="flex items-start gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <span>{loyaltyError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Redemption Preview */}
                {redeemPreview && (
                  <div className="bg-white rounded-lg p-4 mt-4 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="font-semibold text-gray-900">Xem trước giảm giá</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giá sau giảm hạng</span>
                        <span className="font-semibold">{redeemPreview.amountAfterMemberDiscount || '0 ₫'}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Đổi điểm ({redeemPreview.pointsToRedeem || 0})</span>
                        <span className="font-bold">-{redeemPreview.pointsDiscount || '0 ₫'}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg">
                        <span className="font-bold">Tổng thanh toán</span>
                        <span className="font-bold text-cyan-600">{redeemPreview.finalAmount || '0 ₫'}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                        <span>Điểm còn lại</span>
                        <span>{redeemPreview.remainingPoints || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Điểm tích lũy sau tour</span>
                        <span className="text-green-600 font-semibold">+{redeemPreview.pointsToEarn || 0}</span>
                      </div>
                    </div>

                    {redeemPreview.maxRedeemablePoints && (
                      <div className="mt-3 bg-purple-50 p-3 rounded text-xs text-purple-700">
                        <p className="font-semibold mb-1">Quy đổi tối đa</p>
                        <p>
                          Bạn có thể đổi tối đa {redeemPreview.maxRedeemablePoints} (= {redeemPreview.maxRedeemableValue || '0 ₫'})
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Tier Progress */}
                {loyaltyInfo.nextTier && loyaltyInfo.pointsToNextTier > 0 && (
                  <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-purple-600" size={18} />
                      <span className="font-semibold text-purple-900">Thăng hạng</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Còn <span className="font-bold">{(loyaltyInfo.pointsToNextTier || 0).toLocaleString()} điểm</span> nữa để lên hạng {loyaltyInfo.nextTierName}
                    </p>
                    <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (currentPoints / (currentPoints + (loyaltyInfo.pointsToNextTier || 0))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {['overview', 'itinerary', 'included'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-semibold transition-colors relative ${
                      activeTab === tab ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' && 'Tổng quan'}
                    {tab === 'itinerary' && 'Lịch trình'}
                    {tab === 'included' && 'Bao gồm'}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600 rounded-t" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{tourDescription || 'Chưa có mô tả'}</p>

                {tourImages.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Thư viện ảnh</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {tourImages.slice(0, 8).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Lịch trình chi tiết</h3>
                {tourItinerary.length > 0 ? (
                  <div className="space-y-6">
                    {tourItinerary.map((day, idx) => {
                      const dayNumber = day.dayNumber || day.DayNumber || day.day || day.Day || idx + 1;
                      const dayTitle = day.title || day.Title || day.name || day.Name || `Ngày ${dayNumber}`;
                      const dayDescription = day.description || day.Description || day.content || day.Content || '';
                      const activities = day.activities || day.Activities || '';
                      const meals = day.meals || day.Meals || '';
                      const accommodation = day.accommodation || day.Accommodation || '';

                      return (
                        <div key={day.id || idx} className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {dayNumber}
                            </div>
                          </div>
                          <div className="flex-1 pb-6 border-b border-gray-200 last:border-0">
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{dayTitle}</h4>
                            <p className="text-gray-700 leading-relaxed mb-4">{dayDescription}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4">
                              {activities && (
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Compass className="text-blue-600" size={16} />
                                    <span className="font-semibold text-sm text-blue-900">Hoạt động</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{activities}</p>
                                </div>
                              )}
                              {meals && (
                                <div className="bg-orange-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="text-orange-600" size={16} />
                                    <span className="font-semibold text-sm text-orange-900">Bữa ăn</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{meals}</p>
                                </div>
                              )}
                              {accommodation && (
                                <div className="bg-purple-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Mountain className="text-purple-600" size={16} />
                                    <span className="font-semibold text-sm text-purple-900">Lưu trú</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{accommodation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có lịch trình chi tiết</p>
                )}
              </div>
            )}

            {activeTab === 'included' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bao gồm</h3>
                  {tourIncludes.length > 0 ? (
                    <div className="space-y-3">
                      {tourIncludes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                          <span className="text-gray-700">
                            {typeof item === 'string' ? item : (item.Item || item.item || '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có thông tin</p>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Không bao gồm</h3>
                  {tourExcludes.length > 0 ? (
                    <div className="space-y-3">
                      {tourExcludes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                          <span className="text-gray-700">
                            {typeof item === 'string' ? item : (item.Item || item.item || '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có thông tin</p>
                  )}
                </div>
              </div>
            )}

            <TourReviewsSection tourId={tourId} />
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-cyan-600">
                      {formatCurrency(tourPrice)}
                    </span>
                    <span className="text-gray-500">/người</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm text-yellow-600">{tourRating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-600">({tourReviews} đánh giá)</span>
                  </div>
                </div>

                {/* Departure Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày khởi hành
                  </label>
                  {availableDepartures.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {availableDepartures.map((departure) => {
                        const depDate = new Date(departure.departureDate || departure.DepartureDate);
                        const depId = departure.id || departure.Id;
                        const depPrice = departure.price || departure.Price || tourPrice;
                        const availableSlots = departure.availableSlots ?? departure.AvailableSlots ?? 0;
                        const maxGuests = departure.maxGuests || departure.MaxGuests || tourMaxGuests;
                        const isSelected = selectedDeparture && (selectedDeparture.id || selectedDeparture.Id) === depId;
                        
                        return (
                          <button
                            key={depId}
                            onClick={() => setSelectedDeparture(departure)}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                              isSelected 
                                ? 'border-cyan-500 bg-cyan-50' 
                                : 'border-gray-200 hover:border-cyan-300 bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="text-cyan-600" size={16} />
                                <span className="font-semibold text-gray-900">
                                  {depDate.toLocaleDateString('vi-VN', { 
                                    weekday: 'short',
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                              {depPrice !== tourPrice && (
                                <span className="text-sm font-bold text-cyan-600">
                                  {formatCurrency(depPrice)}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className={`${availableSlots <= 5 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                Còn {availableSlots}/{maxGuests} chỗ
                              </span>
                              {availableSlots <= 5 && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                                  Sắp hết chỗ
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                      <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-gray-600 text-sm">Chưa có lịch khởi hành</p>
                    </div>
                  )}
                </div>

                {/* Guest Count */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số lượng khách
                  </label>
                  {selectedDeparture ? (
                    <>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={numberOfGuests <= 1}
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-lg">{numberOfGuests}</span>
                        <button
                          onClick={() => {
                            const maxSlots = selectedDeparture.availableSlots ?? selectedDeparture.AvailableSlots ?? 0;
                            setNumberOfGuests(Math.min(maxSlots, numberOfGuests + 1));
                          }}
                          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={numberOfGuests >= (selectedDeparture.availableSlots ?? selectedDeparture.AvailableSlots ?? 0)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Tối đa {selectedDeparture.availableSlots ?? selectedDeparture.AvailableSlots ?? 0} khách cho chuyến này
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-500 text-sm">Vui lòng chọn ngày khởi hành</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                {selectedDeparture && (
                  <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        {formatCurrency(selectedDeparture.price || selectedDeparture.Price || tourPrice)} x {numberOfGuests} khách
                      </span>
                      <span>
                        {formatCurrency((selectedDeparture.price || selectedDeparture.Price || tourPrice) * numberOfGuests)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Phí dịch vụ</span>
                      <span>
                        {formatCurrency(Math.round((selectedDeparture.price || selectedDeparture.Price || tourPrice) * numberOfGuests * 0.1))}
                      </span>
                    </div>

                    {memberDiscount?.discountAmount && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá hạng {memberDiscount.memberTier}</span>
                        <span>-{memberDiscount.discountAmount}</span>
                      </div>
                    )}

                    {redeemPreview?.pointsDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Đổi {redeemPreview.pointsToRedeem} điểm</span>
                        <span>-{redeemPreview.pointsDiscount}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                      <span>Tổng cộng</span>
                      <span className="text-cyan-600">
                        {formatCurrency(calculateFinalAmount())}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  disabled={!selectedDeparture}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Đặt ngay</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bạn sẽ không bị tính phí ngay lập tức
                </p>

                {/* Support */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Cần hỗ trợ?</h4>
                  <div className="space-y-2 text-sm">
                    <a href="tel:+1234567890" className="flex items-center gap-2 text-gray-600 hover:text-cyan-600">
                      <Phone size={16} />
                      <span>+1 (234) 567-890</span>
                    </a>
                    <a href="mailto:support@tavelo.com" className="flex items-center gap-2 text-gray-600 hover:text-cyan-600">
                      <Mail size={16} />
                      <span>support@tavelo.com</span>
                    </a>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="text-green-500" size={16} />
                    <span>Bảo hiểm toàn diện</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Award className="text-cyan-500" size={16} />
                    <span>Hướng dẫn viên chuyên nghiệp</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <WalletCards className="text-blue-500" size={16} />
                    <span>Giá tốt nhất</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="text-purple-500" size={16} />
                    <span>Hoàn tiền 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;