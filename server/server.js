require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const contactRoutes = require("./routes/contactRoutes");

const dns = require("dns");

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])

const app = express();

// On Vercel, this file is loaded fresh (and re-used across warm invocations)
// as a serverless function instead of a long-running process, so we connect
// lazily on the first request rather than at module load time.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes); // technologies, solutions, products, projects, careers
app.use("/api/sections", sectionRoutes); // hero / about / pitch text blocks
app.use("/api/contact", contactRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Only bind to a port when run directly (local dev / a traditional host like
// Render/Railway). On Vercel, the exported `app` is used as the serverless
// function handler instead, so this block is skipped.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Sensora API running on port ${PORT}`));
}

module.exports = app;
