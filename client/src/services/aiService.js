import { API_BASE_URL } from './api';
import { getAuthHeaders } from './api';

export const aiService = {
  generateSummary: async (content) => {
    const response = await fetch(`${API_BASE_URL}/blogs/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to generate summary');
    return data.summary;
  },



  generateSEOContent: async (title, content) => {
    const response = await fetch(`${API_BASE_URL}/blogs/generate-seo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to generate SEO content');
    return data.result;
  },

  enhanceContent: async (content) => {
    const response = await fetch(`${API_BASE_URL}/blogs/enhance-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to enhance content');
    return { enhancedContent: data.enhancedContent };
  },

  generateTags: async (title, content, category) => {
    const response = await fetch(`${API_BASE_URL}/blogs/generate-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ title, content, category }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to generate tags');
    return { tags: data.tags };
  }
};
