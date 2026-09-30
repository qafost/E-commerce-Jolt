const id = new URLSearchParams(location.search).get("id");
const product = productById(id);
const root = document.getElementById("productPage");

if (!product) {
  root.innerHTML = `<p class="empty">Product not found. <a href="shop.html">Back to shop</a></p>`;
} else {
  document.title = `${product.name} | Stuffsus`;
  const heroTitle = document.querySelector(".page-hero h1");
  if (heroTitle) heroTitle.textContent = product.name;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  root.innerHTML = `
    <div class="detail-grid">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <p class="muted">${product.category} · ${product.stock} in stock</p>
        <h2>${product.name}</h2>
        <strong class="price-lg">${money(product.price)}${product.compareAt ? ` <s>${money(product.compareAt)}</s>` : ""}</strong>
        <p>${product.description}</p>
        <div class="detail-actions">
          <label>Qty <input id="buyQty" type="number" min="1" max="${product.stock}" value="1"></label>
          <button class="btn" type="button" id="buyBtn">Add to basket</button>
        </div>
      </div>
    </div>
    <h3 class="related-title">You might also like</h3>
    <div class="product-grid">${related.map(productCard).join("")}</div>`;
  document.getElementById("buyBtn").addEventListener("click", () => {
    addToCart(product.id, Number(document.getElementById("buyQty").value || 1));
  });
}
