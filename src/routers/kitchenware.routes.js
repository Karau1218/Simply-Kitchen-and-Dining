import { Router } from "express"
import { showHome, showProducts, showProductDetail, getApiProducts, showRegister, showLogin } from "../controllers/kitchenware.controller.js"

const router = Router()

router.get("/", showHome)
router.get("/register", showRegister)
router.get("/login", showLogin)
router.get("/products", showProducts)
router.get("/api/products", getApiProducts)
router.get("/products/:id", showProductDetail)

export default router