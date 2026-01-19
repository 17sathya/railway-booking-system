const express = require("express");
const Train = require("../models/Train");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @route   POST /api/trains
 * @desc    Add new train (Admin only)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const train = await Train.create(req.body);
    res.status(201).json(train);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/trains
 * @desc    Get all trains
 */
router.get("/", async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
