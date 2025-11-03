// ✅ ReBook script.js — Final Version

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⚙️ Apna Supabase details
const supabaseUrl = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

// ✅ Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Fetch and display books
async function loadBooks() {
  const { data, error } = await supabase.from("books").select("*");

  const container = document.getElementById("books-list");
  container.innerHTML = ""; // clear old

  if (error) {
    container.innerHTML = "<p>Error loading books!</p>";
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No books found. Add some!</p>";
    return;
  }

  data.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
      <img src="${book.image_url || 'https://via.placeholder.com/150'}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Price:</strong> ₹${book.price}</p>
    `;

    container.appendChild(bookCard);
  });
}

// ✅ Page load pe books fetch karna
document.addEventListener("DOMContentLoaded", loadBooks);
