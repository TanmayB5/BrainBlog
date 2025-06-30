const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug environment variables
console.log('Environment Variables Debug:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('All env vars:', import.meta.env);

export { API_BASE_URL };

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { getAuthHeaders };

const handleResponse = async (response) => {
  console.log(`API Response: ${response.status} ${response.statusText}`, response.url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    console.error('API Error:', error);
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const authAPI = {
  login: async (credentials) => {
    const url = `${API_BASE_URL}/auth/login`;
    console.log('Login request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    const url = `${API_BASE_URL}/auth/register`;
    console.log('Register request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    const url = `${API_BASE_URL}/auth/profile`;
    console.log('Get profile request to:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};

export const blogAPI = {
  getBlogs: async (queryParams = '') => {
    const url = `${API_BASE_URL}/blogs${queryParams}`;
    console.log('Fetching blogs from:', url);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    try {
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('getBlogs error:', error);
      throw error;
    }
  },

  getBlog: async (id) => {
    const url = `${API_BASE_URL}/blogs/${id}`;
    console.log('Fetching blog from:', url);
    
    try {
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('getBlog error:', error);
      throw error;
    }
  },

  createBlog: async (blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(blogData),
    });
    return handleResponse(response);
  },

  updateBlog: async (id, blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(blogData),
    });
    return handleResponse(response);
  },

  deleteBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  getUserBlogs: async () => {
    const response = await fetch(`${API_BASE_URL}/blogs/my`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  incrementView: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/view`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  incrementLike: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  }
};
