const express = require("express");
const router = express.Router();
const {
  getPublicItems,
  getPublicItemBySlug,
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
} = require("../controllers/contentController");
const { requireAdmin } = require("../middleware/auth");

// Public
router.get("/", getPublicItems); // ?type=technology&category=Robotics
router.get("/slug/:slug", getPublicItemBySlug);

// Admin
router.get("/admin/all", requireAdmin, getAllItems);
router.get("/admin/:id", requireAdmin, getItemById);
router.post("/admin", requireAdmin, createItem);
router.put("/admin/:id", requireAdmin, updateItem);
router.delete("/admin/:id", requireAdmin, deleteItem);
router.post("/admin/reorder", requireAdmin, reorderItems);

module.exports = router;
