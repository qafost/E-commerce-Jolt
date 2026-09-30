const STORAGE_CART = "stuffsus-cart";
const STORAGE_USER = "stuffsus-user";
const STORAGE_ORDERS = "stuffsus-orders";

const state = {
  category: "all",
  query: "",
  sort: "featured",
  cart: load(STORAGE_CART, []),
  user: load(STORAGE_USER, null)
};

const els = {
  categoryList: document.getElementById("categoryList"),
  productGrid: document.getElementById("productGrid"),
  resultCount: document.getElementById("resultCount"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  overlay: document.getElementById("overlay"),
  cartDrawer: document.getElementById("cartDrawer"),
  accountDrawer: document.getElementById("accountDrawer"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  cartBadge: document.getElementById("cartBadge"),
  productModal: document.getElementById("productModal"),
  checkoutModal: document.getElementById("checkoutModal"),
  accountBody: document.getElementById("accountBody"),
  toast: document.getElementById("toast")
};

document.getElementById("year").textContent = new Date().getFullYear();

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function matchesCategory(product, category) {
  if (category === "all") return true;
  if (category === "sale") return product.tags.includes("sale") || Boolean(product.compareAt);
  if (category === "best") return product.tags.includes("best");
  return product.category === category;
}

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => matchesCategory(p, state.category));
  if (q) {
    list = list.filter((p) =>
      `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)
    );
  }
  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderCategories() {
  els.categoryList.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="category-chip ${state.category === c.id ? "active" : ""}" data-category="${c.id}">
      <img src="${c.icon}" alt="">
      <span>${c.name}</span>
    </button>`
  ).join("");
}

function renderProducts() {
  const list = filteredProducts();
  els.resultCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
  if (!list.length) {
    els.productGrid.innerHTML = `<p class="empty">No products match that search.</p>`;
    return;
  }
  els.productGrid.innerHTML = list
    .map((p) => {
      const badge = p.compareAt ? `<span class="pill">Sale</span>` : p.tags.includes("best") ? `<span class="pill muted">Best</span>` : "";
      return `
        <article class="product">
          <button class="product-media" data-open="${p.id}">
            ${badge}
            <img src="${p.image}" alt="${p.name}">
          </button>
          <div class="prices">
            <div>
              <h6>${p.name}</h6>
              <strong>${money(p.price)}${p.compareAt ? ` <s>${money(p.compareAt)}</s>` : ""}</strong>
            </div>
            <button class="icon-btn add" data-add="${p.id}" aria-label="Add ${p.name}">
              <img src="public/icon/basket.svg" alt="">
            </button>
          </div>
        </article>`;
    })
    .join("");
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function persistCart() {
  save(STORAGE_CART, state.cart);
  els.cartBadge.textContent = cartCount();
  els.cartBadge.hidden = cartCount() === 0;
}

function addToCart(id, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  const existing = state.cart.find((item) => item.id === id);
  const nextQty = (existing ? existing.qty : 0) + qty;
  if (nextQty > product.stock) {
    showToast("Not enough stock left.");
    return;
  }
  if (existing) existing.qty = nextQty;
  else state.cart.push({ id, qty });
  persistCart();
  renderCart();
  showToast(`${product.name} added to basket`);
}

function setQty(id, qty) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  qty = Math.max(0, Math.min(product.stock, qty));
  if (qty === 0) state.cart = state.cart.filter((item) => item.id !== id);
  else {
    const item = state.cart.find((row) => row.id === id);
    if (item) item.qty = qty;
  }
  persistCart();
  renderCart();
}

function renderCart() {
  if (!state.cart.length) {
    els.cartItems.innerHTML = `<p class="empty">Your basket is empty.</p>`;
    els.cartTotal.textContent = money(0);
    return;
  }
  els.cartItems.innerHTML = state.cart
    .map((item) => {
      const p = PRODUCTS.find((prod) => prod.id === item.id);
      if (!p) return "";
      return `
        <div class="cart-row">
          <img src="${p.image}" alt="">
          <div>
            <h6>${p.name}</h6>
            <p>${money(p.price)}</p>
            <div class="qty">
              <button data-qty="${p.id}" data-delta="-1">−</button>
              <span>${item.qty}</span>
              <button data-qty="${p.id}" data-delta="1">+</button>
            </div>
          </div>
          <strong>${money(p.price * item.qty)}</strong>
        </div>`;
    })
    .join("");
  els.cartTotal.textContent = money(cartTotal());
}

function openDrawer(el) {
  els.overlay.hidden = false;
  el.setAttribute("aria-hidden", "false");
  el.classList.add("open");
}

function closeDrawers() {
  els.overlay.hidden = true;
  [els.cartDrawer, els.accountDrawer].forEach((el) => {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
  });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => {
    els.toast.hidden = true;
  }, 2200);
}

