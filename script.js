// ✅ Import Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase configuration
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Load all books
async function loadBooks() {
  const container = document.getElementById("books-container");
  container.innerHTML = "<p>Loading books...</p>";

  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("❌ Supabase Error:", error);
    container.innerHTML = "<p style='color:red;'>Error loading books.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No books available.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (book) => `
      <div class="book-card">
        <img src="${book.image_url || "https://via.placeholder.com/220x250"}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author || "Unknown"}</p>
        <p><strong>Price:</strong> ₹${book.price || "N/A"}</p>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", loadBooks);
