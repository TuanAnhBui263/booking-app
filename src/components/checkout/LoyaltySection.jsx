import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loyaltyService } from '../../services/loyaltyService';
import { 
  Award, 
  TrendingUp, 
  Coins, 
  AlertCircle,
  CheckCircle,
  Loader,
  Info
} from 'lucide-react';

const LoyaltySection = ({ 
  bookingAmount, 
  onDiscountCalculated,
  onPointsRedeemChange 
}) => {
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redeemPreview, setRedeemPreview] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [error, setError] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Load loyalty info on mount
  useEffect(() => {
    loadLoyaltyInfo();
  }, []);

  // Calculate member discount when booking amount changes
  useEffect(() => {
    if (loyaltyInfo && bookingAmount > 0) {
      calculateMemberDiscount();
    }
  }, [loyaltyInfo, bookingAmount]);

  // Preview redemption when points change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pointsToRedeem > 0 && bookingAmount > 0) {
        previewRedemption();
      } else {
        setRedeemPreview(null);
        if (discountInfo) {
          onDiscountCalculated(discountInfo);
        }
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [pointsToRedeem, bookingAmount]);

  const loadLoyaltyInfo = async () => {
    try {
      setLoading(true);
      const response = await loyaltyService.getMyLoyaltyInfo();
      
      if (response.success) {
        setLoyaltyInfo(response.data);
      } else {
        setError('Không thể tải thông tin điểm thưởng');
      }
    } catch (err) {
      console.error('Error loading loyalty info:', err);
      setError('Lỗi khi tải thông tin điểm thưởng');
    } finally {
      setLoading(false);
    }
  };

  const calculateMemberDiscount = async () => {
    try {
      const response = await loyaltyService.calculateDiscount(bookingAmount);
      
      if (response.success) {
        setDiscountInfo(response.data);
        onDiscountCalculated(response.data);
      }
    } catch (err) {
      console.error('Error calculating discount:', err);
    }
  };

  const previewRedemption = async () => {
    if (pointsToRedeem % 100 !== 0) {
      setError('Số điểm phải là bội số của 100');
      return;
    }

    try {
      setPreviewLoading(true);
      setError(null);

      const response = await loyaltyService.previewPointsRedemption(
        bookingAmount,
        pointsToRedeem
      );

      if (response.success) {
        setRedeemPreview(response.data);
        
        // Notify parent component
        onPointsRedeemChange({
          pointsToRedeem: parseInt(response.data.pointsToRedeem.replace(/[^\d]/g, '')),
          pointsDiscount: parseFloat(response.data.pointsDiscount.replace(/[^\d]/g, '')),
          finalAmount: parseFloat(response.data.finalAmount.replace(/[^\d]/g, ''))
        });

        if (response.data.note) {
          setError(response.data.note);
        }
      } else {
        setError(response.message || 'Không thể tính toán đổi điểm');
        setRedeemPreview(null);
      }
    } catch (err) {
      console.error('Error previewing redemption:', err);
      setError(err.message || 'Lỗi khi tính toán đổi điểm');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePointsInputChange = (value) => {
    const points = parseInt(value) || 0;
    
    if (points > loyaltyInfo.currentPoints) {
      setError(`Bạn chỉ có ${loyaltyInfo.currentPoints.toLocaleString()} điểm`);
      return;
    }

    setPointsToRedeem(points);
    setError(null);
  };

  const applyMaxPoints = () => {
    if (!redeemPreview) return;
    const maxPoints = parseInt(redeemPreview.maxRedeemablePoints.replace(/[^\d]/g, ''));
    setPointsToRedeem(Math.min(maxPoints, loyaltyInfo.currentPoints));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-cyan-500" size={32} />
        </div>
      </div>
    );
  }

  if (!loyaltyInfo) return null;

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-cyan-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
          <Award className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ưu đãi thành viên</h2>
          <p className="text-sm text-gray-600">
            Hạng {loyaltyInfo.currentTierName} - {loyaltyInfo.currentPoints.toLocaleString()} điểm
          </p>
        </div>
      </div>

      {/* Member Discount Info */}
      {discountInfo && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-cyan-200">
          <div className="flex items-start gap-3 mb-3">
            <TrendingUp className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Giảm giá hạng {discountInfo.memberTier}
              </p>
              <p className="text-sm text-gray-600">
                Bạn được giảm {discountInfo.discountPercentage * 100}% cho đơn hàng này
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded p-3">
              <p className="text-gray-600">Giá gốc</p>
              <p className="font-bold text-gray-900">{discountInfo.originalAmount}</p>
            </div>
            <div className="bg-green-50 rounded p-3">
              <p className="text-gray-600">Giảm giá</p>
              <p className="font-bold text-green-600">-{discountInfo.discountAmount}</p>
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
            {loyaltyInfo.currentPoints.toLocaleString()} điểm có sẵn
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
                max={loyaltyInfo.currentPoints}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              {previewLoading && (
                <Loader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={20} />
              )}
            </div>
            <button
              onClick={applyMaxPoints}
              className="px-4 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors whitespace-nowrap"
            >
              Tối đa
            </button>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <span>100 điểm = 1,000 VND. Tối đa 50% giá trị đơn hàng</span>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
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
              <span className="font-semibold">{redeemPreview.amountAfterMemberDiscount}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Đổi điểm ({redeemPreview.pointsToRedeem})</span>
              <span className="font-bold">-{redeemPreview.pointsDiscount}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg">
              <span className="font-bold">Tổng thanh toán</span>
              <span className="font-bold text-cyan-600">{redeemPreview.finalAmount}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
              <span>Điểm còn lại</span>
              <span>{redeemPreview.remainingPoints}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Điểm tích lũy sau tour</span>
              <span className="text-green-600 font-semibold">+{redeemPreview.pointsToEarn}</span>
            </div>
          </div>

          <div className="mt-3 bg-purple-50 p-3 rounded text-xs text-purple-700">
            <p className="font-semibold mb-1">💎 Quy đổi tối đa</p>
            <p>
              Bạn có thể đổi tối đa {redeemPreview.maxRedeemablePoints} (= {redeemPreview.maxRedeemableValue})
            </p>
          </div>
        </div>
      )}

      {/* Next Tier Info */}
      {loyaltyInfo.nextTier && loyaltyInfo.pointsToNextTier > 0 && (
        <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-purple-600" size={18} />
            <span className="font-semibold text-purple-900">Thăng hạng</span>
          </div>
          <p className="text-sm text-purple-700">
            Còn <span className="font-bold">{loyaltyInfo.pointsToNextTier.toLocaleString()} điểm</span> nữa để lên hạng {loyaltyInfo.nextTierName}
          </p>
          <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (loyaltyInfo.currentPoints / (loyaltyInfo.currentPoints + loyaltyInfo.pointsToNextTier)) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

LoyaltySection.propTypes = {
  bookingAmount: PropTypes.number.isRequired,
  onDiscountCalculated: PropTypes.func.isRequired,
  onPointsRedeemChange: PropTypes.func.isRequired,
};

export default LoyaltySection;