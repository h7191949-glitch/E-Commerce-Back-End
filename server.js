
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
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce Backend is Running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
