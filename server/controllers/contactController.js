const ContactSubmission = require("../models/ContactSubmission");

// PUBLIC: submit the "Build With Sensora" form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, company, projectType, message } = req.body;
    if (!name || !email || !projectType || !message) {
      return res.status(400).json({ message: "name, email, projectType and message are required" });
    }
    const submission = await ContactSubmission.create({ name, email, company, projectType, message });
    res.status(201).json({ message: "Thanks — we'll be in touch.", id: submission._id });
  } catch (err) {
    res.status(400).json({ message: "Failed to submit", error: err.message });
  }
};

// ADMIN: list submissions
exports.getSubmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const submissions = await ContactSubmission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
};

// ADMIN: update status (new/read/archived)
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "archived"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: "Not found" });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
};
