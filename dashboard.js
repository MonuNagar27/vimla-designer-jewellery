const customer = JSON.parse(localStorage.getItem("vimlaCustomer") || "null");
if (!customer) window.location.href = "login.html?return=dashboard";

const profile = customer || {};
const favourites = JSON.parse(localStorage.getItem("vimlaFavourites") || "[]");
const orders = JSON.parse(localStorage.getItem("vimlaOrders") || "[]");

document.getElementById("customerName").textContent = profile.name || "Guest";
document.getElementById("orderCount").textContent = orders.length;
document.getElementById("memberSince").textContent = profile.memberSince || "2026";
document.getElementById("favouriteCount").textContent = favourites.length;
document.getElementById("overviewFavouriteCount").textContent = favourites.length;
document.getElementById("detailsName").value = profile.name || "";
document.getElementById("detailsEmail").value = profile.email || "";
document.getElementById("detailsPhone").value = profile.phone || "";
document.getElementById("detailsAddress").value = profile.address || "";

const savedList = document.getElementById("favouritesList");
savedList.innerHTML = favourites.length ? favourites.map((item) => `<article class="saved-card"><img src="${item.image}" alt="${item.name}" /><div><h3>${item.name}</h3><p>₹${Number(item.price).toLocaleString("en-IN")}</p></div></article>`).join("") : `<div class="empty-panel"><span>♢</span><h3>No saved pieces yet.</h3><p>Tap the heart on a product to create your personal edit.</p><a href="index.html#featured" class="gold-link">Discover jewellery ↗</a></div>`;

const ordersList = document.getElementById("ordersList");
if (orders.length) ordersList.innerHTML = orders.map((order) => `<article class="order-row"><strong>Order ${order.id}</strong><span>${order.status || "Order received"}</span><b>₹${Number(order.total).toLocaleString("en-IN")}</b></article>`).join("");

document.querySelectorAll(".dash-tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".dash-tab").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".dash-panel").forEach((panel) => panel.classList.remove("active"));
  tab.classList.add("active");
  document.getElementById(tab.dataset.panel).classList.add("active");
}));

document.getElementById("detailsForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const updated = { ...profile, name: document.getElementById("detailsName").value.trim(), email: document.getElementById("detailsEmail").value.trim(), phone: document.getElementById("detailsPhone").value.trim(), address: document.getElementById("detailsAddress").value.trim() };
  localStorage.setItem("vimlaCustomer", JSON.stringify(updated));
  document.getElementById("customerName").textContent = updated.name || "Guest";
  document.getElementById("detailsMessage").textContent = "Your account details have been saved.";
});

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("vimlaCustomer");
  window.location.href = "login.html";
});
