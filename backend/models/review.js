const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  position: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewSchema = new mongoose.Schema({
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Design",
    required: true,
  },
  comments: [CommentSchema],
});

module.exports = mongoose.model("Review", ReviewSchema);