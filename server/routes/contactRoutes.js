const express = require("express");
const router = express.Router();
const {
  submitContact,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} = require("../controllers/contactController");
const { requireAdmin } = require("../middleware/auth");

// Public
router.post("/", submitContact);

// Admin
router.get("/admin/all", requireAdmin, getSubmissions);
router.put("/admin/:id/status", requireAdmin, updateSubmissionStatus);
router.delete("/admin/:id", requireAdmin, deleteSubmission);

module.exports = router;
