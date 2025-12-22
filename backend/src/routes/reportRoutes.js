const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/sales-orders", reportController.getSalesOrderReport);
router.get("/purchase-orders", reportController.getPurchaseOrderReport);
router.get("/customer-payments", reportController.getCustomerPaymentReport);

module.exports = router;

