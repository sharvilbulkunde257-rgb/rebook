import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://YOUR_PROJECT_URL.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const container = document.getElementById("books-container");

async function loadBooks() {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    container.innerHTML = `<p>Error loading books.</p>`;
    return;
  }

  container.innerHTML = data
    .map(
      (book) => `
      <div class="book-card">
        <img src="${book.image_url}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Price:</strong> ₹${book.price}</p>
      </div>
    `
    )
    .join("");
}

loadBooks();
