// LoyaltyProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loyaltyService } from '../../services/loyaltyService';
import { useAuth } from '../../contexts/AuthContext';
import {
  Award,
  TrendingUp,
  Coins,
  Calendar,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Gift,
  Star,
  Trophy,
  Crown,
  Sparkles,
  History,
  Info,
  Loader,
  CheckCircle,
  XCircle
} from 'lucide-react';

const LoyaltyProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [memberTiers, setMemberTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadAllData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadPointsHistory(currentPage);
    }
  }, [activeTab, currentPage]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadLoyaltyInfo(),
        loadMemberTiers()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoyaltyInfo = async () => {
    try {
      const response = await loyaltyService.getMyLoyaltyInfo();
      if (response?.success && response?.data) {
        const loyaltyData = {
          currentPoints: response.data.CurrentPoints || 0,
          currentTierName: response.data.CurrentTierName || 'Thành viên',
          currentTier: response.data.CurrentTier || 0,
          discountPercentage: response.data.DiscountPercentage || 0,
          nextTier: response.data.NextTier || null,
          nextTierName: response.data.NextTierName || null,
          pointsToNextTier: response.data.PointsToNextTier || 0,
          lifetimePoints: response.data.CurrentPoints || 0,
          fullName: response.data.FullName || '',
          memberSince: response.data.MemberSince || null
        };
        setLoyaltyInfo(loyaltyData);
      }
    } catch (error) {
      console.error('Error loading loyalty info:', error);
    }
  };

  const loadMemberTiers = async () => {
    try {
      const response = await loyaltyService.getMemberTiers();
      if (response?.success && response?.data) {
        setMemberTiers(response.data);
      }
    } catch (error) {
      console.error('Error loading member tiers:', error);
    }
  };

  const loadPointsHistory = async (page) => {
    try {
      setHistoryLoading(true);
      const response = await loyaltyService.getMyPointsHistory(page, 20);
      if (response?.success && response?.data) {
        setPointsHistory(response.data.items || response.data.Items || []);
        setTotalPages(response.data.totalPages || response.data.TotalPages || 1);
      }
    } catch (error) {
      console.error('Error loading points history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getTierIcon = (tierName) => {
    switch (tierName?.toLowerCase()) {
      case 'đồng':
      case 'bronze':
        return <Award className="text-orange-700" size={24} />;
      case 'bạc':
      case 'silver':
        return <Star className="text-gray-400" size={24} />;
      case 'vàng':
      case 'gold':
        return <Trophy className="text-yellow-500" size={24} />;
      case 'kim cương':
      case 'diamond':
        return <Crown className="text-cyan-500" size={24} />;
      default:
        return <Award className="text-gray-500" size={24} />;
    }
  };

  const getTierColor = (tierName) => {
    switch (tierName?.toLowerCase()) {
      case 'đồng':
      case 'bronze':
        return 'from-orange-500 to-orange-700';
      case 'bạc':
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'vàng':
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'kim cương':
      case 'diamond':
        return 'from-cyan-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-cyan-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!loyaltyInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không thể tải thông tin điểm thưởng</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const currentPoints = loyaltyInfo.currentPoints || 0;
  const progressToNext = loyaltyInfo.pointsToNextTier > 0
    ? (currentPoints / (currentPoints + loyaltyInfo.pointsToNextTier)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Chương trình khách hàng thân thiết</h1>
          <p className="text-gray-600">Quản lý điểm thưởng và ưu đãi của bạn</p>
        </div>

        {/* Main Stats Card */}
        <div className={`bg-gradient-to-br ${getTierColor(loyaltyInfo.currentTierName)} rounded-2xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 opacity-10">
            <Sparkles size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  {getTierIcon(loyaltyInfo.currentTierName)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{loyaltyInfo.currentTierName}</h2>
                  <p className="text-white/80">Hạng thành viên hiện tại</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80 mb-1">Giảm giá</div>
                <div className="text-3xl font-bold">{(loyaltyInfo.discountPercentage * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="text-white" size={24} />
                  <span className="text-white/80 text-sm">Điểm hiện tại</span>
                </div>
                <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="text-white" size={24} />
                  <span className="text-white/80 text-sm">Tích lũy tổng</span>
                </div>
                <p className="text-3xl font-bold">{(loyaltyInfo.lifetimePoints || 0).toLocaleString()}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-white" size={24} />
                  <span className="text-white/80 text-sm">Thành viên từ</span>
                </div>
                <p className="text-lg font-semibold">
                  {loyaltyInfo.memberSince ? new Date(loyaltyInfo.memberSince).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Next Tier Progress */}
            {loyaltyInfo.nextTier && loyaltyInfo.pointsToNextTier > 0 && (
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    <span className="font-semibold">Tiến độ lên hạng {loyaltyInfo.nextTierName}</span>
                  </div>
                  <span className="text-sm">
                    Còn <span className="font-bold">{loyaltyInfo.pointsToNextTier.toLocaleString()}</span> điểm
                  </span>
                </div>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, progressToNext)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                  activeTab === 'overview' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tổng quan
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                  activeTab === 'history' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Lịch sử giao dịch
                {activeTab === 'history' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('tiers')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                  activeTab === 'tiers' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Các hạng thành viên
                {activeTab === 'tiers' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600" />
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Cách sử dụng điểm thưởng</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Coins className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Tích điểm</h4>
                          <p className="text-gray-600 text-sm">
                            Mỗi 10.000 VND chi tiêu = 1 điểm thưởng. Điểm được cộng sau khi hoàn thành tour.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Gift className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Đổi điểm</h4>
                          <p className="text-gray-600 text-sm">
                            100 điểm = 1.000 VND. Tối đa 50% giá trị đơn hàng. Số điểm phải là bội số của 100.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Giảm giá hạng thành viên</h4>
                          <p className="text-gray-600 text-sm">
                            Giảm giá tự động {(loyaltyInfo.discountPercentage * 100).toFixed(0)}% cho mọi đơn hàng khi bạn là thành viên hạng {loyaltyInfo.currentTierName}.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Thăng hạng</h4>
                          <p className="text-gray-600 text-sm">
                            Tích lũy điểm để thăng hạng và nhận mức giảm giá cao hơn. Hạng càng cao, ưu đãi càng lớn!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Lưu ý quan trọng</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Điểm thưởng không có giá trị quy đổi thành tiền mặt</li>
                        <li>Điểm có thể được sử dụng kết hợp với giảm giá hạng thành viên</li>
                        <li>Điểm thưởng được cộng sau khi tour kết thúc thành công</li>
                        <li>Hạng thành viên được cập nhật dựa trên tổng điểm tích lũy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Lịch sử giao dịch điểm</h3>
                
                {historyLoading ? (
                  <div className="text-center py-12">
                    <Loader className="animate-spin text-cyan-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Đang tải lịch sử...</p>
                  </div>
                ) : pointsHistory.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {pointsHistory.map((transaction, index) => {
                        const points = transaction.points || transaction.Points || 0;
                        const type = transaction.transactionType || transaction.TransactionType || '';
                        const description = transaction.description || transaction.Description || '';
                        const date = transaction.createdAt || transaction.CreatedAt || '';
                        const isPositive = points > 0;

                        return (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  isPositive ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                  {isPositive ? (
                                    <ArrowUp className="text-green-600" size={24} />
                                  ) : (
                                    <ArrowDown className="text-red-600" size={24} />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{description}</p>
                                  <p className="text-sm text-gray-500">{formatDate(date)}</p>
                                  <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {type}
                                  </span>
                                </div>
                              </div>
                              <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                <p className="text-2xl font-bold">
                                  {isPositive ? '+' : ''}{points.toLocaleString()}
                                </p>
                                <p className="text-sm">điểm</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                          Trang {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <History className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Chưa có giao dịch nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Tiers Tab */}
            {activeTab === 'tiers' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Các hạng thành viên</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {memberTiers.map((tier, index) => {
                    const tierName = tier.tierName || tier.TierName || '';
                    const minPoints = tier.minPoints || tier.MinPoints || 0;
                    const discountPercentage = tier.discountPercentage || tier.DiscountPercentage || 0;
                    const tierLevel = tier.tierLevel || tier.TierLevel || 0;
                    const isCurrentTier = tierLevel === loyaltyInfo.currentTier;

                    return (
                      <div
                        key={index}
                        className={`relative rounded-xl p-6 border-2 transition-all ${
                          isCurrentTier
                            ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {isCurrentTier && (
                          <div className="absolute -top-3 -right-3">
                            <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Hạng hiện tại
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${getTierColor(tierName)} rounded-full flex items-center justify-center`}>
                            {getTierIcon(tierName)}
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900">{tierName}</h4>
                            <p className="text-sm text-gray-600">Hạng {tierLevel}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Điểm tối thiểu</span>
                            <span className="font-bold text-gray-900">{minPoints.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Giảm giá</span>
                            <span className="font-bold text-green-600">{(discountPercentage * 100).toFixed(0)}%</span>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm text-gray-600">
                              {isCurrentTier ? (
                                <span className="flex items-center gap-2 text-cyan-600">
                                  <CheckCircle size={16} />
                                  Đây là hạng hiện tại của bạn
                                </span>
                              ) : tierLevel > loyaltyInfo.currentTier ? (
                                `Cần ${(minPoints - currentPoints).toLocaleString()} điểm nữa để đạt hạng này`
                              ) : (
                                'Bạn đã vượt qua hạng này'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Bắt đầu tích điểm ngay hôm nay!</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Khám phá các tour du lịch tuyệt vời và tích điểm để nhận ưu đãi lớn hơn
          </p>
          <button
            onClick={() => navigate('/tours')}
            className="px-8 py-4 bg-white text-cyan-600 font-bold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2 group"
          >
            <span>Khám phá các tour</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProfilePage;