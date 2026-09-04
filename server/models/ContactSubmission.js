const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    projectType: {
      type: String,
      enum: [
        "Sensor Development",
        "Robotics",
        "Drone/VTOL",
        "Medical Technology",
        "Industrial Solution",
        "R&D Collaboration",
        "Other Custom Development",
      ],
      required: true,
    },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read", "archived"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactSubmission", contactSubmissionSchema);
