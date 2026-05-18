require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

// Globally polyfill WebSocket for Node.js versions < 22
// This is the most robust fix for libraries expecting a global WebSocket
global.WebSocket = ws;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or Key is missing. Please check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

module.exports = supabase;
