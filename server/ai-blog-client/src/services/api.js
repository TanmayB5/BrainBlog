const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  }
};

export const blogAPI = {
  getBlogs: async (queryParams = '') => {
    const response = await fetch(`${API_BASE_URL}/blogs${queryParams}`);
    return handleResponse(response);
  },

  getBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    return handleResponse(response);
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
  }
};
