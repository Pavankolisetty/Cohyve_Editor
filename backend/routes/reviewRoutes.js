const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// Add a review comment to a design
router.post("/:designId", async (req, res) => {
  console.log("Received request to add review:", req.body); // Debug log
  try {
    const { designId } = req.params;
    const { text, position } = req.body;

    // Log the received data
    console.log("Design ID:", designId);
    console.log("Text:", text);
    console.log("Position:", position);

    let review = await Review.findOne({ designId });
    if (!review) {
      review = new Review({ designId, comments: [] });
    }

    review.comments.push({ text, position, status: "pending", createdAt: new Date() });
    await review.save();

    // Emit new comment to all connected clients
    const io = req.app.get('socketio');
    io.emit('newComment', {
      designId,
      text,
      position,
      status: "pending",
      createdAt: new Date()
    });

    res.status(201).json(review); // Send success response
  } catch (error) {
    console.error("Error adding review:", error); // Debug log
    res.status(500).json({ error: "Error adding review", details: error.message });
  }
});

// Get all reviews for a specific design
router.get("/:designId", async (req, res) => {
  try {
    const { designId } = req.params;
    const review = await Review.findOne({ designId }).populate("designId");

    if (!review) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews", details: error.message });
  }
});

module.exports = router;