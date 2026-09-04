const ContentItem = require("../models/ContentItem");
const { toDirectImageUrl } = require("../utils/driveImage");

const VALID_TYPES = ["technology", "solution", "product", "project", "career", "research"];

// Normalizes any Google Drive share link in image/gallery fields into a
// direct, embeddable URL before it's saved to MongoDB.
function normalizeImages(data) {
  if (data.image) data.image = toDirectImageUrl(data.image);
  if (Array.isArray(data.gallery)) {
    data.gallery = data.gallery.map((url) => toDirectImageUrl(url));
  }
  return data;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// PUBLIC: list items, optionally filtered by type/category, published only
exports.getPublicItems = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = { published: true };
    if (type) {
      if (!VALID_TYPES.includes(type)) return res.status(400).json({ message: "Invalid type" });
      filter.type = type;
    }
    if (category) filter.category = category;

    const items = await ContentItem.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch content", error: err.message });
  }
};

// PUBLIC: single item by slug
exports.getPublicItemBySlug = async (req, res) => {
  try {
    const item = await ContentItem.findOne({ slug: req.params.slug, published: true });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch item", error: err.message });
  }
};

// ADMIN: list everything, including unpublished
exports.getAllItems = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const items = await ContentItem.find(filter).sort({ type: 1, order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch content", error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await ContentItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch item", error: err.message });
  }
};

// ADMIN: create
exports.createItem = async (req, res) => {
  try {
    const data = normalizeImages({ ...req.body });
    if (!VALID_TYPES.includes(data.type)) {
      return res.status(400).json({ message: `type must be one of: ${VALID_TYPES.join(", ")}` });
    }
    if (!data.slug && data.title) data.slug = slugify(data.title);
    else if (data.slug) data.slug = slugify(data.slug);

    const item = await ContentItem.create(data);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An item with that slug already exists" });
    }
    res.status(400).json({ message: "Failed to create item", error: err.message });
  }
};

// ADMIN: update
exports.updateItem = async (req, res) => {
  try {
    const data = normalizeImages({ ...req.body });
    if (data.slug) data.slug = slugify(data.slug);

    const item = await ContentItem.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An item with that slug already exists" });
    }
    res.status(400).json({ message: "Failed to update item", error: err.message });
  }
};

// ADMIN: delete
exports.deleteItem = async (req, res) => {
  try {
    const item = await ContentItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
};

// ADMIN: reorder a batch of items in one request: [{id, order}, ...]
exports.reorderItems = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) return res.status(400).json({ message: "items must be an array" });

    await Promise.all(
      items.map(({ id, order }) => ContentItem.findByIdAndUpdate(id, { order }))
    );
    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reorder", error: err.message });
  }
};
