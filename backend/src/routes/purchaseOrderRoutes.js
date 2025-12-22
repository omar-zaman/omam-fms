const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrderController");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/", purchaseOrderController.getAllPurchaseOrders);
router.get("/:id", purchaseOrderController.getPurchaseOrderById);
router.post("/", purchaseOrderController.createPurchaseOrder);
router.put("/:id", purchaseOrderController.updatePurchaseOrder);
router.delete("/:id", purchaseOrderController.deletePurchaseOrder);

module.exports = router;

