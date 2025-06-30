# AI Features Setup Guide (Hugging Face)

This guide will help you set up and troubleshoot the AI features in your blog project using Hugging Face API (free alternative to OpenAI).

## 🚀 Quick Setup

### 1. Get a Free Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up for a **free account** (no credit card required)
3. Go to your profile → Settings → Access Tokens
4. Click "New token"
5. Give it a name (e.g., "Blog AI Features")
6. Select "Read" role
7. Copy the generated token (it starts with `hf_`)

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# AI Configuration - REQUIRED FOR AI FEATURES
HUGGINGFACE_API_KEY=hf_your-actual-huggingface-api-key-here

# Optional: OpenAI fallback (if you have credits)
# OPENAI_API_KEY=sk-your-openai-api-key-here

# Database Configuration (if using Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Client URL
CLIENT_URL=http://localhost:5173
```

### 3. Test AI Functionality

Run the test script to verify everything is working:

```bash
cd server
npm run test-ai
```

You should see output like:
```
🤖 Testing AI functionality with Hugging Face...

🔑 Hugging Face API Key: ✅ Found
📝 Testing with sample content...

1️⃣ Testing Summary Generation...
✅ Summary: React is a popular JavaScript library for building user interfaces...

2️⃣ Testing SEO Content Generation...
✅ SEO Content: Meta Description: Learn React development...

3️⃣ Testing Tag Generation...
✅ Tags: react, javascript, frontend, web development, ui

🎉 All AI tests passed successfully!
✅ Your Hugging Face API key is working correctly
✅ AI features should work in your blog application

💡 Benefits of Hugging Face:
   - 30,000 free requests per month
   - No credit card required
   - Access to thousands of open-source models
```

## 🔧 Available AI Features

### 1. Generate Summary
- **What it does**: Creates a concise 2-3 sentence summary of your blog content
- **How to use**: Click "Generate Summary" in the blog editor
- **API Endpoint**: `POST /api/blogs/generate-summary`
- **Model**: `facebook/bart-large-cnn` (specialized for summarization)

### 2. Generate SEO Content
- **What it does**: Creates meta descriptions and SEO keywords
- **How to use**: Click "SEO Optimization" in the blog editor
- **API Endpoint**: `POST /api/blogs/generate-seo`
- **Model**: `microsoft/DialoGPT-medium`

### 3. Enhance Content
- **What it does**: Adds "Key Takeaways" and "Conclusion" sections
- **How to use**: Click "Enhance Content" in the blog editor
- **API Endpoint**: `POST /api/blogs/enhance-content`
- **Model**: `microsoft/DialoGPT-medium`

### 4. Generate Tags
- **What it does**: Suggests relevant tags for your blog post
- **How to use**: Click "Generate Tags" in the blog editor
- **API Endpoint**: `POST /api/blogs/generate-tags`
- **Model**: `microsoft/DialoGPT-medium`

## 🆓 Why Hugging Face?

### ✅ **Advantages:**
- **30,000 free requests per month** (vs OpenAI's limited free tier)
- **No credit card required** for signup
- **Access to thousands of open-source models**
- **No quota limits** like OpenAI
- **Community-driven** and open source

### ⚠️ **Considerations:**
- **Slightly slower** than OpenAI (models need to load)
- **Quality may vary** depending on the model
- **Less polished** than commercial APIs

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "AI service not available" Error

**Problem**: You see this error when trying to use AI features.

**Solutions**:
- Check if `HUGGINGFACE_API_KEY` is set in your `.env` file
- Verify the API key is valid and starts with `hf_`
- Restart your server after adding the environment variable

#### 2. "Model is loading" Error (503)

**Problem**: Hugging Face model is starting up.

**Solutions**:
- Wait 30-60 seconds and try again
- This is normal for the first request to a model
- Subsequent requests will be faster

#### 3. "Rate limit exceeded" Error (429)

**Problem**: Too many requests to Hugging Face API.

**Solutions**:
- Wait a few minutes before trying again
- Check your usage in Hugging Face dashboard
- 30,000 requests/month should be plenty for most users

#### 4. "Invalid API key" Error (401)

**Problem**: The API key is not valid.

**Solutions**:
- Generate a new API key from Hugging Face
- Make sure you copied the entire key (including `hf_`)
- Check for extra spaces or characters

#### 5. AI Features Not Working in Frontend

**Problem**: Frontend shows errors when calling AI features.

**Solutions**:
- Check browser console for error messages
- Verify the server is running on the correct port
- Ensure CORS is properly configured
- Check if you're authenticated (AI features require login)

### Debugging Steps

1. **Check Server Logs**:
   ```bash
   cd server
   npm run dev
   ```
   Look for error messages in the console.

2. **Test API Endpoints**:
   Use a tool like Postman or curl to test the endpoints directly:
   ```bash
   curl -X POST http://localhost:5000/api/blogs/generate-summary \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"content": "Test content for summary generation"}'
   ```

3. **Check Environment Variables**:
   ```bash
   cd server
   node -e "console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? 'Set' : 'Not set')"
   ```

4. **Verify Hugging Face Account**:
   - Check your Hugging Face dashboard for usage stats
   - Verify your API token is active
   - Check if you've exceeded any limits

## 💰 Cost Comparison

| Service | Free Tier | Paid Plans | Credit Card Required |
|---------|-----------|------------|---------------------|
| **Hugging Face** | 30,000 requests/month | Pay per use | ❌ No |
| OpenAI | $5 credit (3 months) | Pay per token | ✅ Yes |
| Cohere | 100 requests/month | Pay per use | ✅ Yes |
| Anthropic | Limited | Pay per use | ✅ Yes |

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Monitor API usage** regularly
5. **Use different API keys** for development and production

## 📝 API Reference

### Generate Summary
```javascript
POST /api/blogs/generate-summary
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "content": "Your blog content here..."
}

Response:
{
  "summary": "Generated summary text..."
}
```

### Generate SEO Content
```javascript
POST /api/blogs/generate-seo
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "title": "Blog title",
  "content": "Blog content..."
}

Response:
{
  "result": "Meta Description: ...\nSEO Keywords: ..."
}
```

### Enhance Content
```javascript
POST /api/blogs/enhance-content
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "content": "Original blog content..."
}

Response:
{
  "enhancedContent": "Enhanced content with takeaways and conclusion..."
}
```

### Generate Tags
```javascript
POST /api/blogs/generate-tags
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "title": "Blog title",
  "content": "Blog content...",
  "category": "Optional category"
}

Response:
{
  "tags": "tag1, tag2, tag3, tag4, tag5"
}
```

## 🆘 Getting Help

If you're still having issues:

1. Check the server logs for detailed error messages
2. Run the test script: `npm run test-ai`
3. Verify your Hugging Face account is active
4. Test with a simple prompt first
5. Check your internet connection

For additional support:
- [Hugging Face Documentation](https://huggingface.co/docs)
- [Hugging Face Community](https://huggingface.co/community)
- [API Status Page](https://status.huggingface.co/)

## 🔄 Fallback to OpenAI

If you prefer to use OpenAI (when you have credits), you can:

1. Add your `OPENAI_API_KEY` to the `.env` file
2. The system will automatically use OpenAI instead of Hugging Face
3. This provides a seamless fallback option

The system prioritizes Hugging Face for cost-effectiveness but falls back to OpenAI if available. 