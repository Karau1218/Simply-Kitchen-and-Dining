import { getAllProducts, getProductById, getBestSellers } from "../services/kitchenware.service.js";

export async function showHome(req, res) {
  try {
    const bestSellers = await getBestSellers();
    return res.render("page", { bestSellers });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Database error");
  }
}

// ApI controller
export async function getApiProducts(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const products = await getAllProducts({
      category,
      search,
      minPrice,
      maxPrice,
      sort
    });

    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "API Database error" });
  }
}

export async function showProducts(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const products = await getAllProducts({
      category,
      search,
      minPrice,
      maxPrice,
      sort
    });

    return res.render("products", {
      products,
      selectedCategory: category || "All",
      selectedSort: sort || "",
      searchTerm: search || ""
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Database error");
  }
}

export async function showProductDetail(req, res) {
  try {
    const product = await getProductById(req.params.id);

    if (!product)
    return res.status(404).send("Product not found");
    return res.render("product-detail", { product });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}