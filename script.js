import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔗 Ye dono values apne Supabase ke Project API se lo
const supabaseUrl = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

// ✅ Supabase se connection banana
const supabase = createClient(supabaseUrl, supabaseKey);

// 📚 Database se books fetch karne ka function
async function loadBooks() {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("❌ Error loading books:", error);
    return;
  }
  console.log("✅ Books from database:", data);
}

// 🔄 Function ko call karna
loadBooks();
// Initialize Supabase connection
const SUPABASE_URL = 'https://rlqjfsaqnfsxjvelzzci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Example: Fetch books from your Supabase table
async function loadBooks() {
  const { data, error } = await supabaseClient
    .from('books')
    .select('*');

  if (error) {
    console.error('Error fetching books:', error);
    return;
  }

  console.log('Books:', data);

  // Yahan aap website pe books dikhane ka code likh sakte ho
  const container = document.getElementById('books-container');
  if (container) {
    container.innerHTML = data.map(
      (book) => `<div><h3>${book.title}</h3><p>${book.author}</p></div>`
    ).join('');
  }
}

// Page load hone pe books laao
document.addEventListener('DOMContentLoaded', loadBooks);
