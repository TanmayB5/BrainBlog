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
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const metaDescription = `Discover ${title.toLowerCase()} and learn more about this fascinating topic. Read our comprehensive guide with expert insights and practical tips.`;
      
      const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
      const contentWords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
      const topWords = [...new Set([...titleWords, ...contentWords.slice(0, 10)])];
      const seoKeywords = topWords.slice(0, 8).join(', ') + ', blog, guide, tips';
      
      return {
        metaDescription: metaDescription.substring(0, 160),
        seoKeywords
      };
    } catch (error) {
      throw new Error('Failed to generate SEO content');
    }
  },

  enhanceContent: async (content) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const enhancedContent = content + 
        "\n\n## Key Takeaways\n\n" +
        "- This article provides comprehensive insights into the topic\n" +
        "- Practical applications and real-world examples are included\n" +
        "- Further reading and resources are recommended for deeper understanding\n\n" +
        "## Conclusion\n\n" +
        "This comprehensive guide covers the essential aspects of the topic, providing readers with valuable insights and practical knowledge to apply in their own context.";
      
      return { enhancedContent };
    } catch (error) {
      throw new Error('Failed to enhance content');
    }
  },

  generateTags: async (title, content, category) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const words = (title + ' ' + content).toLowerCase();
      const commonTags = ['technology', 'tutorial', 'guide', 'tips', 'development', 'programming', 'web', 'design', 'business', 'productivity'];
      const relevantTags = commonTags.filter(tag => words.includes(tag));
      
      if (category && !relevantTags.includes(category.toLowerCase())) {
        relevantTags.unshift(category.toLowerCase());
      }
      
      return { tags: relevantTags.slice(0, 5) };
    } catch (error) {
      throw new Error('Failed to generate tags');
    }
  }
};
