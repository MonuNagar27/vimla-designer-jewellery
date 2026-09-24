const categoryPlan = [
  { id: "all", label: "All jewellery" },
  { id: "bridal", label: "Bridal collection" },
  { id: "brass-copper", label: "Brass & copper" },
  { id: "temple", label: "Temple jewellery" },
  { id: "gold-plated", label: "1–2 gram gold plated" },
  { id: "rajasthani", label: "Rajasthani heritage" },
  { id: "daily-wear", label: "Daily wear" },
];

const products = [
  { id: 1, name: "Rajputi Rani Haar", category: "rajasthani", tag: "Rajasthani", price: 3499, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80", description: "A regal layered haar inspired by Rajasthan's bridal artistry.", rating: 5 },
  { id: 2, name: "Antique Brass Choker", category: "brass-copper", tag: "Brass & Copper", price: 1899, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80", description: "Antique-finish statement choker for festive and everyday styling.", rating: 4 },
  { id: 3, name: "Temple Lakshmi Necklace", category: "temple", tag: "Temple", price: 2699, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80", description: "Traditional temple-inspired necklace with heritage detailing.", rating: 5 },
  { id: 4, name: "Lightweight Gold Look Set", category: "gold-plated", tag: "1–2 Gram Gold Plated", price: 1299, image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80", description: "Elegant lightweight jewellery designed for ready-stock gifting.", rating: 4 },
  { id: 5, name: "Kundan Bridal Jhumkas", category: "bridal", tag: "Bridal", price: 1599, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80", description: "Kundan jhumkas with a rich bridal finish and pearl accents.", rating: 5 },
  { id: 6, name: "Meenakari Hathphool", category: "rajasthani", tag: "Rajasthani", price: 999, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80", description: "Colourful meenakari hathphool for weddings and celebrations.", rating: 4 },
  { id: 7, name: "Daily Wear Mangalsutra", category: "daily-wear", tag: "Daily Wear", price: 1199, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80", description: "A graceful, comfortable mangalsutra for daily wear.", rating: 5 },
  { id: 8, name: "Antique Kamarband", category: "brass-copper", tag: "Brass & Copper", price: 2299, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80", description: "Ornate antique kamarband designed for traditional occasions.", rating: 4 },
  { id: 9, name: "Gold Look Bangle Pair", category: "gold-plated", tag: "1–2 Gram Gold Plated", price: 799, image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80", description: "Ready-stock bangle pair available in sizes 2x4, 2x6, 2x8 and 2x10.", rating: 4 },
  { id: 10, name: "Temple Jadau Pendant", category: "temple", tag: "Temple", price: 899, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80", description: "A compact pendant for adding a sacred heritage touch.", rating: 5 },
  { id: 11, name: "Rajasthani Borla Maang Tikka", category: "bridal", tag: "Bridal", price: 1099, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80", description: "Classic borla-style maang tikka for bridal and festive looks.", rating: 5 },
  { id: 12, name: "Antique Earrings & Bali Set", category: "daily-wear", tag: "Daily Wear", price: 649, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80", description: "Versatile antique earrings and bali set for everyday elegance.", rating: 4 },
];

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const checkoutModal = document.getElementById("checkoutModal");
let cart = [];
let activeFilter = "all";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function setupSiteContent() {
  const nav = document.querySelector(".main-nav");
  if (nav) {
    nav.innerHTML = [
      ["#home", "Home"], ["#collections", "Collections"], ["#featured", "Shop Jewellery"],
      ["#craft", "Our Craft"], ["#about", "About Us"], ["#contact", "Contact"],
    ].map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  }

  const filterRow = document.querySelector(".filter-row");
  if (filterRow) {
    filterRow.setAttribute("aria-label", "Jewellery categories");
    filterRow.innerHTML = categoryPlan.map((category, index) => `<button class="filter-btn${index === 0 ? " active" : ""}" data-filter="${category.id}">${category.label}</button>`).join("");
  }

  const footerLists = document.querySelectorAll(".site-footer ul");
  if (footerLists[0]) footerLists[0].innerHTML = "<li>2-K-1 Teachers Colony</li><li>Main Road, Kota, Rajasthan</li><li>PIN: 324009</li>";
  if (footerLists[1]) footerLists[1].innerHTML = "<li>Mobile: 7877174936</li><li>WhatsApp orders available</li><li>Instagram · YouTube · Facebook</li>";
}

function renderProducts() {
  const filtered = activeFilter === "all" ? products : products.filter((product) => product.category === activeFilter);
  productGrid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-content">
        <div class="product-meta"><span class="product-tag">${product.tag}</span><span class="rating">${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}</span></div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-row"><span class="price">${formatCurrency(product.price)}</span><button class="product-btn" data-id="${product.id}">Add to cart</button></div>
      </div>
    </article>`).join("");
  bindProductButtons();
}

function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatCurrency(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  cartItems.innerHTML = cart.length ? cart.map((item) => `
    <div class="cart-item"><img src="${item.image}" alt="${item.name}" /><div><h4>${item.name}</h4><p>Qty: ${item.quantity}</p></div><div class="price-tag">${formatCurrency(item.price * item.quantity)}</div></div>`).join("") : '<p class="empty-cart">Your cart is empty.</p>';
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else if (product) cart.push({ ...product, quantity: 1 });
  updateCart();
  cartDrawer.classList.add("open");
}

function bindProductButtons() {
  document.querySelectorAll(".product-btn").forEach((button) => button.addEventListener("click", () => addToCart(Number(button.dataset.id))));
}

function bindFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProducts();
  }));
}

function bindCartControls() {
  document.querySelector(".cart-toggle").addEventListener("click", () => cartDrawer.classList.toggle("open"));
  document.querySelector(".close-cart").addEventListener("click", () => cartDrawer.classList.remove("open"));
  document.querySelector(".checkout-btn").addEventListener("click", () => {
    if (!cart.length) return alert("Please add a jewellery item before checkout.");
    cartDrawer.classList.remove("open");
    checkoutModal.classList.add("open");
  });
  document.querySelector(".close-modal").addEventListener("click", () => checkoutModal.classList.remove("open"));
  document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! We will contact you on WhatsApp to confirm your jewellery order.");
    checkoutModal.classList.remove("open");
    cart = [];
    updateCart();
  });
}

function bindNewsletter() {
  document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("You are now subscribed to Vimla Designer Jewellery updates.");
    event.target.reset();
  });
}

setupSiteContent();
renderProducts();
bindFilters();
bindCartControls();
bindNewsletter();
updateCart();
