const express = require("express");
const router = express.Router();
const {
  getAllSections,
  getSectionByKey,
  upsertSection,
  deleteSection,
} = require("../controllers/sectionController");
const { requireAdmin } = require("../middleware/auth");

// Public
router.get("/", getAllSections);
router.get("/:key", getSectionByKey);

// Admin
router.put("/admin/:key", requireAdmin, upsertSection);
router.delete("/admin/:key", requireAdmin, deleteSection);

module.exports = router;
