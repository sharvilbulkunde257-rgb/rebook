<script>
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
gsap.registerPlugin(ScrollTrigger);

const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";
const TABLE = "Books";
const WISHLIST_TABLE = "wishlists";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const authBtn = document.getElementById("authBtn");
const authModal = document.getElementById("authModal");
const closeAuthModal = document.getElementById("closeAuthModal");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const tabSignIn = document.getElementById("tabSignIn");
const tabSignUp = document.getElementById("tabSignUp");
const googleBtn = document.getElementById("googleBtn");
const togglePw = document.getElementById("togglePw");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");

const booksGrid = document.getElementById("booksGrid");
const loader = document.getElementById("loader");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

const bookModal = document.getElementById("bookModal");
const closeBookModal = document.getElementById("closeBookModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const modalWishlist = document.getElementById("modalWishlist");
const buyBtn = document.getElementById("buyBtn");
const chatBtn = document.getElementById("chatBtn");

const sellForm = document.getElementById("sellForm");
const sellFeedback = document.getElementById("sellFeedback");

const profileAvatar = document.getElementById("profileAvatar");
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const authBtnLabel = document.getElementById("authBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profileInfo = document.getElementById("profileInfo");
const myListings = document.getElementById("myListings");

const toast = document.getElementById("toast");
const wishlistBtn = document.getElementById("wishlistBtn");
const wlCount = document.getElementById("wl-count");

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }
function toastMsg(msg, t = 3000) { toast.textContent = msg; show(toast); setTimeout(() => hide(toast), t); }

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

authBtn.addEventListener("click", () => show(authModal));
closeAuthModal.addEventListener("click", () => hide(authModal));
tabSignIn.addEventListener("click", () => {
  tabSignIn.classList.add("active");
  tabSignUp.classList.remove("active");
  authTitle.textContent = "Sign in to ReBook";
});
tabSignUp.addEventListener("click", () => {
  tabSignUp.classList.add("active");
  tabSignIn.classList.remove("active");
  authTitle.textContent = "Create an account";
});

togglePw.addEventListener("click", (e) => {
  e.preventDefault();
  authPassword.type = authPassword.type === "password" ? "text" : "password";
});

googleBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
  if (error) toastMsg("Google sign in failed");
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();
  if (!email || !password) return toastMsg("Please enter email and password");

  if (tabSignIn.classList.contains("active")) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toastMsg("Sign in failed: " + error.message);
    hide(authModal);
    await afterAuth();
  } else {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return toastMsg("Sign up failed: " + error.message);
    toastMsg("Check your email for confirmation link");
    hide(authModal);
  }
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  hide(profileModal);
  profileAvatar.classList.add("hidden");
  authBtn.classList.remove("hidden");
  toastMsg("Logged out");
});

profileAvatar.addEventListener("click", () => show(profileModal));
closeProfileModal.addEventListener("click", () => hide(profileModal));

supabase.auth.onAuthStateChange((event, session) => {
  if (session && session.user) {
    setupProfileUI(session.user);
  } else {
    profileAvatar.classList.add("hidden");
    authBtn.classList.remove("hidden");
  }
});

async function afterAuth() {
  const user = await getCurrentUser();
  if (user) setupProfileUI(user);
}

function setupProfileUI(user) {
  authBtn.classList.add("hidden");
  profileAvatar.classList.remove("hidden");
  profileAvatar.textContent = (user.email || "U").charAt(0).toUpperCase();
  profileInfo.innerHTML = `<div><strong>${escapeHTML(user.email)}</strong></div><div class="muted small">User ID: ${user.id}</div>`;
  loadMyListings(user.id);
}

async function readWishlist(userId) {
  if (!userId) return [];
  const { data, error } = await supabase.from(WISHLIST_TABLE).select("book_id").eq("user_id", userId);
  if (error) return [];
  return data.map(item => item.book_id);
}

async function saveWishlist(userId, bookIds) {
  if (!userId) return;
  await supabase.from(WISHLIST_TABLE).delete().eq("user_id", userId);
  const inserts = bookIds.map(id => ({ user_id: userId, book_id: id }));
  await supabase.from(WISHLIST_TABLE).insert(inserts);
  wlCount.textContent = bookIds.length;
}

