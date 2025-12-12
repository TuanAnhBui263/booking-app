import { apiRequest } from './api';

export const loyaltyService = {
  getMyLoyaltyInfo: async () => {
    return await apiRequest('/Loyalty/my-loyalty');
  },

  getMyPointsHistory: async (page = 1, pageSize = 20) => {
    return await apiRequest(`/Loyalty/my-history?page=${page}&pageSize=${pageSize}`);
  },

  // Calculate discount preview for a booking
  calculateDiscount: async (totalAmount) => {
    return await apiRequest('/Loyalty/calculate-discount', {
      method: 'POST',
      body: JSON.stringify({ totalAmount }),
    });
  },

  // Preview points redemption
  previewPointsRedemption: async (bookingAmount, pointsToRedeem) => {
    return await apiRequest('/Loyalty/preview-redeem', {
      method: 'POST',
      body: JSON.stringify({
        bookingAmount,
        pointsToRedeem,
      }),
    });
  },

  // Get all member tier information
  getMemberTiers: async () => {
    return await apiRequest('/Loyalty/tiers');
  },
};