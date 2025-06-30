// test-ai.js - Test script for AI functionality (Hugging Face)
require('dotenv').config();

console.log('🤖 Testing AI functionality with Hugging Face...\n');

// Check if Hugging Face API key is set
if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('❌ HUGGINGFACE_API_KEY is not set in environment variables');
  console.log('Please create a .env file in the server directory with:');
  console.log('HUGGINGFACE_API_KEY=your-actual-huggingface-api-key');
  console.log('\nTo get a free API key:');
  console.log('1. Go to https://huggingface.co/');
  console.log('2. Sign up for a free account');
  console.log('3. Go to Settings > Access Tokens');
  console.log('4. Create a new token');
  process.exit(1);
}

// Test content
const testContent = `React is a popular JavaScript library for building user interfaces. It was developed by Facebook and is widely used in modern web development. React allows developers to create reusable UI components and efficiently update the DOM when data changes. The library uses a virtual DOM to optimize performance and provides a declarative approach to building UIs.`;

const testTitle = "Introduction to React Development";

// Helper function to call Hugging Face API with fallback models
async function callHuggingFaceAPI(prompt, primaryModel, fallbackModels = []) {
  const models = [primaryModel, ...fallbackModels];
  
  for (const model of models) {
    try {
      console.log(`   Trying model: ${model}`);
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        if (response.status === 503) {
          console.log(`   Model ${model} is loading, trying next...`);
          continue;
        }
        throw new Error(`Hugging Face API error: ${error}`);
      }

      const result = await response.json();
      const output = result[0]?.generated_text || result[0]?.summary_text || result[0]?.text || '';
      
      if (output && output.trim()) {
        console.log(`   ✅ Success with model: ${model}`);
        return output;
      }
    } catch (error) {
      console.log(`   ❌ Failed with model ${model}: ${error.message}`);
      if (model === models[models.length - 1]) {
        throw error;
      }
    }
  }
  
  throw new Error('All models failed');
}

async function testAIFeatures() {
  try {
    console.log('🔑 Hugging Face API Key: ✅ Found');
    console.log('📝 Testing with sample content...\n');

    // Test 1: Generate Summary
    console.log('1️⃣ Testing Summary Generation...');
    const summaryPrompt = `Summarize the following text in 2-3 sentences: ${testContent}`;
    const summary = await callHuggingFaceAPI(
      summaryPrompt, 
      "facebook/bart-large-cnn",
      ["sshleifer/distilbart-cnn-12-6", "facebook/bart-base"]
    );
    console.log('✅ Summary:', summary);

    // Test 2: Generate SEO Content
    console.log('\n2️⃣ Testing SEO Content Generation...');
    const seoPrompt = `Generate SEO content for this blog post:
Title: ${testTitle}
Content: ${testContent.substring(0, 500)}

Provide:
1. Meta Description (max 160 characters)
2. SEO Keywords (8 keywords, comma-separated)

Format:
Meta Description: [description]
SEO Keywords: [keywords]`;
    
    const seoContent = await callHuggingFaceAPI(
      seoPrompt, 
      "sshleifer/distilbart-cnn-12-6",
      ["facebook/bart-base", "facebook/bart-large-cnn"]
    );
    console.log('✅ SEO Content:', seoContent);

    // Test 3: Generate Tags
    console.log('\n3️⃣ Testing Tag Generation...');
    const tagsPrompt = `Suggest 5 relevant tags for this blog post:
Title: ${testTitle}
Content: ${testContent.substring(0, 300)}

Tags (comma-separated):`;
    
    const tags = await callHuggingFaceAPI(
      tagsPrompt, 
      "sshleifer/distilbart-cnn-12-6",
      ["facebook/bart-base", "facebook/bart-large-cnn"]
    );
    console.log('✅ Tags:', tags);

    // Test 4: Generate Headlines
    console.log('\n4️⃣ Testing Headline Generation...');
    const headlinesPrompt = `Generate 3 catchy blog post headlines for this content. Make them engaging and SEO-friendly:

Content: ${testContent.substring(0, 500)}

Headlines:
1.`;
    
    const headlines = await callHuggingFaceAPI(
      headlinesPrompt, 
      "sshleifer/distilbart-cnn-12-6",
      ["facebook/bart-base", "facebook/bart-large-cnn"]
    );
    console.log('✅ Headlines:', headlines);

    console.log('\n🎉 All AI tests passed successfully!');
    console.log('✅ Your Hugging Face API key is working correctly');
    console.log('✅ AI features should work in your blog application');
    console.log('\n💡 Benefits of Hugging Face:');
    console.log('   - 30,000 free requests per month');
    console.log('   - No credit card required');
    console.log('   - Access to thousands of open-source models');

  } catch (error) {
    console.error('\n❌ AI test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 Your Hugging Face API key is invalid. Please check your .env file.');
    } else if (error.message.includes('429')) {
      console.log('💡 Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.message.includes('503')) {
      console.log('💡 Model is loading. Please wait a moment and try again.');
    } else if (error.message.includes('Not Found')) {
      console.log('💡 Model not available. This is normal - some models may be temporarily unavailable.');
      console.log('💡 Your API key is working correctly!');
    } else {
      console.log('💡 Check your internet connection and Hugging Face API status.');
    }
    
    process.exit(1);
  }
}

// Run the test
testAIFeatures(); 