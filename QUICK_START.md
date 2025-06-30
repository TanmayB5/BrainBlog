# 🚀 Quick Start: AI Features Setup

## ⚡ 5-Minute Setup

### 1. Get Free Hugging Face API Key
1. Go to [huggingface.co](https://huggingface.co/)
2. Sign up for free account (no credit card)
3. Go to Settings → Access Tokens
4. Create new token (starts with `hf_`)

### 2. Run Setup Script
```bash
cd server
npm run setup-ai
```
Follow the prompts and paste your API key.

### 3. Test & Use
```bash
npm run test-ai  # Test configuration
npm run dev      # Start server
```

## 🎯 What You Get

✅ **30,000 free AI requests per month**  
✅ **No credit card required**  
✅ **4 AI features**: Summary, SEO, Content Enhancement, Tags  
✅ **Automatic fallback** to OpenAI if you have credits  

## 🔧 AI Features

| Feature | What it does | Model |
|---------|-------------|-------|
| **Generate Summary** | Creates 2-3 sentence summary | `facebook/bart-large-cnn` |
| **Generate SEO** | Meta description + keywords | `microsoft/DialoGPT-medium` |
| **Enhance Content** | Adds takeaways + conclusion | `microsoft/DialoGPT-medium` |
| **Generate Tags** | Suggests relevant tags | `microsoft/DialoGPT-medium` |

## 💡 Usage

1. **Create/Edit a blog post**
2. **Click AI buttons** in the editor
3. **AI generates content** automatically
4. **Review and edit** as needed

## 🆘 Troubleshooting

- **"Model is loading"**: Wait 30-60 seconds, try again
- **"Invalid API key"**: Check your `hf_` key in `.env`
- **"Rate limit"**: You have 30,000 requests/month, should be plenty

## 📚 More Info

- Full guide: `AI_SETUP.md`
- Test anytime: `npm run test-ai`
- Status check: Use `AIStatusCheck` component in frontend

---

**That's it!** Your AI features are ready to use. 🎉 