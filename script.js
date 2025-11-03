// ✅ Import Supabase client from CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase configuration
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadBooks() {
  const container = document.getElementById("books-container");
  container.innerHTML = "<p>Loading books...</p>";

  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Supabase Error:", error);
    container.innerHTML = "<p style='color:red;'>Error loading books.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="book-card">
        <img src="https://via.placeholder.com/220x250" alt="Demo Book" />
        <h3>Concepts of Physics Part 1</h3>
        <p>Author: H.C. Verma</p>
        <p>Price: ₹250</p>
      </div>
      <div class="book-card">
        <img src="https://via.placeholder.com/220x250" alt="Demo Book" />
        <h3>Chemistry Part 1</h3>
        <p>Author: NCERT</p>
        <p>Price: ₹150</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data
    .map(
      (book) => `
        <div class="book-card">
          <img src="${book.image_url || "https://via.placeholder.com/220x250"}" alt="${book.title}" />
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Price: ₹${book.price}</p>
        </div>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", loadBooks);