async function toggleWishlist(book) {
  const user = await getCurrentUser();
  if (!user) return toastMsg("Login to use wishlist");
  const arr = await readWishlist(user.id);
  const exists = arr.includes(book.id);
  const newArr = exists ? arr.filter(id => id !== book.id) : [...arr, book.id];
  await saveWishlist(user.id, newArr);
  toastMsg(exists ? "Removed from wishlist" : "Added to wishlist");
  await renderWLCount(user.id);
}

async function renderWLCount(userId) {
  const arr = await readWishlist(userId);
  wlCount.textContent = arr.length;
}

let lastQuery = "";
let allCategories = new Set();

async function loadBooks(q = "", category = "", sort = "new") {
  booksGrid.innerHTML = "";
  show(loader);
  hide(noResults);
  let builder = supabase.from(TABLE).select("id,book_title,author,price,image_url,description,category,condition,user_id,created_at");
  if (q) builder = builder.ilike("book_title", `%${q}%`).or(`author.ilike.%${q}%`);
  if (category) builder = builder.eq("category", category);
  if (sort === "price_asc") builder = builder.order("price", { ascending: true });
  else if (sort === "price_desc") builder = builder.order("price", { ascending: false });
  else builder = builder.order("created_at", { ascending: false });

  const { data, error } = await builder.limit(60);
  hide(loader);
  if (error) { console.error(error); toastMsg("Failed to load books"); return; }
  if (!data || data.length === 0) { show(noResults); return; }

  allCategories.clear();
  data.forEach((d) => d.category && allCategories.add(d.category));
  populateCategories();

  booksGrid.innerHTML = data.map((bk) => renderCardHTML(bk)).join("");
  document.querySelectorAll(".card-view").forEach((el) => {
    el.addEventListener("click", () => openBookModal(JSON.parse(el.dataset.book)));
  });
  document.querySelectorAll(".card-wl").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const bk = JSON.parse(btn.dataset.book);
      toggleWishlist(bk);
    });
  });

  gsap.from(".book-card", { y: 20, opacity: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" });
}

function renderCardHTML(bk) {
  const img = bk.image_url || `https://picsum.photos/seed/${bk.id}/500/700`;
  const short = bk.description ? bk.description.length > 120 ? bk.description.slice(0, 116) + "..." : bk.description : "";
  return `
    <div class="book-card card">
      <div style="cursor:pointer" class="card-view" data-book='${escapeJSON(bk)}'>
        <img src="${img}" alt="${escapeHTML(bk.book_title)}" />
        <div class="body">
          <h3>${escapeHTML(bk.book_title)}</h3>
          <p class="muted">${escapeHTML(bk.author)}</p>
          <div class="price">₹${bk.price || "—"}</div>
          <p class="muted small">${escapeHTML(short)}</p>
        </div>
      </div>
      <div style="padding:8px 12px;display:flex;gap:8px;align-items:center">
        <button class="btn ghost card-wl" data-book='${escapeJSON(bk)}'>♡</button>
        <div style="margin-left:auto;color:var(--muted)">${bk.condition || ""}</div>
      </div>
    </div>
  `;
}

function escapeJSON(obj) { return JSON.stringify(obj).replaceAll("'", "\\'").replaceAll("</", "<\\/"); }
function escapeHTML(s) { if (!s) return ""; return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

function openBookModal(bk) {
  modalImage.src = bk.image_url || `https://picsum.photos/seed/${bk.id}/500/700`;
  modalTitle.textContent = bk.book_title;
  modalAuthor.textContent = bk.author;
  modalPrice.textContent = bk.price ? `₹${bk.price}` : "Price not listed";
  modalDesc.textContent = bk.description || "No description available.";
  modalWishlist.dataset.book = JSON.stringify(bk);
  buyBtn.onclick = () => toastMsg("Buy feature coming soon!");
  chatBtn.onclick = () => toastMsg("Chat feature coming soon!");
  show(bookModal);
}
closeBookModal.addEventListener("click", () => hide(bookModal));
modalWishlist.addEventListener("click", () => { toggleWishlist(JSON.parse(modalWishlist.dataset.book)); });

let searchTimer = null;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { lastQuery = e.target.value.trim(); loadBooks(lastQuery, categorySelect.value, sortSelect.value); }, 450);
});
categorySelect.addEventListener("change", () => loadBooks(lastQuery, categorySelect.value, sortSelect.value));
sortSelect.addEventListener("change", () => loadBooks(lastQuery, categorySelect.value, sortSelect.value));

