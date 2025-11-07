// ✅ Import Supabase client from CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- AUTHENTICATION & UI ELEMENTS ---
const authButton = document.getElementById('auth-button');
const authForms = document.getElementById('auth-forms');
const userInfoSpan = document.getElementById('user-info');
const sellBookSection = document.getElementById('sell-book');
const homeSection = document.getElementById('home');
const booksSection = document.getElementById('books-section');

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');
const signupCard = document.getElementById('signup-card');
const loginCard = document.getElementById('login-card');
const signupMessage = document.getElementById('signup-message');
const loginMessage = document.getElementById('login-message');
const form = document.getElementById("sell-form");
const message = document.getElementById("message");

// ✅ Smooth scroll helper
window.scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
};

// --- CORE UI/AUTH FUNCTIONS ---

// Function to show the auth forms and hide all main content
function showAuthForms() {
    // 1. Auth forms ko dikhana
    authForms.style.display = 'flex'; 

    // 2. Baaki sabhi sections ko chhupana
    homeSection.style.display = 'none';
    booksSection.style.display = 'none';
    sellBookSection.style.display = 'none';

    // 3. Default mein Signup form dikhao (kyunki user ne signup pe click kiya hai)
    signupCard.style.display = 'block';
    loginCard.style.display = 'none';

    // 4. Current URL mein hash add karna (optional, for history)
    window.location.hash = '#auth'; 
}

// UI ko reset aur refresh karna
function resetUI() {
    // Auth forms ko chhupana
    authForms.style.display = 'none'; 
    
    // Baaki sections ko wapas dikhana
    homeSection.style.display = 'block';
    booksSection.style.display = 'block';
    sellBookSection.style.display = 'block'; 
    
    handleUserStatus(); // User status check karke Sell Section update karega
    loadBooks(); // Books reload karo
}

// User ka status check aur UI update karo (Login/Logout)
async function handleUserStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    const sellFormButton = form.querySelector('button');

    if (user) {
        // Logged In State
        authButton.textContent = 'Logout';
        authButton.classList.remove('primary');
        authButton.classList.add('outline');
        userInfoSpan.textContent = `Welcome, ${user.email.split('@')[0]}!`;

        // Sell Book Form Enable
        sellFormButton.textContent = 'Upload Book';
        sellFormButton.disabled = false;
        message.textContent = '';
    } else {
        // Logged Out State
        authButton.textContent = 'Login / Signup';
        authButton.classList.remove('outline');
        authButton.classList.add('primary');
        userInfoSpan.textContent = '';

        // Sell Book Form Disable (as per RLS policy)
        sellFormButton.textContent = 'Login to Upload';
        sellFormButton.disabled = true; // Button ko disable karna
        message.textContent = '⚠️ Please log in to sell your book.';
    }
}

// ✅ Load available books
async function loadBooks() {
    const container = document.getElementById("books-container");
    container.innerHTML = "<p>Loading books...</p>";

    const { data, error } = await supabase.from("books").select("*").order("id", { ascending: false });

    if (error) {
        container.innerHTML = "<p style='color:red;'>⚠️ Error loading books: " + error.message + "</p>";
        console.error("Supabase Load Books Error:", error);
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
            <img src="${book.image_url}" onerror="this.onerror=null; this.src='https://placehold.co/250x300/16a085/ffffff?text=Book+Cover';" alt="${book.title}" />
            <div class="book-info">
              <h3>${book.title}</h3>
              <p>Author: ${book.author}</p>
              <p>Condition: ${book.condition}</p>
              <p><strong>₹${book.price}</strong></p>
              ${book.seller_id ? `<p style="font-size:0.8rem; color: #00b894;">Seller ID: ${book.seller_id.substring(0, 8)}...</p>` : ''}
            </div>
          </div>
        `
        )
        .join("");
}

// --- EVENT LISTENERS ---

// Auth button click par forms dikhao ya logout karo
authButton.addEventListener('click', () => {
    if (authButton.textContent === 'Logout') {
        handleLogout();
    } else {
        showAuthForms();
    }
});

// Forms ko toggle karna
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupCard.style.display = 'none';
    loginCard.style.display = 'block';
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.style.display = 'none';
    signupCard.style.display = 'block';
});

// Handle SIGNUP
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    signupMessage.textContent = 'Signing up...';
    signupMessage.style.color = 'black';

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        signupMessage.textContent = `Error: ${error.message}`;
        signupMessage.style.color = 'red';
    } else {
        signupMessage.textContent = '✅ Success! Please check your email to confirm your account.';
        signupMessage.style.color = 'green';
        signupForm.reset();
    }
});

// Handle LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    loginMessage.textContent = 'Logging in...';
    loginMessage.style.color = 'black';

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginMessage.textContent = `Error: ${error.message}`;
        loginMessage.style.color = 'red';
    } else {
        loginMessage.textContent = '✅ Logged in successfully!';
        loginMessage.style.color = 'green';
        loginForm.reset();
        resetUI(); // UI update karo
    }
});

// Handle LOGOUT
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout Error:', error);
    } else {
        resetUI();
    }
}

// ✅ Handle Sell Book form (existing logic)
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
             message.textContent = "❌ Please log in to upload a book!";
             message.style.color = "red";
             return;
        }

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
            console.error("Insert Book Error:", error);
            message.textContent = "⚠️ Error uploading book! RLS policy issue ho sakta hai.";
            message.style.color = "red";
        } else {
            message.textContent = "✅ Book uploaded successfully!";
            message.style.color = "green";
            form.reset();
            loadBooks();
        }
    });
}

// Initial load aur Auth state change par status check karo
// --- Initial Load Logic ---
function initialLoad() {
    loadBooks(); 
    handleUserStatus(); 
}

// Ensure the DOM is fully loaded before running initial logic
document.addEventListener('DOMContentLoaded', initialLoad);

// Supabase Auth State Change Listener
supabase.auth.onAuthStateChange((event, session) => {
    // Ye listener login/logout ke baad UI ko reset karta hai
    handleUserStatus();
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        resetUI();
    }
});
