import db from "../db.js";

export async function getAllProducts({
  category = "",
  search = "",
  minPrice,
  maxPrice,
  sort = "featured"
} = {}) {
  let query = `
    SELECT productId, productName, productDescription, price, category, imageUrl
    FROM products
    WHERE 1=1
  `;
  const params = [];

  if (category) {
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

  if (sort === "price-asc") query += " ORDER BY price ASC";
  else if (sort === "price_desc") query += " ORDER BY price DESC";
  else query += " ORDER BY productName ASC";

  const [rows] = await db.query(query, params);
  return rows;
}

export async function getProductById(id) {
  const [rows] = await db.query(
    `SELECT productId, productName, productDescription, price, category, imageUrl
     FROM products
     WHERE productId = ?`,
    [id]
  );

  return rows[0] || null;
}