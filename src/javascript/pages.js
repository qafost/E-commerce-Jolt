const pageCart = document.getElementById("pageCart");
if (pageCart) {
  const paint = () => {
    pageCart.innerHTML = cartRowsHTML();
    document.getElementById("pageTotal").textContent = money(cartTotal());
  };
  paint();
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-qty]")) paint();
  });
  document.getElementById("pageCheckout")?.addEventListener("click", goCheckout);
}

const checkoutBox = document.getElementById("checkoutBox");
if (checkoutBox) {
  if (!state.cart.length) {
    checkoutBox.innerHTML = `<p class="empty">Your basket is empty. <a href="shop.html">Continue shopping</a></p>`;
  } else if (!state.user) {
    window.location.href = "account.html?next=checkout.html";
  } else {
    checkoutBox.innerHTML = `
      <div class="split">
        <form class="form card" id="payForm">
          <h2>Shipping</h2>
          <p>Order for ${state.user.name} · ${state.user.email}</p>
          <label>Address<input name="address" required placeholder="Street and building"></label>
          <label>City<input name="city" required placeholder="City"></label>
          <label>Card number<input name="card" required minlength="12" placeholder="4242 4242 4242 4242"></label>
          <button class="btn full" type="submit">Place order · ${money(cartTotal())}</button>
        </form>
        <aside class="card">
          <h3>Summary</h3>
          ${cartRowsHTML()}
          <div class="steck tight"><span>Total</span><strong>${money(cartTotal())}</strong></div>
        </aside>
      </div>`;
  }
}

const accountPage = document.getElementById("accountPage");
if (accountPage) {
  const placed = new URLSearchParams(location.search).get("placed");
  if (!state.user) {
    accountPage.innerHTML = `
      <form id="authForm" class="form card narrow">
        <h2>Sign in</h2>
        <p>Use any name and email to create a local account on this device.</p>
        <label>Name<input name="name" required></label>
        <label>Email<input type="email" name="email" required></label>
        <button class="btn full" type="submit">Continue</button>
      </form>`;
  } else {
    const orders = load(STORAGE_ORDERS, []).filter((o) => o.email === state.user.email);
    accountPage.innerHTML = `
      ${placed ? `<p class="banner">Order #${placed} is confirmed. We will pack it shortly.</p>` : ""}
      <div class="split">
        <div class="card">
          <h2>${state.user.name}</h2>
          <p class="muted">${state.user.email}</p>
          <button class="btn" id="logoutBtn" type="button">Sign out</button>
        </div>
        <div class="card">
          <h3>Orders</h3>
          ${
            orders.length
              ? orders
                  .map(
                    (o) => `
                <div class="order">
                  <div>
                    <strong>#${o.id}</strong>
                    <p class="muted">${o.address}${o.city ? ", " + o.city : ""}</p>
                  </div>
                  <span>${money(o.total)}</span>
                </div>`
                  )
                  .join("")
              : `<p class="empty">No orders yet.</p>`
          }
        </div>
      </div>`;
  }
}

const blogRoot = document.getElementById("blogRoot");
if (blogRoot) {
  const postId = new URLSearchParams(location.search).get("id");
  const post = POSTS.find((p) => p.id === postId);
  if (post) {
    document.title = `${post.title} | Stuffsus`;
    const heroTitle = document.querySelector(".page-hero h1");
    if (heroTitle) heroTitle.textContent = post.title;
    blogRoot.innerHTML = `
      <article class="prose card">
        <p class="muted">${post.date}</p>
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <a href="blog.html">All stories</a>
      </article>`;
  } else {
    blogRoot.innerHTML = `
      <div class="blog-grid">
        ${POSTS.map(
          (p) => `
          <a class="blog-card" href="blog.html?id=${p.id}">
            <p class="muted">${p.date}</p>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
          </a>`
        ).join("")}
      </div>`;
  }
}
