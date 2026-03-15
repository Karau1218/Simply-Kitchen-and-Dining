import { Router } from "express";
import { getCart, addCartItem, removeCartItem, clearCart, decreaseCartItem } from "../controllers/cart.controller.js";
import { requireAuthApi } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/api/cart", requireAuthApi, getCart);

router.post("/api/cart/items", requireAuthApi, addCartItem);

router.delete("/api/cart/items/:productId", requireAuthApi, removeCartItem);

router.post("/api/cart/clear", requireAuthApi, clearCart);

router.patch("/api/cart/items/:productId/decrease", requireAuthApi, decreaseCartItem);

export default router;
