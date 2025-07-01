// SEO Utility Functions for Dynamic Meta Tag Management

/**
 * Update the page title
 * @param {string} title - The new page title
 */
export const updatePageTitle = (title) => {
  document.title = title;
};

/**
 * Update meta description
 * @param {string} description - The meta description
 */
export const updateMetaDescription = (description) => {
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = description;
};

/**
 * Update meta keywords
 * @param {string} keywords - Comma-separated keywords
 */
export const updateMetaKeywords = (keywords) => {
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.content = keywords;
};

/**
 * Update Open Graph tags for social media sharing
 * @param {Object} ogData - Open Graph data
 */
export const updateOpenGraphTags = (ogData) => {
  const { title, description, image, url, type = 'article' } = ogData;
  
  // Update or create Open Graph tags
  const ogTags = {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type
  };
  
  Object.entries(ogTags).forEach(([property, content]) => {
    if (content) {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    }
  });
};

/**
 * Update Twitter Card tags
 * @param {Object} twitterData - Twitter Card data
 */
export const updateTwitterTags = (twitterData) => {
  const { title, description, image, card = 'summary_large_image' } = twitterData;
  
  const twitterTags = {
    'twitter:card': card,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image
  };
  
  Object.entries(twitterTags).forEach(([name, content]) => {
    if (content) {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    }
  });
};

/**
 * Comprehensive SEO update for blog posts
 * @param {Object} blogData - Blog post data
 */
export const updateBlogSEO = (blogData) => {
  const {
    title,
    summary,
    metaDescription,
    seoKeywords,
    content,
    author,
    category,
    tags = []
  } = blogData;
  
  // Update page title
  const pageTitle = `${title} | BrainBlog`;
  updatePageTitle(pageTitle);
  
  // Update meta description (use AI-generated or fallback to summary)
  const description = metaDescription || summary || content.substring(0, 160) + '...';
  updateMetaDescription(description);
  
  // Update keywords (combine AI-generated keywords with tags)
  const allKeywords = [
    seoKeywords,
    ...tags,
    category,
    'blog',
    'article',
    'BrainBlog'
  ].filter(Boolean).join(', ');
  updateMetaKeywords(allKeywords);
  
  // Update Open Graph tags
  updateOpenGraphTags({
    title: pageTitle,
    description,
    url: window.location.href,
    type: 'article'
  });
  
  // Update Twitter tags
  updateTwitterTags({
    title: pageTitle,
    description
  });
  
  // Add structured data for rich snippets
  addStructuredData(blogData);
};

/**
 * Add structured data for rich snippets in search results
 * @param {Object} blogData - Blog post data
 */
export const addStructuredData = (blogData) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogData.title,
    "description": blogData.metaDescription || blogData.summary,
    "author": {
      "@type": "Person",
      "name": blogData.author?.name || "BrainBlog Author"
    },
    "datePublished": blogData.createdAt,
    "dateModified": blogData.updatedAt || blogData.createdAt,
    "publisher": {
      "@type": "Organization",
      "name": "BrainBlog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://brainblog.onrender.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "keywords": blogData.seoKeywords,
    "articleSection": blogData.category,
    "wordCount": blogData.content?.split(' ').length || 0
  };
  
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

/**
 * Reset SEO to default values
 */
export const resetSEO = () => {
  updatePageTitle('BrainBlog - AI-Powered Blogging Platform');
  updateMetaDescription('Create, optimize, and publish amazing blogs with AI assistance. BrainBlog offers smart content generation, SEO optimization, and instant publishing tools for modern creators.');
  updateMetaKeywords('AI blogging, content creation, blog writing, AI content, smart blogging, SEO optimization, content marketing, AI writing assistant, blog platform, automated blogging');
  
  // Reset Open Graph
  updateOpenGraphTags({
    title: 'BrainBlog - AI-Powered Blogging Platform',
    description: 'Create, optimize, and publish amazing blogs with AI assistance. Smart content generation and SEO optimization for modern creators.',
    url: 'https://brainblog.onrender.com/',
    type: 'website'
  });
  
  // Reset Twitter
  updateTwitterTags({
    title: 'BrainBlog - AI-Powered Blogging Platform',
    description: 'Create, optimize, and publish amazing blogs with AI assistance. Smart content generation and SEO optimization for modern creators.'
  });
}; 