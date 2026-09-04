const mongoose = require("mongoose");

/**
 * One schema, many sections of the site.
 * `type` decides where an item shows up on the public site:
 *   technology | solution | product | project | career | research
 * This is what lets a single admin screen manage every
 * "card style" section (Technologies, Solutions, Products,
 * Projects/Portfolio, Careers, R&D highlights) without duplicating models.
 */
const contentItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["technology", "solution", "product", "project", "career", "research"],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, trim: true }, // e.g. "Sensors", "Robotics", "Drones & UAV", "VTOL"
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String, trim: true }, // long-form / rich text (HTML or Markdown)
    image: { type: String, trim: true }, // Google Drive share link (normalized to a direct URL on save)
    gallery: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    // free-form extra fields per type, e.g. { location: "Bengaluru", employmentType: "Full-time" } for careers
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 }, // controls display order, editable by admin
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

contentItemSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model("ContentItem", contentItemSchema);
