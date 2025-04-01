const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// Route to get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new comment
router.post("/", async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    position: req.body.position,
    status: req.body.status,
    createdAt: req.body.createdAt,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update a comment's status
router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.status = req.body.status;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;