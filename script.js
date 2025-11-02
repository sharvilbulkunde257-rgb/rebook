* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background-color: #f7fff7;
  color: #333;
}

/* 🌿 Navbar */
nav {
  background-color: #1e7b1e;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav h1 {
  font-size: 1.8rem;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 25px;
}

nav ul li a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: 0.3s;
}

nav ul li a:hover {
  color: #b3ffb3;
}

/* 🏡 Hero Section */
.hero {
  text-align: center;
  padding: 100px 20px;
  color: white;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80")
      center/cover;
}

.hero h2 {
  font-size: 2.5rem;
}

.hero p {
  font-size: 1.1rem;
  margin-top: 10px;
}

/* 📚 Categories */
.categories {
  text-align: center;
  padding: 60px 20px;
}

.categories h2 {
  color: #1e7b1e;
  margin-bottom: 20px;
}

.category-btn {
  background-color: #1e7b1e;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 25px;
  margin: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.category-btn:hover,
.category-btn.active {
  background-color: #2ecc71;
}

/* 📖 Books Section */
.books {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
  padding: 40px;
}

.book-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.book-card h3 {
  color: #1e7b1e;
  margin: 10px;
  font-size: 1.2rem;
}

.book-card p {
  margin: 0 10px 15px;
  color: #555;
}

.buy-btn {
  display: block;
  text-align: center;
  background-color: #1e7b1e;
  color: white;
  padding: 10px;
  text-decoration: none;
  transition: 0.3s;
}

.buy-btn:hover {
  background-color: #2ecc71;
}

/* 💸 Wallet */
.wallet {
  text-align: center;
  padding: 40px;
  background-color: #eaffea;
}

.wallet h3 {
  color: #1e7b1e;
  font-size: 1.6rem;
}

/* 📦 Upload Section */
.upload {
  text-align: center;
  padding: 60px;
  background-color: #f6fff6;
}

.upload input,
.upload button {
  margin: 8px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #aaa;
}

.upload button {
  background-color: #1e7b1e;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.upload button:hover {
  background-color: #2ecc71;
}

/* 🦶 Footer */
footer {
  background-color: #1e7b1e;
  color: white;
  text-align: center;
  padding: 15px;
}
