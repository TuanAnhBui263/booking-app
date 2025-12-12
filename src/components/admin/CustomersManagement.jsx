import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  UsersIcon, 
  TrendingUp, 
  Search, 
  Mail, 
  Phone, 
  Edit, 
  Trash2,
  X,
  Loader,
  CheckCircle,
  Award,
  Star,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  ChevronLeft,
  ChevronRight,
  Crown,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';

import { userService } from '../../services/userService';
import { loyaltyService } from '../../services/loyaltyService';

const UserRole = {
  Customer: 0,
  Guide: 1,
  Staff: 2,
  Manager: 3,
  Admin: 4
};

const getRoleFromRolesArray = (roles) => {
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return UserRole.Customer;
  }
  
  const roleString = roles[0];
  const roleMap = {
    'Customer': UserRole.Customer,
    'Guide': UserRole.Guide,
    'Staff': UserRole.Staff,
    'Manager': UserRole.Manager,
    'Admin': UserRole.Admin
  };
  
  return roleMap[roleString] ?? UserRole.Customer;
};

const getRoleLabel = (role) => {
  const labels = ['Customer', 'Guide', 'Staff', 'Manager', 'Admin'];
  return labels[role] || 'Customer';
};

const getRoleBadge = (role) => {
  const badges = {
    0: { label: 'Customer', class: 'bg-gray-100 text-gray-800' },
    1: { label: 'Guide', class: 'bg-green-100 text-green-800' },
    2: { label: 'Staff', class: 'bg-blue-100 text-blue-800' },
    3: { label: 'Manager', class: 'bg-purple-100 text-purple-800' },
    4: { label: 'Admin', class: 'bg-red-100 text-red-800' }
  };
  return badges[role] || badges[0];
};

