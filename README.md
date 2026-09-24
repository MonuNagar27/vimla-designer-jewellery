const products = [
  {
    id: 1,
    name: "Aaradhya Bridal Set",
    type: "bridal",
    price: 48900,
    tag: "Bridal",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    description: "A statement bridal necklace with kundan work and pearl accents.",
    rating: 5,
  },
  {
    id: 2,
    name: "Suhana Gold Choker",
    type: "gold",
    price: 18900,
    tag: "Gold",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
    description: "Classic royal gold choker crafted for festive elegance.",
    rating: 4,
  },
  {
    id: 3,
    name: "Mira Diamond Mangalsutra",
    type: "diamond",
    price: 27900,
    tag: "Diamond",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    description: "A refined diamond mangalsutra with heirloom charm.",
    rating: 5,
  },
  {
    id: 4,
    name: "Veda Temple Necklace",
    type: "temple",
    price: 21400,
    tag: "Temple",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80",
    description: "Temple-inspired antique finish necklace with sacred detailing.",
    rating: 4,
  },
  {
    id: 5,
    name: "Navya Kundan Jhumkas",
    type: "bridal",
    price: 14600,
    tag: "Bridal",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
    description: "Intricate kundan jhumkas with a rich festive finish.",
    rating: 5,
  },
  {
    id: 6,
    name: "Ananya Pearl Necklace",
    type: "gold",
    price: 17200,
    tag: "Gold",
    image:
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80",
    description: "Pearl and gold layered necklace for graceful occasions.",
    rating: 4,
  },
  {
    id: 7,
    name: "Ira Polki Earrings",
    type: "diamond",
    price: 13200,
    tag: "Diamond",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80",
    description: "Handcrafted polki earrings designed to shimmer with every movement.",
    rating: 5,
  },
  {
    id: 8,
    name: "Kavya Meenakari Bangle",
    type: "temple",
    price: 11900,
    tag: "Temple",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    description: "A vibrant meenakari bangle handcrafted in traditional artistry.",
    rating: 4,
  },
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
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getFilteredProducts() {
  return activeFilter === "all"
    ? products
    : products.filter((product) => product.type === activeFilter);
}

function renderProducts() {
  const filtered = getFilteredProducts();

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-content">
            <div class="product-meta">
              <span class="product-tag">${product.tag}</span>
              <span class="rating">${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-row">
              <span class="price">${formatCurrency(product.price)}</span>
              <button class="product-btn" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatCurrency(total);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <p>Qty: ${item.quantity}</p>
          </div>
          <div class="price-tag">${formatCurrency(item.price * item.quantity)}</div>
        </div>
      `,
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  cartDrawer.classList.add("open");
}

function bindFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderProducts();
      bindProductButtons();
    });
  });
}

function bindProductButtons() {
  document.querySelectorAll(".product-btn").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function bindCartControls() {
  document.querySelector(".cart-toggle").addEventListener("click", () => {
    cartDrawer.classList.toggle("open");
  });

  document.querySelector(".close-cart").addEventListener("click", () => {
    cartDrawer.classList.remove("open");
  });

  document.querySelector(".checkout-btn").addEventListener("click", () => {
    cartDrawer.classList.remove("open");
    checkoutModal.classList.add("open");
  });

  document.querySelector(".close-modal").addEventListener("click", () => {
    checkoutModal.classList.remove("open");
  });

  document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! Your luxury jewellery order has been placed successfully.");
    checkoutModal.classList.remove("open");
    cart = [];
    updateCart();
  });
}

function bindNewsletter() {
  document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("You are now subscribed to the Vimla Designer Jewellery private collection updates.");
    event.target.reset();
  });
}

renderProducts();
bindFilterButtons();
bindProductButtons();
bindCartControls();
bindNewsletter();
updateCart();
