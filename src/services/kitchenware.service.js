// services/kitchenware.service.js
import db from "../db.js";

export async function getAllProducts({
  category = "All",
  search = "",
  minPrice,
  maxPrice,
  sort
} = {}) {
  let query = `
    SELECT productId, productName, productDescription, price, category, imageUrl
    FROM products
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== "All") {
    query += " AND category = ?";
    params.push(category);
  }

  if (search) {
    query += " AND (productName LIKE ? OR productDescription LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (minPrice !== undefined && minPrice !== "") {
    query += " AND price >= ?";
    params.push(Number(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    query += " AND price <= ?";
    params.push(Number(maxPrice));
  }

  // safe sorting (avoid SQL injection)
  if (sort === "price") query += " ORDER BY price ASC";
  else if (sort === "price_desc") query += " ORDER BY price DESC";
  else query += " ORDER BY productName ASC";

  const [rows] = await db.query(query, params);
  return rows; // empty array is fine
}