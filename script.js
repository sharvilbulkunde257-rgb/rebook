// main.js (module)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Your Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";
const TABLE = "books"; // change if your table name is different

// ✅ Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const booksGrid = document.getElementById("booksGrid");
const loader = document.getElementById("loader");
const emptyState = document.getElementById("emptyState");
const booksCount = document.getElementById("booksCount");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const refreshBtn = document.getElementById("refreshBtn");

let allBooks = [];

// Helper functions
function showLoader(on = true) {
  loader.style.display = on ? "block" : "none";
}
function showEmpty(on = true) {
  emptyState.style.display = on ? "block" : "none";
}
function setCount(n) {
  booksCount.textContent = n;
}

// Render each book card
function renderCard(book) {
  const title = book.title || "Untitled";
  const author = book.author || book.seller_name || "Unknown";
  const price = book.price != null ? `₹ ${book.price}` : "Free";
  const condition = book.condition || "Good";
  const img = book.image_url || book.image || "";

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div class="thumb">
      ${
        img
          ? `<img src="${img}" alt="${escapeHtml(title)}" loading="lazy" />`
          : `<div style="padding:8px;color:var(--muted);font-size:12px">No Image</div>`
      }
    </div>
    <div class="meta" style="flex:1;">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(author)} • <span style="color:var(--muted)">${escapeHtml(
    condition
  )}</span></p>
      <div class="row">
        <div class="price">${escapeHtml(price)}</div>
        <button class="cta" data-id="${book.id}">View</button>
      </div>
    </div>
  `;

  const btn = div.querySelector(".cta");
  btn.style.border = "none";
  btn.style.background = "linear-gradient(90deg,var(--accent), #ff9a66)";
  btn.style.padding = "6px 10px";
  btn.style.color = "#032027";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    const seller = book.seller_contact || book.seller_email || "";
    if (seller) {
      window.open(
        `mailto:${seller}?subject=Interested in your book: ${encodeURIComponent(
          title
        )}`
      );
    } else {
      alert(`Interested in "${title}". Seller contact not available.`);
    }
  });

  return div;
}

// Escape HTML
function escapeHtml(text) {
  if (text == null) return "";
  return String(text).replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

// Fetch books from Supabase
async function fetchBooks({ search = "", sort = "new" } = {}) {
  showLoader(true);
  showEmpty(false);
  booksGrid.innerHTML = "";

  try {
    let query = supabase.from(TABLE).select("*");

    // Search by title/author/subject
    if (search && search.trim().length > 0) {
      const s = `%${search.trim()}%`;
      query = query.or(`title.ilike.${s},author.ilike.${s},subject.ilike.${s}`);
    }

    // Sort logic
    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc")
      query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query.limit(500);

    if (error) {
      console.error("Supabase error:", error);
      alert("Error fetching books. Check console for details.");
      showLoader(false);
      return;
    }

    allBooks = data || [];
    setCount(allBooks.length);

    if (!allBooks.length) {
      showEmpty(true);
      showLoader(false);
      return;
    }

    const fragment = document.createDocumentFragment();
    allBooks.forEach((b) => fragment.appendChild(renderCard(b)));
    booksGrid.appendChild(fragment);
  } catch (err) {
    console.error(err);
    alert("Unexpected error while fetching books.");
  } finally {
    showLoader(false);
  }
}

// Debounce utility
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Event listeners
searchInput.addEventListener(
  "input",
  debounce(() => {
    const q = searchInput.value.trim();
    fetchBooks({ search: q, sort: sortSelect.value });
  }, 450)
);

sortSelect.addEventListener("change", () => {
  fetchBooks({ search: searchInput.value.trim(), sort: sortSelect.value });
});

refreshBtn.addEventListener("click", () => {
  fetchBooks({ search: searchInput.value.trim(), sort: sortSelect.value });
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks({ search: "", sort: "new" });
});
