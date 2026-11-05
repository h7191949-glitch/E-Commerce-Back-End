
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/ProductRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const customerRoutes = require("./routes/CustomerRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Database connection
let dbPromise;

app.use(async (req, res, next) => {
  try {
    if (!dbPromise) {
      dbPromise = connectDB().catch((error) => {
        dbPromise = null;
        throw error;
      });
    }

    await dbPromise;
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// API routes
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce Backend is Running!");
});

// Local development only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
