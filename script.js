// ✅ ReBook script.js

// Supabase client setup
const { createClient } = supabase;
const supabaseUrl = "https://YOUR_PROJECT_URL.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";
const client = createClient(supabaseUrl, supabaseKey);

// ✅ Function: Fetch books from Supabase
async function fetchBooks() {
  const { data, error } = await client.from("books").select("*");
  if (error) {
    console.error("Error fetching books:", error);
    return;
  }

  const booksContainer = document.getElementById("books-list");
  booksContainer.innerHTML = "";

  if (data.length === 0) {
    booksContainer.innerHTML = "<p>No books found. Add some!</p>";
    return;
  }

  data.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <img src="${book.image_url || 'https://via.placeholder.com/150'}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Price:</strong> ₹${book.price}</p>
    `;

    booksContainer.appendChild(card);
  });
}

// ✅ Run when page loads
fetchBooks();
