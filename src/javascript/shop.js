function renderCategories() {
  const list = document.getElementById("categoryList");
  if (!list) return;
  list.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="category-chip ${state.category === c.id ? "active" : ""}" data-category="${c.id}" type="button">
      <img src="${c.icon}" alt="">
      <span>${c.name}</span>
    </button>`
  ).join("");
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("resultCount");
  if (!grid) return;
  const list = filteredProducts();
  if (count) count.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
  grid.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<p class="empty">No products match that search.</p>`;
}

const params = new URLSearchParams(location.search);
if (params.get("cat")) state.category = params.get("cat");
if (params.get("q")) state.query = params.get("q");

const searchInput = document.getElementById("searchInput");
if (searchInput) searchInput.value = state.query;

document.getElementById("categoryList")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  state.category = btn.dataset.category;
  renderCategories();
  renderProducts();
});

document.getElementById("searchForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  state.query = searchInput.value;
  renderProducts();
});

searchInput?.addEventListener("input", () => {
  state.query = searchInput.value;
  renderProducts();
});

document.getElementById("sortSelect")?.addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});

renderCategories();
renderProducts();
