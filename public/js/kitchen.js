// Grab the elements from your products.ejs
const searchInput = document.getElementById('product-search');
const categorySelect = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-filter');
const productsGrid = document.getElementById('products-grid'); // The ID of your products container
const countSpan = document.getElementById('product-count');

async function updateFilters() {
    const search = searchInput.value;
    const category = categorySelect.value;
    const sort = sortSelect.value;

    // The REST call - Using the keys your controller expects
    const response = await fetch(`/api/products?search=${search}&category=${category}&sort=${sort}`);
    const products = await response.json();

    // Update the "Showing X products" text
    if (countSpan) countSpan.textContent = products.length;

    // Clear and rebuild the product grid
    productsGrid.innerHTML = products.map(p => `
        <article class="product-card">
            <div class="product-img">
                <img src="${p.imageUrl}" alt="${p.productName}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${p.productName}</h3>
                <p class="product-desc">${p.productDescription}</p>
                <p class="price">$${p.price}</p>
                <div class="card-actions">
                    <button class="button primary small">Add to Cart</button>
                    <a href="/products/${p.productId}" class="details-link">View Details</a>
                </div>
            </div>
        </article>
    `).join('');
}

// Add listeners so the filter runs automatically
searchInput.addEventListener('input', updateFilters);
categorySelect.addEventListener('change', updateFilters);
sortSelect.addEventListener('change', updateFilters);