const getTierBadge = (tier) => {
  const badges = {
    'Bronze': { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🥉' },
    'Silver': { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '🥈' },
    'Gold': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🥇' },
    'Platinum': { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '💎' }
  };
  return badges[tier] || badges['Bronze'];
};

const CustomersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalPoints: 0,
    avgPoints: 0,
    tierDistribution: {
      Bronze: 0,
      Silver: 0,
      Gold: 0,
      Platinum: 0
    }
  });

  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [pointsHistoryPage, setPointsHistoryPage] = useState(1);
  const [pointsHistoryPages, setPointsHistoryPages] = useState(1);
  const [showPointsAdjustment, setShowPointsAdjustment] = useState(false);
  const [pointsAdjustment, setPointsAdjustment] = useState({ points: '', reason: '' });
  const [tiers, setTiers] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserRole.Customer,
    isActive: true,
    address: '',
    dateOfBirth: '',
    nationality: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsersWithLoyalty();
  }, [currentPage, roleFilter, statusFilter, tierFilter]);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchUsersWithLoyalty = async () => {
    try {
      setLoading(true);
      
      // Fetch users with loyalty info from admin endpoint
      const response = await loyaltyService.getAdminLoyaltyOverview(
        currentPage,
        pageSize,
        searchTerm || null,
        tierFilter || null
      );
      
      console.log('Admin loyalty overview:', response);
      
      // Extract data from response
      const usersData = response.data || response.Data || [];
      const statistics = response.statistics || response.Statistics || {};
      const totalCount = response.totalCount || response.TotalCount || 0;
      const page = response.page || response.Page || 1;
      const size = response.pageSize || response.PageSize || pageSize;
      
      // Calculate total pages
      const pages = Math.ceil(totalCount / size);
      
      setUsers(usersData);
      setTotalPages(pages);
      setTotalUsers(totalCount);
      setCurrentPage(page);
      
      // Set statistics
      setStats({
        total: statistics.totalUsers || statistics.TotalUsers || totalCount,
        active: statistics.activeUsers || statistics.ActiveUsers || 0,
        totalPoints: statistics.totalPointsInSystem || statistics.TotalPointsInSystem || 0,
        avgPoints: statistics.averagePointsPerUser || statistics.AveragePointsPerUser || 0,
        tierDistribution: {
          Bronze: statistics.bronzeCount || statistics.BronzeCount || 0,
          Silver: statistics.silverCount || statistics.SilverCount || 0,
          Gold: statistics.goldCount || statistics.GoldCount || 0,
          Platinum: statistics.platinumCount || statistics.PlatinumCount || 0
        }
      });
      
    } catch (error) {
      console.error('Error fetching users with loyalty:', error);
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiers = async () => {
    try {
      const response = await loyaltyService.getMemberTiers();
      console.log('Tiers response:', response);
      
      const tiersData = response.Data || response.data || response || [];
      setTiers(tiersData);
    } catch (error) {
      console.error('Error fetching tiers:', error);
      setTiers([
        {
          name: 'Bronze',
          minSpending: 0,
          discountPercentage: 0.05,
          benefits: ['5% discount', 'Basic support']
        },
        {
          name: 'Silver',
          minSpending: 5000000,
          discountPercentage: 0.10,
          benefits: ['10% discount', 'Priority support']
        },
        {
          name: 'Gold',
          minSpending: 10000000,
          discountPercentage: 0.15,
          benefits: ['15% discount', 'VIP support', 'Free upgrades']
        },
        {
          name: 'Platinum',
          minSpending: 20000000,
          discountPercentage: 0.20,
          benefits: ['20% discount', 'Dedicated manager', 'Premium benefits']
        }
      ]);
    }
  };

  const fetchLoyaltyInfo = async (userId) => {
    try {
      setLoading(true);
      
      // Get detailed loyalty info for specific user
      const loyalty = await loyaltyService.getAdminUserLoyaltyDetail(userId);
      console.log('User loyalty detail:', loyalty);
      
      const data = loyalty.data || loyalty.Data || loyalty;
      
      setLoyaltyInfo({
        userId: data.userId || data.UserId,
        fullName: data.fullName || data.FullName,
        email: data.email || data.Email,
        phoneNumber: data.phoneNumber || data.PhoneNumber,
        currentPoints: data.currentPoints || data.CurrentPoints || 0,
        currentTier: data.currentTierName || data.CurrentTierName || 'Bronze',
        discountPercentage: data.discountPercentage || data.DiscountPercentage || 0,
        nextTier: data.nextTierName || data.NextTierName || null,
        pointsToNextTier: data.pointsToNextTier || data.PointsToNextTier || 0,
        totalPointsEarned: data.totalPointsEarned || data.TotalPointsEarned || 0,
        totalPointsRedeemed: data.totalPointsRedeemed || data.TotalPointsRedeemed || 0,
        totalTransactions: data.totalTransactions || data.TotalTransactions || 0,
        memberSince: data.memberSince || data.MemberSince || new Date().toISOString(),
        lastTierUpdateAt: data.lastTierUpdateAt || data.LastTierUpdateAt,
        lastTransactionAt: data.lastTransactionAt || data.LastTransactionAt
      });
      
      // Get points history
      await fetchPointsHistory(userId, 1);
      
    } catch (error) {
      console.error('Error fetching loyalty info:', error);
      setLoyaltyInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsHistory = async (userId, page) => {
    try {
      const response = await loyaltyService.getAdminUserPointsHistory(userId, page, 10);
      console.log('Points history:', response);
      
      const historyData = response.data || response.Data || [];
      const pages = response.totalPages || response.TotalPages || 1;
      
      setPointsHistory(historyData);
      setPointsHistoryPages(pages);
      setPointsHistoryPage(page);
    } catch (error) {
      console.error('Error fetching points history:', error);
      setPointsHistory([]);
    }
  };

  const openLoyaltyModal = async (user) => {
    setSelectedUser(user);
    setShowLoyaltyModal(true);
    const userId = user.userId || user.UserId || user.Id || user.id;
    await fetchLoyaltyInfo(userId);
  };

  const closeLoyaltyModal = () => {
    setShowLoyaltyModal(false);
    setSelectedUser(null);
    setLoyaltyInfo(null);
    setPointsHistory([]);
    setShowPointsAdjustment(false);
    setPointsAdjustment({ points: '', reason: '' });
  };

  const handlePointsAdjustment = async () => {
    const points = parseInt(pointsAdjustment.points);
    
    if (isNaN(points) || points === 0) {
      alert('Please enter a valid points amount (positive to add, negative to subtract)');
      return;
    }
    
    if (!pointsAdjustment.reason.trim()) {
      alert('Please enter a reason for the adjustment');
      return;
    }
    
    try {
      setLoading(true);
      
      const userId = loyaltyInfo.userId;
      await loyaltyService.adminAdjustPoints(userId, points, pointsAdjustment.reason.trim());
      
      alert(points > 0 
        ? `Successfully added ${points} points` 
        : `Successfully deducted ${Math.abs(points)} points`
      );
      
      // Refresh loyalty info
      await fetchLoyaltyInfo(userId);
      
      setShowPointsAdjustment(false);
      setPointsAdjustment({ points: '', reason: '' });
      
      // Refresh users list
      await fetchUsersWithLoyalty();
      
    } catch (error) {
      console.error('Error adjusting points:', error);
      alert('Failed to adjust points: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchUsersWithLoyalty();
  };

  const resetFilters = () => {
    setRoleFilter('');
    setStatusFilter('');
    setTierFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const openModal = async (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    
    if (mode === 'edit' && user) {
      try {
        setLoading(true);
        
        const userId = user.userId || user.UserId || user.Id || user.id;
        const response = await userService.getUserById(userId);
        
        const fullUser = response.Data || response.data || response;
        
        const roleValue = fullUser.Roles 
          ? getRoleFromRolesArray(fullUser.Roles)
          : (fullUser.Role !== undefined ? fullUser.Role : fullUser.role);
        
        setFormData({
          fullName: fullUser.FullName || fullUser.fullName || '',
          email: fullUser.Email || fullUser.email || '',
          phoneNumber: fullUser.PhoneNumber || fullUser.phoneNumber || '',
          password: '',
          role: roleValue,
          isActive: fullUser.IsActive !== undefined ? fullUser.IsActive : fullUser.isActive,
          address: fullUser.Address || fullUser.address || '',
          dateOfBirth: fullUser.DateOfBirth || fullUser.dateOfBirth || '',
          nationality: fullUser.Nationality || fullUser.nationality || ''
        });
        
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to load user details');
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: UserRole.Customer,
        isActive: true,
        address: '',
        dateOfBirth: '',
        nationality: ''
      });
    }
    
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: UserRole.Customer,
      isActive: true,
      address: '',
      dateOfBirth: '',
      nationality: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email address';
      }
    }
    
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (modalMode === 'create') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        const password = formData.password;
        if (password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(password)) {
          newErrors.password = 'Password must contain uppercase letter';
        } else if (!/[a-z]/.test(password)) {
          newErrors.password = 'Password must contain lowercase letter';
        } else if (!/[0-9]/.test(password)) {
          newErrors.password = 'Password must contain number';
        } else if (!/[^A-Za-z0-9]/.test(password)) {
          newErrors.password = 'Password must contain special character';
        }
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
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        role: parseInt(formData.role),
        isActive: formData.isActive,
        address: formData.address.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        nationality: formData.nationality.trim() || null
      };
      
      if (modalMode === 'create') {
        if (!formData.password) {
          alert('Password is required');
          setLoading(false);
          return;
        }
        submitData.password = formData.password;
      } else if (modalMode === 'edit' && formData.password) {
        submitData.password = formData.password;
      }
      
      if (modalMode === 'create') {
        await userService.createUser(submitData);
        alert('User created successfully!');
      } else {
        const userId = selectedUser.userId || selectedUser.UserId || selectedUser.Id || selectedUser.id;
        await userService.updateUser(userId, submitData);
        alert('User updated successfully!');
      }
      
      closeModal();
      await fetchUsersWithLoyalty();
      
    } catch (error) {
      console.error('Error saving user:', error);
      
      let errorMessage = 'Failed to save user';
      
      if (error.response) {
        const { data, validationErrors } = error.response;
        
        if (validationErrors) {
          const fieldErrors = {};
          Object.keys(validationErrors).forEach(key => {
            const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
            const messages = Array.isArray(validationErrors[key]) 
              ? validationErrors[key] 
              : [validationErrors[key]];
            fieldErrors[fieldName] = messages[0];
          });
          
          setErrors(fieldErrors);
          errorMessage = 'Please check the form for errors';
        } else if (data?.message || data?.Message) {
          errorMessage = data.message || data.Message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    const userName = user.fullName || user.FullName || user.userName || user.UserName;
    if (!window.confirm(`Delete ${userName}?`)) return;
    
    try {
      setLoading(true);
      const userId = user.userId || user.UserId || user.Id || user.id;
      await userService.deleteUser(userId);
      alert('User deleted successfully!');
      await fetchUsersWithLoyalty();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userService.updateUserStatus(userId, { isActive: !currentStatus });
      await fetchUsersWithLoyalty();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer & Loyalty Management</h1>
            <p className="text-gray-600 mt-1">Manage customers, loyalty tiers, and reward points</p>
          </div>
          <button
            onClick={() => openModal('create')}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Thêm khách hàng
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="text-blue-600" size={24} />
              </div>
              <span className="font-semibold text-gray-700">Tổng khách hàng</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="text-purple-600" size={24} />
              </div>
              <span className="font-semibold text-gray-700">Tổng điểm</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Avg: {Math.round(stats.avgPoints).toLocaleString()}</p>
          </div>

       
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <span className="font-semibold text-gray-700">Hoạt Động</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-sm text-gray-500 mt-1">Total registered</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <form onSubmit={handleSearch} className="flex-1 min-w-[300px] flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Search
              </button>
            </form>

            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Tiers</option>
              <option value="Bronze">🥉 Bronze</option>
              <option value="Silver">🥈 Silver</option>
              <option value="Gold">🥇 Gold</option>
              <option value="Platinum">💎 Platinum</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader className="animate-spin text-orange-600 mx-auto mb-4" size={40} />
                <p className="text-gray-600">Loading customers...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || tierFilter
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first customer'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Họ Và Tên</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Liên Hệ</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Hạng</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Điểm</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Trạng Thái</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const u = {
                        id: user.userId || user.UserId || user.Id || user.id,
                        fullName: user.fullName || user.FullName || user.userName || user.UserName,
                        email: user.email || user.Email,
                        phoneNumber: user.phoneNumber || user.PhoneNumber,
                        isActive: user.isActive !== undefined ? user.isActive : user.IsActive,
                        currentTier: user.currentTierName || user.CurrentTierName || user.currentTier || user.CurrentTier || 'Bronze',
                        currentPoints: user.currentPoints || user.CurrentPoints || 0
                      };

                      const tierBadge = getTierBadge(u.currentTier);
                      const initials = u.fullName
                        ? u.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                        : '?';

                      return (
                        <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="font-semibold text-orange-600">{initials}</span>
                              </div>
                              <span className="font-medium">{u.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={14} />
                                {u.email}
                              </div>
                              {u.phoneNumber && (
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                  <Phone size={14} />
                                  {u.phoneNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${tierBadge.color}`}>
                              <span className="text-lg">{tierBadge.icon}</span>
                              <span className="font-semibold">{u.currentTier}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Star className="text-yellow-500" size={16} />
                              <span className="font-semibold">{u.currentPoints.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStatus(u.id, u.isActive)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                u.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {u.isActive ? 'Không Hoạt Động' : 'Hoạt Động'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openLoyaltyModal(user)}
                                className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Loyalty Details"
                              >
                                <Award size={18} />
                              </button>
                              <button
                                onClick={() => openModal('edit', user)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Create New Customer' : 'Edit Customer'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {modalMode === 'create' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={modalMode === 'edit' ? 'Leave empty to keep current' : ''}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {Object.entries(UserRole).map(([key, value]) => (
                    <option key={value} value={value}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Account
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {modalMode === 'create' ? 'Create Customer' : 'Update Customer'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loyalty Modal */}
      {showLoyaltyModal && selectedUser && loyaltyInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <Award className="text-purple-600" size={28} />
                <div>
                  <h2 className="text-xl font-bold">Điểm hạng</h2>
                  <p className="text-sm text-gray-600">{loyaltyInfo.fullName}</p>
                </div>
              </div>
              <button onClick={closeLoyaltyModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {loading && !loyaltyInfo ? (
                <div className="flex justify-center items-center h-48">
                  <Loader className="animate-spin text-purple-600" size={40} />
                </div>
              ) : (
                <>
                  {/* Tier Info */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Hạng</p>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{getTierBadge(loyaltyInfo.currentTier).icon}</span>
                          <span className="text-3xl font-bold">{loyaltyInfo.currentTier}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {(loyaltyInfo.discountPercentage * 100).toFixed(0)}% Giảm giá vào Booking
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Tham gia từ </p>
                        <p className="text-lg font-semibold">{formatDate(loyaltyInfo.memberSince)}</p>
                      </div>
                    </div>

                    {loyaltyInfo.nextTier && loyaltyInfo.pointsToNextTier > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Đến {loyaltyInfo.nextTier}</span>
                          <span className="font-semibold">{loyaltyInfo.pointsToNextTier} điểm</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (loyaltyInfo.currentPoints / (loyaltyInfo.currentPoints + loyaltyInfo.pointsToNextTier)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="text-yellow-500" size={24} />
                        <span className="text-sm text-gray-600">Điểm hiện tại </span>
                      </div>
                      <p className="text-2xl font-bold">{loyaltyInfo.currentPoints.toLocaleString()}</p>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <ArrowUpCircle className="text-green-500" size={24} />
                        <span className="text-sm text-gray-600">Điểm kiếm được</span>
                      </div>
                      <p className="text-2xl font-bold">{loyaltyInfo.totalPointsEarned.toLocaleString()}</p>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <ArrowDownCircle className="text-red-500" size={24} />
                        <span className="text-sm text-gray-600">Điểm đổi</span>
                      </div>
                      <p className="text-2xl font-bold">{loyaltyInfo.totalPointsRedeemed.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-blue-500" size={24} />
                        <span className="text-sm text-gray-600">Tổng giao dịch</span>
                      </div>
                      <p className="text-2xl font-bold">{loyaltyInfo.totalTransactions}</p>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-orange-500" size={24} />
                        <span className="text-sm text-gray-600">Giao dịch gần nhất</span>
                      </div>
                      <p className="text-lg font-semibold">{formatDateTime(loyaltyInfo.lastTransactionAt)}</p>
                    </div>
                  </div>

                  {/* Points Adjustment Section */}
                  <div className="bg-white border rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-purple-600" size={20} />
                        <h3 className="text-lg font-bold">Cấu hình</h3>
                      </div>
                      <button
                        onClick={() => setShowPointsAdjustment(!showPointsAdjustment)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium"
                      >
                        {showPointsAdjustment ? 'Cancel' : 'Adjust Points'}
                      </button>
                    </div>

                    {showPointsAdjustment && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Cộng trừ điểm</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Điểm (Dương là cộng âm là trừ )
                            </label>
                            <input
                              type="number"
                              value={pointsAdjustment.points}
                              onChange={(e) => setPointsAdjustment({ ...pointsAdjustment, points: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="e.g., 100 or -50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Lý do  *</label>
                            <input
                              type="text"
                              value={pointsAdjustment.reason}
                              onChange={(e) => setPointsAdjustment({ ...pointsAdjustment, reason: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="e.g., Bonus reward, Correction"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handlePointsAdjustment}
                              disabled={loading}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
                            >
                              {loading ? (
                                <>
                                  <Loader className="animate-spin" size={16} />
                                  Processing...
                                </>
                              ) : (
                                'Apply Adjustment'
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowPointsAdjustment(false);
                                setPointsAdjustment({ points: '', reason: '' });
                              }}
                              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Points History */}
                  <div className="bg-white border rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <History className="text-gray-600" size={20} />
                      <h3 className="text-lg font-bold">Lịch sử điểm</h3>
                    </div>

                    {pointsHistory.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          {pointsHistory.map((item) => {
                            const transactionType = item.transactionType || item.TransactionType || item.type || item.Type;
                            const points = item.points || item.Points;
                            const description = item.description || item.Description;
                            const createdAt = item.createdAt || item.CreatedAt || item.date || item.Date;
                            const bookingCode = item.bookingCode || item.BookingCode;
                            
                            return (
                              <div key={item.id || item.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 flex-1">
                                  {points > 0 ? (
                                    <ArrowUpCircle className="text-green-500 flex-shrink-0" size={20} />
                                  ) : (
                                    <ArrowDownCircle className="text-red-500 flex-shrink-0" size={20} />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{description}</p>
                                    <div className="flex gap-3 text-sm text-gray-500 mt-1">
                                      <span>{formatDateTime(createdAt)}</span>
                                      {bookingCode && <span>• Booking: {bookingCode}</span>}
                                      <span>• Type: {transactionType}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-lg ${points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {points > 0 ? '+' : ''}{points}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {pointsHistoryPages > 1 && (
                          <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                              onClick={() => fetchPointsHistory(loyaltyInfo.userId, Math.max(1, pointsHistoryPage - 1))}
                              disabled={pointsHistoryPage === 1}
                              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm text-gray-600">
                              Page {pointsHistoryPage} of {pointsHistoryPages}
                            </span>
                            <button
                              onClick={() => fetchPointsHistory(loyaltyInfo.userId, Math.min(pointsHistoryPages, pointsHistoryPage + 1))}
                              disabled={pointsHistoryPage === pointsHistoryPages}
                              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History className="mx-auto mb-2" size={40} />
                        <p>No points history available</p>
                      </div>
                    )}
                  </div>

                  {/* Tier Benefits */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">All Membership Tiers</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tiers.map((tier) => {
                        const tierName = tier.name || tier.Name;
                        const tierBadge = getTierBadge(tierName);
                        const minSpending = tier.minSpending || tier.MinSpending || 0;
                        const discountPercentage = tier.discountPercentage || tier.DiscountPercentage || 0;
                        const benefits = tier.benefits || tier.Benefits || [];
                        
                        return (
                          <div
                            key={tierName}
                            className={`border-2 rounded-lg p-4 ${
                              tierName === loyaltyInfo.currentTier ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{tierBadge.icon}</span>
                              <span className="font-bold text-lg">{tierName}</span>
                              {tierName === loyaltyInfo.currentTier && (
                                <span className="ml-auto px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Minimum: {formatCurrency(minSpending)}
                            </p>
                            <p className="text-sm font-semibold text-purple-600 mb-3">
                              {(discountPercentage * 100).toFixed(0)}% discount
                            </p>
                            <div className="space-y-1">
                              {Array.isArray(benefits) && benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle size={14} className="text-green-500" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManagement;