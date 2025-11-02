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
