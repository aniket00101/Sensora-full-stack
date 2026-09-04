const express = require("express");
const router = express.Router();
const { login, me, changePassword } = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", requireAdmin, me);
router.post("/change-password", requireAdmin, changePassword);

module.exports = router;
