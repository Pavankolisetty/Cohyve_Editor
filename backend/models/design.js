const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  elements: { type: Array, default: [] }, // Stores design elements like text, images, etc.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Design", DesignSchema);
