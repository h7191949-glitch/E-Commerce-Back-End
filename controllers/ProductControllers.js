const Product = require("../models/Products");
const cloudinary = require("../config/cloudinary");

// CLOUDINARY UPLOAD HELPER
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      status,
    } = req.body;

    let image = "";
    let imagePublicId = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      image = uploadedImage.secure_url;
      imagePublicId = uploadedImage.public_id;
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      image,
      imagePublicId,
      stock: Number(stock || 0),
      status: status || "Active",
      isNewArrival: true,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// IMPORT OLD E-COMMERCE PRODUCTS
const importLegacyProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        message: "Products must be an array",
      });
    }

    const operations = products.map((product) => ({
      updateOne: {
        filter: {
          name: product.name,
          category: product.category,
        },
        update: {
          $setOnInsert: {
            name: product.name,
            description: product.description || "",
            price: Number(product.price),
            originalPrice: product.originalPrice ?? null,
            category: product.category,
            image: product.images?.[0] || "",
            imagePublicId: "",
            stock: 0,
            rating: product.rating || 0,
            ratingCount: product.ratingCount || 0,
            colors: product.colors || [],
            sizes: product.sizes || [],
            reviews: product.reviews || [],
            isNewArrival: false,
            status: "Active",
          },
        },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(operations);

    res.status(200).json({
      message: "Old products imported successfully",
      imported: result.upsertedCount,
      alreadyExisted: result.matchedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      originalPrice: req.body.originalPrice
        ? Number(req.body.originalPrice)
        : null,
      category: req.body.category,
      stock: Number(req.body.stock || 0),
      status: req.body.status || existingProduct.status,
    };

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      updateData.image = uploadedImage.secure_url;
      updateData.imagePublicId = uploadedImage.public_id;

      // Remove previous Cloudinary image, if one exists
      if (existingProduct.imagePublicId) {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  importLegacyProducts,
  updateProduct,
  deleteProduct,
};