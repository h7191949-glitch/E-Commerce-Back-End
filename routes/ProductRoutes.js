
const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductControllers");

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// ADD product
router.post("/", addProduct);

// UPDATE product
router.put("/:id", updateProduct);

// DELETE product
router.delete("/:id", deleteProduct);

module.exports = router;
