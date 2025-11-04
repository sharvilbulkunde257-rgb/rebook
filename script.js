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
    }
  });
}
