import { Router } from "express"
import {
    showHome, 
    showProducts, 
    showProductDetail, 
    getApiProducts, 
    showRegister, 
    showLogin, 
    loginUser,
    logoutUser,
    registerUser, 
    showCart
} from "../controllers/kitchenware.controller.js"

import { requireAuthPage, requireAuthApi } from "../middleware/auth.middleware.js"


const router = Router()

router.get("/", showHome)

router.get("/register", showRegister)
router.get("/login", showLogin)

router.get("/products", requireAuthPage, showProducts)
router.get("/products/:id", requireAuthPage, showProductDetail)
router.get("/cart", requireAuthPage, showCart);

// router.get("/api/products", requireAuthPage, getApiProducts)


// protected API
router.get("/api/products", requireAuthApi, getApiProducts)

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

export default router