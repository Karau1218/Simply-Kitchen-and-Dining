let cachedProducts = []

async function fetchCart() {
    const response = await fetch("/api/cart")

    if (response.status === 401) {
        return null
    }

    if (!response.ok) {
        throw new Error("Failed to fetch cart")
    }

    return await response.json()
}

function updateCartCount(items, shouldAnimate = false) {
    const cartCount = document.getElementById("cart-count")
    if (!cartCount) return

    const total = items.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = total

    if (shouldAnimate) {
        const cartIcon = document.querySelector(".icon-btn")

        if (cartIcon) {
            cartIcon.classList.remove("cart-bounce")
            void cartIcon.offsetWidth
            cartIcon.classList.add("cart-bounce")
        }
    }
}

async function loadCartCount() {
    try {
        const data = await fetchCart()
        if (!data) return
        updateCartCount(data.items || [], false)
    } catch (error) {
        console.error("Error loading cart count:", error)
    }
}

async function addToCart(productId) {
    try {
        const response = await fetch("/api/cart/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: Number(productId)
            })
        })

        if (response.status === 401) {
            window.location.href = "/login"
            return
        }

        if (!response.ok) {
            throw new Error("Failed to add item")
        }

        const data = await response.json()
        updateCartCount(data.items || [], true)
        renderCartPage(data.items || [], cachedProducts)
    } catch (error) {
        console.error("Error adding to cart:", error)
    }
}

async function decreaseCartItem(productId) {
    try {
        const response = await fetch(`/api/cart/items/${productId}/decrease`, {
            method: "PATCH"
        })

        if (!response.ok) {
            throw new Error("Failed to decrease item")
        }

        const data = await response.json()
        updateCartCount(data.items || [], false)
        renderCartPage(data.items || [], cachedProducts)
    } catch (error) {
        console.error("Error decreasing item:", error)
    }
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/items/${productId}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error("Failed to remove item")
        }

        const data = await response.json()
        updateCartCount(data.items || [], false)
        renderCartPage(data.items || [], cachedProducts)
    } catch (error) {
        console.error("Error removing item:", error)
    }
}

async function clearCart() {
    try {
        const response = await fetch("/api/cart/clear", {
            method: "POST"
        })

        if (!response.ok) {
            throw new Error("Failed to clear cart")
        }

        const data = await response.json()
        updateCartCount(data.items || [], false)
        renderCartPage(data.items || [], cachedProducts)
    } catch (error) {
        console.error("Error clearing cart:", error)
    }
}

async function getProducts() {
    const response = await fetch("/api/products")

    if (!response.ok) {
        throw new Error("Failed to fetch products")
    }

    return await response.json()
}

async function loadCartPage() {
    const cartItemsContainer = document.getElementById("cart-items")
    if (!cartItemsContainer) return

    try {
        const [cartData, productsData] = await Promise.all([
            fetchCart(),
            getProducts()
        ])

        if (!cartData) return

        cachedProducts = productsData.products || productsData || []

        updateCartCount(cartData.items || [], false)
        renderCartPage(cartData.items || [], cachedProducts)
    } catch (error) {
        console.error("Error loading cart page:", error)

        const cartMessage = document.getElementById("cart-message")
        if (cartMessage) {
            cartMessage.textContent = "Could not load cart."
        }
    }
}

// eslint-disable-next-line max-lines-per-function
function renderCartPage(cartItems, products = []) {
    const cartItemsContainer = document.getElementById("cart-items")
    const cartMessage = document.getElementById("cart-message")
    const cartSummary = document.getElementById("cart-summary")
    const cartTotalItems = document.getElementById("cart-total-items")
    const cartSubtotal = document.getElementById("cart-subtotal")

    if (!cartItemsContainer) return

    if (!cartItems.length) {
        cartItemsContainer.innerHTML = ""
        if (cartMessage) {
            cartMessage.textContent = "Your cart is empty."
        }
        if (cartSummary) {
            cartSummary.style.display = "none"
        }
        return
    }

    if (cartMessage) {
        cartMessage.textContent = ""
    }

    const mergedItems = cartItems.map((cartItem) => {
        const product = products.find(
            (p) => Number(p.productId) === Number(cartItem.productId)
        )

        return {
            ...cartItem,
            productName: product ? product.productName : `Product #${cartItem.productId}`,
            price: product ? product.price : 0,
            imageUrl: product ? product.imageUrl : "",
            category: product ? product.category : ""
        }
    })

cartItemsContainer.innerHTML = mergedItems
    .map(
        (item) => `
        <article class="product-card" style="margin-bottom: 1.5rem;">
            <div class="product-img">
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.productName}">` : ""}
            </div>

            <div class="product-info">
                <h3 class="product-name">${item.productName}</h3>
                <p class="product-category">${item.category || ""}</p>
                <p class="price">$${item.price}</p>

                <div class="cart-quantity">
                    <button
                        class="qty-btn decrease-cart-item"
                        data-product-id="${item.productId}"
                    >
                        −
                    </button>

                    <span class="qty-number">${item.quantity}</span>

                    <button
                        class="qty-btn add-to-cart"
                        data-product-id="${item.productId}"
                    >
                        +
                    </button>
                </div>

                <div class="card-actions">
                    <button
                        class="button ghost small remove-cart-item"
                        data-product-id="${item.productId}"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </article>
    `
    )
    .join("")

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const subtotal = mergedItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity), 0)

    if (cartTotalItems) {
        cartTotalItems.textContent = totalItems
    }

    if (cartSubtotal) {
    cartSubtotal.textContent = subtotal.toFixed(2)
    }

    if (cartSummary) {
        cartSummary.style.display = "block"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCartCount()
    loadCartPage()

    const clearCartBtn = document.getElementById("clear-cart-btn")
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", clearCart)
    }
})

document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart")

    if (addButton) {
        event.preventDefault()
        addToCart(addButton.dataset.productId)
        return
    }

    const decreaseButton = event.target.closest(".decrease-cart-item")

    if (decreaseButton) {
        event.preventDefault()
        decreaseCartItem(decreaseButton.dataset.productId)
        return
    }

    const removeButton = event.target.closest(".remove-cart-item")

    if (removeButton) {
        event.preventDefault()
        removeFromCart(removeButton.dataset.productId)
    }
})