const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getProducts,
  getProductById,
  addProduct,
  importLegacyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductControllers");

router.get("/", getProducts);

router.post("/import-legacy", importLegacyProducts);

router.post("/", upload.single("image"), addProduct);

router.get("/:id", getProductById);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;