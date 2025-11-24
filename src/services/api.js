// API Configuration
const API_BASE_URL = 'https://localhost:7195/api';

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set tokens
export const setTokens = (accessToken, refreshToken = null) => {
  localStorage.setItem('token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Clear tokens
export const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Main API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  console.log('API Request:', {
    method: config.method || 'GET',
    url,
    hasToken: !!token,
    body: options.body ? JSON.parse(options.body) : null
  });

  try {
    const response = await fetch(url, config);

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      clearTokens();
      
      // Don't redirect on login endpoint
      if (!endpoint.includes('/Auth/login')) {
        window.location.href = '/login';
      }
      
      throw new Error('Unauthorized - Please login again');
    }

    // Handle 403 Forbidden - insufficient permissions
    if (response.status === 403) {
      throw new Error('Access denied - Insufficient permissions');
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log('API Response Data:', data);

    // Handle error responses
    if (!response.ok) {
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      // Extract error message from various possible formats
      let errorMessage = `HTTP error! status: ${response.status}`;
      let validationErrors = null;

      if (data) {
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message || data.Message) {
          errorMessage = data.message || data.Message;
        } else if (data.title) {
          errorMessage = data.title;
          
          // Check for validation errors (ASP.NET format)
          if (data.errors) {
            validationErrors = data.errors;
            const errorMessages = [];
            Object.keys(data.errors).forEach(key => {
              const messages = Array.isArray(data.errors[key]) 
                ? data.errors[key] 
                : [data.errors[key]];
              errorMessages.push(`${key}: ${messages.join(', ')}`);
            });
            errorMessage += '\n' + errorMessages.join('\n');
          }
        } else if (data.error || data.Error) {
          errorMessage = data.error || data.Error;
        }
      }

      // Create enhanced error object
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data,
        validationErrors: validationErrors
      };
      
      throw error;
    }

    return data;
  } catch (error) {
    // If it's already our custom error, rethrow it
    if (error.response) {
      throw error;
    }

    // Handle network errors
    console.error('Network/Fetch Error:', error);
    
    const networkError = new Error(
      error.message || 'Network error - Please check your connection'
    );
    networkError.response = {
      status: 0,
      data: null
    };
    
    throw networkError;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Helper function to check user role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRole = user.role || user.Role;
  
  // Handle both string and number roles
  if (typeof requiredRole === 'string') {
    return userRole === requiredRole;
  }
  
  return userRole === requiredRole;
};

// Helper function to check multiple roles
export const hasAnyRole = (roles = []) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRole = user.role || user.Role;
  return roles.includes(userRole);
};

export default apiRequest;