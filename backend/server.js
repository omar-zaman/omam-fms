require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/items", require("./src/routes/itemRoutes"));
app.use("/api/materials", require("./src/routes/materialRoutes"));
app.use("/api/suppliers", require("./src/routes/supplierRoutes"));
app.use("/api/customers", require("./src/routes/customerRoutes"));
app.use("/api/sales-orders", require("./src/routes/salesOrderRoutes"));
app.use("/api/purchase-orders", require("./src/routes/purchaseOrderRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));
app.use("/api/inventory", require("./src/routes/inventoryRoutes"));
app.use("/api/reports", require("./src/routes/reportRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware (must be last)
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

