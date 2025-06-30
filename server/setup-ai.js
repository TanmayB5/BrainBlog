#!/usr/bin/env node

// setup-ai.js - Quick setup script for AI features
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 AI Features Setup for BrainBlog\n');
console.log('This script will help you set up AI features using Hugging Face (free alternative to OpenAI).\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupAI() {
  try {
    // Check if .env file exists
    const envPath = path.join(__dirname, '.env');
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('HUGGINGFACE_API_KEY=')) {
        console.log('✅ Hugging Face API key already configured in .env file');
        const useExisting = await askQuestion('Do you want to update it? (y/n): ');
        if (useExisting.toLowerCase() !== 'y') {
          console.log('Setup completed! Run "npm run test-ai" to test your configuration.');
          rl.close();
          return;
        }
      }
    }

    console.log('📋 To get your free Hugging Face API key:');
    console.log('1. Go to https://huggingface.co/');
    console.log('2. Sign up for a free account (no credit card required)');
    console.log('3. Go to your profile → Settings → Access Tokens');
    console.log('4. Click "New token"');
    console.log('5. Give it a name (e.g., "Blog AI Features")');
    console.log('6. Select "Read" role');
    console.log('7. Copy the generated token (starts with "hf_")\n');

    const apiKey = await askQuestion('Enter your Hugging Face API key (starts with hf_): ');
    
    if (!apiKey.startsWith('hf_')) {
      console.log('❌ Invalid API key format. Hugging Face API keys start with "hf_"');
      rl.close();
      return;
    }

    // Create or update .env file
    let envContent = '';
    if (envExists) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace existing HUGGINGFACE_API_KEY if it exists
      if (envContent.includes('HUGGINGFACE_API_KEY=')) {
        envContent = envContent.replace(
          /HUGGINGFACE_API_KEY=.*/,
          `HUGGINGFACE_API_KEY=${apiKey}`
        );
      } else {
        // Add HUGGINGFACE_API_KEY if it doesn't exist
        envContent += `\n# AI Configuration - REQUIRED FOR AI FEATURES\nHUGGINGFACE_API_KEY=${apiKey}\n`;
      }
    } else {
      // Create new .env file
      envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# AI Configuration - REQUIRED FOR AI FEATURES
HUGGINGFACE_API_KEY=${apiKey}

# Optional: OpenAI fallback (if you have credits)
# OPENAI_API_KEY=sk-your-openai-api-key-here

# Database Configuration (if using Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Client URL
CLIENT_URL=http://localhost:5173
`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!');

    // Test the configuration
    console.log('\n🧪 Testing your configuration...');
    
    // Set the environment variable for testing
    process.env.HUGGINGFACE_API_KEY = apiKey;
    
    // Import and run the test
    try {
      require('./test-ai.js');
    } catch (error) {
      console.log('⚠️  Test failed, but configuration is saved. You can run "npm run test-ai" later.');
    }

    console.log('\n🎉 Setup completed!');
    console.log('✅ Your AI features are now configured with Hugging Face');
    console.log('✅ You get 30,000 free requests per month');
    console.log('✅ No credit card required');
    
    console.log('\n📝 Next steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Test AI features in your blog editor');
    console.log('3. Run "npm run test-ai" anytime to verify configuration');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupAI(); 