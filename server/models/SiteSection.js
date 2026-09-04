const mongoose = require("mongoose");

/**
 * Editable text/image blocks that aren't lists of cards -
 * e.g. the homepage hero, the About section, the "Custom Technology
 * Development" pitch. Identified by a unique `key` the frontend
 * requests by name (e.g. "home_hero", "about_company").
 */
const siteSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    body: { type: String, trim: true },
    image: { type: String, trim: true }, // Google Drive share link (normalized to a direct URL on save)
    buttons: [
      {
        label: { type: String, trim: true },
        link: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSection", siteSectionSchema);
