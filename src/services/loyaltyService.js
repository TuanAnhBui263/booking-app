import { apiRequest } from './api';

export const loyaltyService = {
  // User endpoints
  getMyLoyaltyInfo: async () => {
    return await apiRequest('/Loyalty/my-loyalty');
  },

  getMyPointsHistory: async (page = 1, pageSize = 20) => {
    return await apiRequest(`/Loyalty/my-history?page=${page}&pageSize=${pageSize}`);
  },

  calculateDiscount: async (totalAmount) => {
    return await apiRequest('/Loyalty/calculate-discount', {
      method: 'POST',
      body: JSON.stringify({ totalAmount }),
    });
  },

  previewPointsRedemption: async (bookingAmount, pointsToRedeem) => {
    return await apiRequest('/Loyalty/preview-redeem', {
      method: 'POST',
      body: JSON.stringify({
        bookingAmount,
        pointsToRedeem,
      }),
    });
  },

  getMemberTiers: async () => {
    return await apiRequest('/Loyalty/tiers');
  },

  // Admin endpoints
  getAdminLoyaltyOverview: async (page = 1, pageSize = 20, searchTerm = null, tierFilter = null) => {
    let url = `/admin/LoyaltyAdmin/overview?page=${page}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    if (tierFilter) url += `&tierFilter=${encodeURIComponent(tierFilter)}`;
    return await apiRequest(url);
  },

  getAdminUserLoyaltyDetail: async (userId) => {
    return await apiRequest(`/admin/LoyaltyAdmin/user/${userId}`);
  },

  getAdminUserPointsHistory: async (userId, page = 1, pageSize = 20) => {
    return await apiRequest(`/admin/LoyaltyAdmin/user/${userId}/history?page=${page}&pageSize=${pageSize}`);
  },

  getAdminAllPointsHistory: async (page = 1, pageSize = 20, transactionType = null, fromDate = null, toDate = null) => {
    let url = `/admin/LoyaltyAdmin/all-history?page=${page}&pageSize=${pageSize}`;
    if (transactionType) url += `&transactionType=${encodeURIComponent(transactionType)}`;
    if (fromDate) url += `&fromDate=${encodeURIComponent(fromDate)}`;
    if (toDate) url += `&toDate=${encodeURIComponent(toDate)}`;
    return await apiRequest(url);
  },

  adminAdjustPoints: async (userId, points, reason) => {
    return await apiRequest('/admin/LoyaltyAdmin/adjust-points', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        points,
        reason,
      }),
    });
  },
};