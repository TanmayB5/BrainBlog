const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if required environment variables are set
if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL is not set in environment variables');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY is not set in environment variables');
  process.exit(1);
}

console.log('✅ Supabase configuration loaded successfully');
console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseAnonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase; 