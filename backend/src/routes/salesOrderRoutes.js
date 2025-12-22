const express = require("express");
const router = express.Router();
const salesOrderController = require("../controllers/salesOrderController");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/", salesOrderController.getAllSalesOrders);
router.get("/:id", salesOrderController.getSalesOrderById);
router.post("/", salesOrderController.createSalesOrder);
router.put("/:id", salesOrderController.updateSalesOrder);
router.delete("/:id", salesOrderController.deleteSalesOrder);

module.exports = router;

