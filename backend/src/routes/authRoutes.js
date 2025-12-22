const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Protected route
router.get("/me", auth, authController.getCurrentUser);

module.exports = router;

