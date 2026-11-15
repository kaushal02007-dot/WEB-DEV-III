

const express = require("express")
const router = express.Router()

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    lowStockProducts,
    categorySummary
} = require("../controllers/productController")

// Create Product
router.post("/", createProduct)

// Get All Products
router.get("/", getAllProducts)

// Low Stock Report
router.get("/low-stock", lowStockProducts)

// Category Summary
router.get("/category-summary", categorySummary)

// Get Single Product
router.get("/:id", getSingleProduct)

// Update Product
router.put("/:id", updateProduct)

// Delete Product
router.delete("/:id", deleteProduct)

// Restock Product
router.patch("/:id/restock", restockProduct)

// Sell Product
router.patch("/:id/sell", sellProduct)

module.exports = router
