const searchInput = document.getElementById("product-search");
const categorySelect = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort-filter");
const clearButton = document.getElementById("clear-filters");
const productsGrid = document.getElementById("products-grid");
const countSpan = document.getElementById("product-count");

async function updateFilters() {
    try {
        const params = new URLSearchParams({
            search: searchInput.value.trim(),
            category: categorySelect.value,
            sort: sortSelect.value
        });

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const products = await response.json();

        countSpan.textContent = products.length;

        if (products.length === 0) {
            productsGrid.innerHTML = `<p>No products match your filters.</p>`;
            return;
        }

        productsGrid.innerHTML = products.map(product => `
    <article class="product-card">
        <div class="product-img">
          <img src="${product.imageUrl}" alt="${product.productName}">
        </div>

        <div class="product-info">
          <h3 class="product-name">${product.productName}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-desc">${product.productDescription}</p>
          <p class="price">$${product.price}</p>

          <div class="card-actions">
            <button class="button primary small">Add to Cart</button>
            <a href="/products/${product.productId}" class="details-link">View Details</a>
          </div>
        </div>
      </article>
    `).join("");
    } catch (error) {
        console.error("Filter error:", error);
        productsGrid.innerHTML = `<p>Sorry, something went wrong while loading products.</p>`;
    }
}

searchInput.addEventListener("input", updateFilters);
categorySelect.addEventListener("change", updateFilters);
sortSelect.addEventListener("change", updateFilters);

clearButton.addEventListener("click", async (event) => {
    event.preventDefault();

    searchInput.value = "";
    categorySelect.value = "All";
    sortSelect.value = "";

    await updateFilters();
});