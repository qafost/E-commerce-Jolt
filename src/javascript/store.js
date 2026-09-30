const STORAGE_CART = "stuffsus-cart";
const STORAGE_USER = "stuffsus-user";
const STORAGE_ORDERS = "stuffsus-orders";
const STORAGE_NEWS = "stuffsus-news";

const state = {
  category: "all",
  query: "",
  sort: "featured",
  cart: load(STORAGE_CART, []),
  user: load(STORAGE_USER, null)
};

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

function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = productById(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function persistCart() {
  save(STORAGE_CART, state.cart);
  document.querySelectorAll("#cartBadge").forEach((badge) => {
    badge.textContent = cartCount();
    badge.hidden = cartCount() === 0;
  });
}

function addToCart(id, qty = 1) {
  const product = productById(id);
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
  const product = productById(id);
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

function cartRowsHTML() {
  if (!state.cart.length) return `<p class="empty">Your basket is empty.</p>`;
  return state.cart
    .map((item) => {
      const p = productById(item.id);
      if (!p) return "";
      return `
        <div class="cart-row">
          <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
          <div>
            <h6><a href="product.html?id=${p.id}">${p.name}</a></h6>
            <p>${money(p.price)}</p>
            <div class="qty">
              <button type="button" data-qty="${p.id}" data-delta="-1">−</button>
              <span>${item.qty}</span>
              <button type="button" data-qty="${p.id}" data-delta="1">+</button>
            </div>
          </div>
          <strong>${money(p.price * item.qty)}</strong>
        </div>`;
    })
    .join("");
}

function renderCart() {
  document.querySelectorAll("#cartItems").forEach((el) => {
    el.innerHTML = cartRowsHTML();
  });
  document.querySelectorAll("#cartTotal").forEach((el) => {
    el.textContent = money(cartTotal());
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function overlay() {
  return document.getElementById("overlay");
}

function openDrawer(el) {
  if (!el) return;
  overlay().hidden = false;
  el.setAttribute("aria-hidden", "false");
  el.classList.add("open");
}

function closeDrawers() {
  const layer = overlay();
  if (layer) layer.hidden = true;
  document.querySelectorAll(".drawer").forEach((el) => {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
  });
  document.querySelector(".nav-links")?.classList.remove("open");
}

function goCheckout() {
  if (!state.cart.length) {
    showToast("Add something to your basket first.");
    return;
  }
  if (!state.user) {
    closeDrawers();
    window.location.href = "account.html?next=checkout.html";
    return;
  }
  window.location.href = "checkout.html";
}

function renderAccount() {
  const body = document.getElementById("accountBody");
  if (!body) return;
  if (state.user) {
    const orders = load(STORAGE_ORDERS, []).filter((o) => o.email === state.user.email);
    body.innerHTML = `
      <p>Signed in as <strong>${state.user.name}</strong></p>
      <p class="muted">${state.user.email}</p>
      <a class="btn full" href="account.html">Order history</a>
      <button class="text-btn" id="logoutBtn" type="button">Sign out</button>`;
    return;
  }
  body.innerHTML = `
    <form id="authForm" class="form">
      <label>Name<input name="name" required></label>
      <label>Email<input type="email" name="email" required></label>
      <button class="btn full" type="submit">Continue</button>
      <a class="text-btn" href="account.html">Full account page</a>
    </form>`;
}

function signIn(name, email) {
  state.user = { name, email };
  save(STORAGE_USER, state.user);
  renderAccount();
  showToast("Welcome, " + state.user.name);
}

function placeOrder(fields) {
  const orders = load(STORAGE_ORDERS, []);
  const order = {
    id: String(Date.now()).slice(-6),
    email: state.user.email,
    name: state.user.name,
    address: fields.address,
    city: fields.city,
    total: cartTotal(),
    items: state.cart.map((item) => ({ ...item }))
  };
  orders.unshift(order);
  save(STORAGE_ORDERS, orders);
  state.cart = [];
  persistCart();
  renderCart();
  closeDrawers();
  window.location.href = "account.html?placed=" + order.id;
}

function productCard(p) {
  const badge = p.compareAt
    ? `<span class="pill">Sale</span>`
    : p.tags.includes("best")
      ? `<span class="pill muted">Best</span>`
      : "";
  return `
    <article class="product">
      <a class="product-media" href="product.html?id=${p.id}">
        ${badge}
        <img src="${p.image}" alt="${p.name}">
      </a>
      <div class="prices">
        <div>
          <h6><a href="product.html?id=${p.id}">${p.name}</a></h6>
          <strong>${money(p.price)}${p.compareAt ? ` <s>${money(p.compareAt)}</s>` : ""}</strong>
        </div>
        <button class="icon-btn add" data-add="${p.id}" aria-label="Add ${p.name}" type="button">
          <img src="public/icon/basket.svg" alt="">
        </button>
      </div>
    </article>`;
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

function currentPage() {
  return document.body.dataset.page || "";
}

function navLink(href, id, label) {
  const active = currentPage() === id ? " active" : "";
  return `<li><a class="${active.trim()}" href="${href}">${label}</a></li>`;
}

function injectHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const homeHero = currentPage() === "home";
  host.innerHTML = `
    <header>
      <nav class="navbar steck">
        <a href="index.html" class="brand">Stuffsus</a>
        <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Menu">☰</button>
        <ul class="nav-links steck">
          ${navLink("index.html", "home", "Home")}
          ${navLink("shop.html", "shop", "Shop")}
          ${navLink("blog.html", "blog", "Blog")}
          ${navLink("about.html", "about", "About")}
          ${navLink("contact.html", "contact", "Contact")}
        </ul>
        <div class="nav_icon steck">
          <a class="icon-btn" href="shop.html#search" aria-label="Search">
            <img src="public/icon/search.svg" alt="">
          </a>
          <button class="icon-btn" id="openCart" type="button" aria-label="Cart">
            <img src="public/icon/basket.svg" alt="">
            <span class="badge" id="cartBadge">0</span>
          </button>
          <a class="account_img" href="account.html" aria-label="Account">
            <img src="public/image/imageaccount.jpeg" alt="">
          </a>
        </div>
      </nav>
      ${
        homeHero
          ? `<section class="hero-section">
              <div class="hero-copy">
                <p>New season drop</p>
                <h1>Shop</h1>
                <a class="btn" href="shop.html">Browse collection</a>
              </div>
            </section>`
          : `<section class="page-hero">
              <h1>${document.title.replace(" | Stuffsus", "").replace("Stuffsus | ", "")}</h1>
            </section>`
      }
    </header>`;
}

function injectShell() {
  const host = document.getElementById("site-shell");
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">Stuffsus</a>
          <p>Everyday objects for home and sound — built to last, priced honestly.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a href="shop.html">All products</a>
          <a href="shop.html?cat=audio">Audio</a>
          <a href="shop.html?cat=home">Home</a>
          <a href="shop.html?cat=sale">Sale</a>
          <a href="shop.html?cat=best">Best sellers</a>
        </div>
        <div>
          <h4>Help</h4>
          <a href="shipping.html">Shipping</a>
          <a href="faq.html">FAQ</a>
          <a href="contact.html">Contact</a>
          <a href="cart.html">Basket</a>
          <a href="account.html">Account</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="about.html">About</a>
          <a href="blog.html">Journal</a>
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
        </div>
        <form class="footer-news" id="newsForm">
          <h4>Newsletter</h4>
          <p>New drops and quiet discounts. No spam.</p>
          <input type="email" name="email" required placeholder="Email address">
          <button class="btn" type="submit">Join</button>
        </form>
      </div>
      <div class="footer-bar steck">
        <p>© <span id="year"></span> Stuffsus. All rights reserved.</p>
        <p>Ships worldwide from Cairo.</p>
      </div>
    </footer>
    <div class="overlay" id="overlay" hidden></div>
    <aside class="drawer" id="cartDrawer" aria-hidden="true">
      <div class="drawer-head steck">
        <h3>Your basket</h3>
        <button class="text-btn" data-close type="button">Close</button>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-foot">
        <div class="steck">
          <span>Total</span>
          <strong id="cartTotal">$0.00</strong>
        </div>
        <a class="btn full ghost" href="cart.html">View basket</a>
        <button class="btn full" id="checkoutBtn" type="button">Checkout</button>
      </div>
    </aside>
    <aside class="drawer" id="accountDrawer" aria-hidden="true">
      <div class="drawer-head steck">
        <h3>Account</h3>
        <button class="text-btn" data-close type="button">Close</button>
      </div>
      <div id="accountBody"></div>
    </aside>
    <div class="toast" id="toast" hidden></div>`;
}

function bindChrome() {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("openCart")?.addEventListener("click", () => {
    renderCart();
    openDrawer(document.getElementById("cartDrawer"));
  });
  document.getElementById("menuBtn")?.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.toggle("open");
  });
  document.getElementById("checkoutBtn")?.addEventListener("click", goCheckout);
  overlay()?.addEventListener("click", closeDrawers);
  document.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", closeDrawers));
  window.addEventListener("scroll", () => {
    document.querySelector(".navbar")?.classList.toggle("scrolled", window.scrollY > 8);
  });
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add, Number(add.dataset.qty || 1));

  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const item = state.cart.find((row) => row.id === qty.dataset.qty);
    setQty(qty.dataset.qty, (item ? item.qty : 0) + Number(qty.dataset.delta));
  }

  if (e.target.id === "logoutBtn") {
    state.user = null;
    save(STORAGE_USER, null);
    renderAccount();
    showToast("Signed out");
    if (currentPage() === "account" || currentPage() === "checkout") {
      window.location.href = "account.html";
    }
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "authForm") {
    e.preventDefault();
    const data = new FormData(e.target);
    signIn(data.get("name"), data.get("email"));
    const next = new URLSearchParams(location.search).get("next");
    if (next) window.location.href = next;
  }
  if (e.target.id === "newsForm") {
    e.preventDefault();
    const email = new FormData(e.target).get("email");
    const list = load(STORAGE_NEWS, []);
    if (!list.includes(email)) list.push(email);
    save(STORAGE_NEWS, list);
    e.target.reset();
    showToast("You are on the list.");
  }
  if (e.target.id === "contactForm") {
    e.preventDefault();
    showToast("Message sent. We will reply by email.");
    e.target.reset();
  }
  if (e.target.id === "payForm") {
    e.preventDefault();
    const data = new FormData(e.target);
    placeOrder({
      address: data.get("address"),
      city: data.get("city")
    });
  }
});

injectHeader();
injectShell();
bindChrome();
persistCart();
renderCart();
renderAccount();
