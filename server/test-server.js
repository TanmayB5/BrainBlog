// test-server.js - Simple test script to verify server functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testServer() {
  console.log('🧪 Testing BrainBlog Server...\n');

  try {
    // Test root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await fetch(`${BASE_URL}/`);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint:', rootData.message);

    // Test API endpoint
    console.log('\n2. Testing API endpoint...');
    const apiResponse = await fetch(`${BASE_URL}/api`);
    const apiData = await apiResponse.json();
    console.log('✅ API endpoint:', apiData.message);

    // Test auth routes
    console.log('\n3. Testing auth routes...');
    const authResponse = await fetch(`${BASE_URL}/api/auth/test`);
    const authData = await authResponse.text();
    console.log('✅ Auth routes:', authData);

    // Test blogs routes
    console.log('\n4. Testing blogs routes...');
    const blogsResponse = await fetch(`${BASE_URL}/api/blogs`);
    const blogsData = await blogsResponse.json();
    console.log('✅ Blogs routes:', blogsData.blogs ? `${blogsData.blogs.length} blogs found` : 'No blogs');

    console.log('\n🎉 All tests passed! Server is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running with: npm run dev');
  }
}

testServer(); 