// ✅ Supabase connection setup (single import)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔗 Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

// ✅ Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 📚 Function: Fetch books from Supabase
async function loadBooks() {
  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("❌ Error fetching books:", error);
    return;
  }

  console.log("✅ Books fetched:", data);

  // Agar HTML me koi container hai jaha dikhana hai:
  const container = document.getElementById("books-container");
  if (container) {
    container.innerHTML = data
      .map(
        (book) => `
        <div class="book-card">
          <h3>${book.title}</h3>
          <p>${book.author || "Unknown Author"}</p>
          <p>₹${book.price || "N/A"}</p>
        </div>
      `
      )
      .join("");
  }
}

// 🚀 Load books when page loads
document.addEventListener("DOMContentLoaded", loadBooks);
