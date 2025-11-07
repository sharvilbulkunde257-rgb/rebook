// ✅ Import Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🌿 DOM Elements
const authSection = document.getElementById("auth-forms");
const signupCard = document.getElementById("signup-card");
const loginCard = document.getElementById("login-card");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signupMsg = document.getElementById("signup-message");
const loginMsg = document.getElementById("login-message");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const booksSection = document.getElementById("books-section");
const sellSection = document.getElementById("sell-book");
const logoutBtn = document.createElement("button");

logoutBtn.textContent = "Logout";
logoutBtn.className = "primary";
logoutBtn.style.marginLeft = "15px";
document.querySelector(".auth-status").
