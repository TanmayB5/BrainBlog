const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set!');
      console.log('Current directory:', __dirname);
      console.log('Looking for .env file in:', path.join(__dirname, '.env'));
      return;
    }
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test successful:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Available tables:', tables);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 This looks like a password issue. Check your DATABASE_URL password.');
    } else if (error.message.includes("Can't reach database server")) {
      console.log('\n💡 This looks like a network issue. Check if:');
      console.log('   - Your Supabase database is active (not paused)');
      console.log('   - The connection string is correct');
      console.log('   - The database URL is accessible from Render');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 