const express = require("express");
const Design = require("../models/design");

const router = express.Router();

// Create a new design
router.post("/", async (req, res) => {
  try {
    const newDesign = new Design(req.body);
    const savedDesign = await newDesign.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    res.status(500).json({ error: "Error creating design" });
  }
});

// Get all designs
router.get("/", async (req, res) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching designs" });
  }
});

module.exports = router;
