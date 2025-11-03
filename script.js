// ✅ Supabase client import
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Config
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const container = document.getElementById("books-container");

// ✅ Demo fallback books (for empty DB)
const demoBooks = [
  {
    title: "Physics for HSC",
    author: "H. C. Verma",
    price: 299,
    image_url: "https://m.media-amazon.com/images/I/71D6nZkYwZL.jpg",
  },
  {
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    price: 350,
    image_url: "https://m.media-amazon.com/images/I/71IYy0s4kKL.jpg",
  },
  {
    title: "Mathematics Vol 1",
    author: "R. D. Sharma",
    price: 249,
    image_url: "https://m.media-amazon.com/images/I/81N4o3ZkJkL.jpg",
  },
  {
    title: "Computer Science 12th",
    author: "Sumita Arora",
    price: 199,
    image_url: "https://m.media-amazon.com/images/I/71qYdXJgU3L.jpg",
  },
];

// ✅ Load books
async function loadBooks() {
  container.innerHTML = "<p>Loading books...</p>";

  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Supabase error:", error);
  }

  const books = data && data.length > 0 ? data : demoBooks;

  container.innerHTML = books
    .map(
      (b) => `
      <div class="book-card">
        <img src="${b.image_url}" alt="${b.title}" />
        <h3>${b.title}</h3>
        <p>👤 ${b.author}</p>
        <p>💰 ₹${b.price}</p>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", loadBooks);
