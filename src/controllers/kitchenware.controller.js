import { getAllProducts, getProductById } from "../services/kitchenware.service.js";

export function showHome(req, res) {
    return res.render("page");
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
    const products = await getAllProducts(); // still works
    return res.render("products", { products });
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