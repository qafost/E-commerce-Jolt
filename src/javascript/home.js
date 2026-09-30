const featured = document.getElementById("featuredGrid");
if (featured) {
  featured.innerHTML = PRODUCTS.filter((p) => p.tags.includes("best"))
    .slice(0, 4)
    .map(productCard)
    .join("");
}

const homePosts = document.getElementById("homePosts");
if (homePosts) {
  homePosts.innerHTML = POSTS.map(
    (post) => `
    <a class="blog-card" href="blog.html?id=${post.id}">
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
    </a>`
  ).join("");
}
