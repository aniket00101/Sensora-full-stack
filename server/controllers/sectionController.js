const SiteSection = require("../models/SiteSection");
const { toDirectImageUrl } = require("../utils/driveImage");

// PUBLIC: get all sections (frontend picks what it needs by key)
exports.getAllSections = async (req, res) => {
  try {
    const sections = await SiteSection.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sections", error: err.message });
  }
};

// PUBLIC: get one section by key
exports.getSectionByKey = async (req, res) => {
  try {
    const section = await SiteSection.findOne({ key: req.params.key });
    if (!section) return res.status(404).json({ message: "Not found" });
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch section", error: err.message });
  }
};

// ADMIN: create or update a section by key (upsert) - keeps the admin UI simple
exports.upsertSection = async (req, res) => {
  try {
    const { key } = req.params;
    const data = { ...req.body, key };
    if (data.image) data.image = toDirectImageUrl(data.image);
    const section = await SiteSection.findOneAndUpdate({ key }, data, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    res.json(section);
  } catch (err) {
    res.status(400).json({ message: "Failed to save section", error: err.message });
  }
};

// ADMIN: delete a section
exports.deleteSection = async (req, res) => {
  try {
    await SiteSection.findOneAndDelete({ key: req.params.key });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete section", error: err.message });
  }
};
