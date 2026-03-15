import bcrypt from "bcrypt";
import { getAllProducts, getProductById, getBestSellers, getUserByEmail, createUser } from "../services/kitchenware.service.js"

export async function showHome(req, res) {
  try {
    const bestSellers = await getBestSellers()
    return res.render("page", { bestSellers })
  } catch (err) {
    console.error(err)
    return res.status(500).send("Database error")
  }
}

// ApI controller
export async function getApiProducts(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query

    const products = await getAllProducts({
      category,
      search,
      minPrice,
      maxPrice,
      sort
    })

    return res.status(200).json(products)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "API Database error" })
  }
}

export async function showProducts(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query

    const products = await getAllProducts({
      category,
      search,
      minPrice,
      maxPrice,
      sort
    })

    return res.render("products", {
      products,
      selectedCategory: category || "All",
      selectedSort: sort || "",
      searchTerm: search || ""
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send("Database error")
  }
}

export async function showProductDetail(req, res) {
  try {
    const product = await getProductById(req.params.id)

    if (!product)
      return res.status(404).send("Product not found")
    return res.render("product-detail", { product })
  } catch (err) {
    console.error(err)
    return res.status(500).send("Internal Server Error")
  }
}

export function showRegister(req, res) {
  return res.render("register")
}

export function showLogin(req, res) {
  return res.render("login")
}

export async function registerUser(req, res) {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await createUser(email, hashedPassword);

        req.session.userId = userId; 
        
        return res.redirect("/products");
    } catch (err) {
        console.error("Registration error:", err);
        return res.render("register", { error: "Email already registered or registration failed." });
    }
}


export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password_hash);
            
            if (isMatch) {
                // SUCCESS: Create session
                req.session.userId = user.userId;
                return res.redirect("/products");
            }
        }
        
        // If we get here, login failed. Re-render with error message.
        return res.render("login", { error: "Invalid email or password" });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
}

export function logoutUser(req, res) {

req.session.destroy((err) => {
        if (err) console.error("Logout error:", err);
        return res.redirect("/"); 
    });
}

export const showCart = (req, res) => {
  res.render("cart", {
    title: "Shopping Cart",
    user: req.session.user || null
  })
}

