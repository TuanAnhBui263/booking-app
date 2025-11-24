import { apiRequest } from './api';

export const userService = {
  // Get all users (Admin only)
  getAllUsers: async (page = 1, pageSize = 10, role = null, isActive = null) => {
    let url = `/Users?page=${page}&pageSize=${pageSize}`;
    if (role !== null && role !== '') url += `&role=${role}`;
    if (isActive !== null) url += `&isActive=${isActive}`;
    
    console.log('Fetching users from:', url);
    const response = await apiRequest(url);
    console.log('Users response:', response);
    return response;
  },

  // Get user by ID
  getUserById: async (id) => {
    console.log('Fetching user by ID:', id);
    const response = await apiRequest(`/Users/${id}`);
    console.log('User by ID response:', response);
    return response;
  },

  // Get user by email (Admin only)
  getUserByEmail: async (email) => {
    console.log('Fetching user by email:', email);
    const response = await apiRequest(`/Users/email/${encodeURIComponent(email)}`);
    console.log('User by email response:', response);
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    console.log('Fetching current user');
    const response = await apiRequest('/Users/me');
    console.log('Current user response:', response);
    return response;
  },

  // Create user (Admin only)
  createUser: async (userData) => {
    // Convert camelCase to PascalCase for C# API
    const apiData = {
      FullName: userData.fullName || userData.FullName,
      Email: userData.email || userData.Email,
      PhoneNumber: userData.phoneNumber || userData.PhoneNumber,
      Password: userData.password || userData.Password,
      Role: String(userData.role !== undefined ? userData.role : userData.Role !== undefined ? userData.Role : 4),
      IsActive: userData.isActive !== undefined ? userData.isActive : userData.IsActive !== undefined ? userData.IsActive : true,
      Address: userData.address || userData.Address || '',
      DateOfBirth: userData.dateOfBirth || userData.DateOfBirth || '',
      Nationality: userData.nationality || userData.Nationality || ''
    };

    // Format date if provided
    if (apiData.DateOfBirth && apiData.DateOfBirth !== '') {
      try {
        apiData.DateOfBirth = new Date(apiData.DateOfBirth).toISOString();
      } catch (e) {
        console.warn('Invalid date format:', apiData.DateOfBirth);
        apiData.DateOfBirth = '';
      }
    }

    console.log('Creating user with data:', apiData);
    
    const response = await apiRequest('/Users', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
    
    console.log('Create user response:', response);
    return response;
  },

  // Update user
  updateUser: async (id, userData) => {
    // Convert camelCase to PascalCase for C# API
    const apiData = {
      FullName: userData.fullName || userData.FullName,
      Email: userData.email || userData.Email,
      PhoneNumber: userData.phoneNumber || userData.PhoneNumber,
      Role: String(userData.role !== undefined ? userData.role : userData.Role !== undefined ? userData.Role : 4),
      IsActive: userData.isActive !== undefined ? userData.isActive : userData.IsActive !== undefined ? userData.IsActive : true,
      Address: userData.address || userData.Address || '',
      DateOfBirth: userData.dateOfBirth || userData.DateOfBirth || '',
      Nationality: userData.nationality || userData.Nationality || ''
    };

    // Only include password if provided
    if (userData.password || userData.Password) {
      apiData.Password = userData.password || userData.Password;
    }

    // Format date if provided
    if (apiData.DateOfBirth && apiData.DateOfBirth !== '') {
      try {
        apiData.DateOfBirth = new Date(apiData.DateOfBirth).toISOString();
      } catch (e) {
        console.warn('Invalid date format:', apiData.DateOfBirth);
        apiData.DateOfBirth = '';
      }
    }

    console.log('Updating user', id, 'with data:', apiData);
    
    const response = await apiRequest(`/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });
    
    console.log('Update user response:', response);
    return response;
  },

  // Change password
  changePassword: async (id, passwordData) => {
    const apiData = {
      CurrentPassword: passwordData.currentPassword || passwordData.CurrentPassword,
      NewPassword: passwordData.newPassword || passwordData.NewPassword,
      ConfirmPassword: passwordData.confirmPassword || passwordData.ConfirmPassword
    };

    console.log('Changing password for user:', id);
    
    const response = await apiRequest(`/Users/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
    
    console.log('Change password response:', response);
    return response;
  },

  // Update user status (Admin only)
  updateUserStatus: async (id, statusData) => {
    const apiData = {
      IsActive: statusData.isActive !== undefined ? statusData.isActive : statusData.IsActive
    };

    console.log('Updating user status for', id, ':', apiData);
    
    const response = await apiRequest(`/Users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(apiData),
    });
    
    console.log('Update status response:', response);
    return response;
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    console.log('Deleting user:', id);
    
    const response = await apiRequest(`/Users/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete user response:', response);
    return response;
  },
};