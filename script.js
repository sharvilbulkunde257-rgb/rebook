// ✅ Import Supabase client from CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase configuration
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Load books from database
async function loadBooks() {
const container = document.getElementById("books-container");
if (!container) return;
container.innerHTML = "<p>Loading books...</p>";

const { data, error } = await supabase.from("books").select("*");

if (error) {
console.error("Supabase Error:", error);
container.innerHTML = "<p style='color:red;'>Error loading books.</p>";
return;
}

if (!data || data.length === 0) {
container.innerHTML = "<p>No books available yet. Be the first to sell yours!</p>";
return;
}

container.innerHTML = data
.map(
(book) => "<div class="book-card"> <img src="${book.image_url || "https://via.placeholder.com/220x250"}" alt="${book.title}" /> <h3>${book.title}</h3> <p>Author: ${book.author}</p> <p>Price: ₹${book.price}</p> <p>Condition: ${book.condition || "Good"}</p> </div>"
)
.join("");
}

// ✅ Handle form submission for selling book
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
  message.textContent = "❌ Please fill all fields.";
  message.style.color = "red";
  return;
}

const { error } = await supabase.from("books").insert([
  { title, author, price, condition, image_url },
]);

if (error) {
  console.error(error);
  message.textContent = "⚠️ Error adding book. Try again!";
  message.style.color = "red";
} else {
  message.textContent = "✅ Book uploaded successfully!";
  message.style.color = "green";
  form.reset();
  loadBooks(); // refresh books after adding
}

});
}

// ✅ Load books when page loads
document.addEventListener("DOMContentLoaded", loadBooks);