function openProduct(id) {
  const p = PRODUCTS.find((prod) => prod.id === id);
  if (!p) return;
  els.productModal.innerHTML = `
    <div class="modal-card">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <button class="text-btn" data-close-modal>Close</button>
        <h3>${p.name}</h3>
        <strong>${money(p.price)}</strong>
        <p>${p.description}</p>
        <p class="stock">${p.stock} in stock</p>
        <button class="btn" data-add="${p.id}">Add to basket</button>
      </div>
    </div>`;
  els.productModal.showModal();
}

function renderAccount() {
  if (state.user) {
    const orders = load(STORAGE_ORDERS, []).filter((o) => o.email === state.user.email);
    els.accountBody.innerHTML = `
      <p>Signed in as <strong>${state.user.name}</strong></p>
      <p class="muted">${state.user.email}</p>
      <h4>Orders</h4>
      ${
        orders.length
          ? orders
              .map(
                (o) => `<div class="order"><span>#${o.id}</span><span>${money(o.total)}</span></div>`
              )
              .join("")
          : `<p class="empty">No orders yet.</p>`
      }
      <button class="btn full" id="logoutBtn">Sign out</button>`;
    return;
  }
  els.accountBody.innerHTML = `
    <form id="authForm" class="form">
      <label>Name<input name="name" required></label>
      <label>Email<input type="email" name="email" required></label>
      <button class="btn full" type="submit">Continue</button>
    </form>`;
}

function openCheckout() {
  if (!state.cart.length) {
    showToast("Add something to your basket first.");
    return;
  }
  if (!state.user) {
    closeDrawers();
    openDrawer(els.accountDrawer);
    showToast("Sign in to checkout.");
    return;
  }
  els.checkoutModal.innerHTML = `
    <form class="modal-card form" id="payForm">
      <div>
        <button class="text-btn" type="button" data-close-modal>Close</button>
        <h3>Checkout</h3>
        <p>Shipping to ${state.user.name}</p>
        <label>Address<input name="address" required placeholder="Street, city"></label>
        <label>Card number<input name="card" required minlength="12" placeholder="4242 4242 4242 4242"></label>
        <p>Pay ${money(cartTotal())}</p>
        <button class="btn full" type="submit">Place order</button>
      </div>
    </form>`;
  els.checkoutModal.showModal();
}

function placeOrder(address) {
  const orders = load(STORAGE_ORDERS, []);
  const order = {
    id: String(Date.now()).slice(-6),
    email: state.user.email,
    address,
    total: cartTotal(),
    items: state.cart
  };
  orders.unshift(order);
  save(STORAGE_ORDERS, orders);
  state.cart = [];
  persistCart();
  renderCart();
  els.checkoutModal.close();
  closeDrawers();
  showToast(`Order #${order.id} placed`);
}

els.categoryList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  state.category = btn.dataset.category;
  renderCategories();
  renderProducts();
});

els.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  state.query = els.searchInput.value;
  renderProducts();
});

els.searchInput.addEventListener("input", () => {
  state.query = els.searchInput.value;
  renderProducts();
});

els.sortSelect.addEventListener("change", () => {
  state.sort = els.sortSelect.value;
  renderProducts();
});

document.getElementById("openSearch").addEventListener("click", () => {
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  els.searchInput.focus();
});

document.getElementById("openCart").addEventListener("click", () => {
  renderCart();
  openDrawer(els.cartDrawer);
});

document.getElementById("openAccount").addEventListener("click", () => {
  renderAccount();
  openDrawer(els.accountDrawer);
});

document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
els.overlay.addEventListener("click", closeDrawers);
document.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", closeDrawers));

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);

  const open = e.target.closest("[data-open]");
  if (open) openProduct(open.dataset.open);

  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const item = state.cart.find((row) => row.id === qty.dataset.qty);
    setQty(qty.dataset.qty, (item ? item.qty : 0) + Number(qty.dataset.delta));
  }

  if (e.target.matches("[data-close-modal]")) {
    els.productModal.close();
    els.checkoutModal.close();
  }

  if (e.target.id === "logoutBtn") {
    state.user = null;
    save(STORAGE_USER, null);
    renderAccount();
    showToast("Signed out");
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "authForm") {
    e.preventDefault();
    const data = new FormData(e.target);
    state.user = { name: data.get("name"), email: data.get("email") };
    save(STORAGE_USER, state.user);
    renderAccount();
    showToast("Welcome, " + state.user.name);
  }
  if (e.target.id === "payForm") {
    e.preventDefault();
    const data = new FormData(e.target);
    placeOrder(data.get("address"));
  }
});

window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 8);
});

renderCategories();
renderProducts();
persistCart();
renderCart();
renderAccount();
