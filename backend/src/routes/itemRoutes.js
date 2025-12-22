const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);
router.post("/", itemController.createItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;