function populateCategories() {
  const cur = categorySelect.value || "";
  categorySelect.innerHTML = `<option value="">All categories</option>`;
  Array.from(allCategories).sort().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
  categorySelect.value = cur;
}

sellForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = await getCurrentUser();
  if (!user) { show(authModal); return toastMsg("Please login to list a book"); }
  const title = document.getElementById("f_title").value.trim();
  if (!title) return toastMsg("Title required");
  const book = {
    book_title: title,
    author: document.getElementById("f_author").value.trim(),
    price: Number(document.getElementById("f_price").value || 0),
    condition: document.getElementById("f_condition").value.trim(),
    image_url: document.getElementById("f_image").value.trim(),
    category: document.getElementById("f_category").value.trim(),
    description: document.getElementById("f_description").value.trim(),
    user_id: user.id,
  };
  const editId = e.target.dataset.editId;
  sellFeedback.textContent = editId ? "Updating..." : "Listing...";
  if (editId) {
    const { error } = await supabase.from(TABLE).update(book).eq("id", editId);
    if (error) { sellFeedback.textContent = "Failed to update"; console.error(error); return toastMsg("Failed to update"); }
    sellFeedback.textContent = "Updated ✓";
    toastMsg("Book updated successfully");
    delete e.target.dataset.editId;
  } else {
    const { data, error } = await supabase.from(TABLE).insert([book]).select();
    if (error) { sellFeedback.textContent = "Failed to list book"; console.error(error); return toastMsg("Failed to list"); }
    sellFeedback.textContent = "Listed ✓";
    toastMsg("Book listed successfully");
  }
  e.target.reset();
  loadBooks(lastQuery, categorySelect.value, sortSelect.value);
});

async function loadMyListings(uid) {
  myListings.innerHTML = "";
  const { data, error } = await supabase.from(TABLE).select("id,book_title,price,image_url,created_at").eq("user_id", uid).order("created_at", { ascending: false });
  if (error) return console.error(error);
  if (!data || data.length === 0) myListings.innerHTML = `<div class="muted">You have no listings yet.</div>`;
  else myListings.innerHTML = data.map((d) => `
    <div class="card small">
      <img src="${d.image_url || `https://picsum.photos/seed/${d.id}/400/500`}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:8px" />
      <div><strong>${escapeHTML(d.book_title)}</strong></div>
      <div class="muted small">₹${d.price || "—"}</div>
      <div style="display:flex;gap:8px;margin-top:8px"><button class="btn ghost" data-id="${d.id}" onclick="editListing(this)">Edit</button><button class="btn ghost del" data-id="${d.id}">Delete</button></div>
    </div>
  `).join("");
  document.querySelectorAll(".del").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Delete this listing?")) return;
      const { error } = await supabase.from(TABLE).delete().eq("id", id);
      if (error) return toastMsg("Delete failed");
      toastMsg("Deleted");
      loadMyListings((await getCurrentUser()).id);
      loadBooks();
    });
  });
}

async function editListing(btn) {
  const id = btn.dataset.id;
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();
  if (error) return toastMsg("Error loading book");
  document.getElementById("f_title").value = data.book_title;
  document.getElementById("f_author").value = data.author;
  document.getElementById("f_price").value = data.price;
  document.getElementById("f_condition").value = data.condition;
  document.getElementById("f_image").value = data.image_url;
  document.getElementById("f_category").value = data.category;
  document.getElementById("f_description").value = data.description;
  document.getElementById("sell").scrollIntoView({ behavior: "smooth" });
  sellForm.dataset.editId = id;
}

const exploreBtn = document.getElementById("exploreBtn");
const sellQuick = document.getElementById("sellQuick");

exploreBtn.addEventListener("click", () => { document.getElementById("featured").scrollIntoView({ behavior: "smooth" }); });
sellQuick.addEventListener("click", () => { document.getElementById("sell").scrollIntoView({ behavior: "smooth" }); });

closeBookModal.addEventListener("click", () => hide(bookModal));
closeAuthModal.addEventListener
