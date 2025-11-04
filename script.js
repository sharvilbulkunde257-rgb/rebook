// ✅ Import Supabase client from CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Smooth scroll helper
window.scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
};

// ✅ Load available books
async function loadBooks() {
  const container = document.getElementById("books-container");
  container.innerHTML = "<p>Loading books...</p>";

  const { data, error } = await supabase.from("books").select("*").order("id", { ascending: false });

  if (error) {
    container.innerHTML = "<p style='color:red;'>⚠️ Error loading books.</p>";
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No books available yet. Be the first to sell one!</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (book) => `
      <div class="book-card">
        <img src="${book.image_url}" alt="${book.title}" />
        <div class="book-info">
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Condition: ${book.condition}</p>
          <p><strong>₹${book.price}</strong></p>
        </div>
      </div>
    `
    )
    .join("");
}

loadBooks();

// ✅ Handle Sell Book form
const form = document.getElementById("sell-form");
const message = document.getElementById("message");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = document.getElementById("price").value.trim();
    const condition = document.getElementById("condition").value.trim();
    const image_url = document.getElementById("image_url").value.trim();

    if (!title || !author || !price || !condition || !image_url) {
      message.textContent = "❌ Please fill all fields!";
      message.style.color = "red";
      return;
    }

    const { error } = await supabase.from("books").insert([
      { title, author, price, condition, image_url },
    ]);

    if (error) {
      console.error(error);
      message.textContent = "⚠️ Error uploading book!";
      message.style.color = "red";
    } else {
      message.textContent = "✅ Book uploaded successfully!";
      message.style.color = "green";
      form.reset();
      loadBooks();
    }
  });
}
