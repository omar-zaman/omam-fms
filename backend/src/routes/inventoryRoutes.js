const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/", inventoryController.getAllInventory);
router.get("/item/:itemId", inventoryController.getInventoryByItemId);

module.exports = router;

