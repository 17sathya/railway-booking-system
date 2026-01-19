const express = require("express");
console.log("✅ trainRoutes loaded");

const Train = require("../models/Train");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("TRAIN ROUTES WORKING");
});

router.get("/search", async (req, res) => {
  const { source, destination } = req.query;
  const trains = await Train.find({ source, destination });
  res.json(trains);
});

router.get("/:trainId/availability", async (req, res) => {
  const { trainId } = req.params;
  const { date, classType } = req.query;

  const train = await Train.findById(trainId);
  if (!train) return res.status(404).json({ message: "Train not found" });

  const classInfo = train.classes.find(c => c.classType === classType);
  if (!classInfo) return res.status(400).json({ message: "Class not found" });

  const bookings = await Booking.find({
    train: trainId,
    journeyDate: new Date(date),
    classType,
    status: "CONFIRMED",
  });

  let bookedSeats = 0;
  bookings.forEach(b => bookedSeats += b.seatNumbers.length);

  res.json({
    totalSeats: classInfo.totalSeats,
    bookedSeats,
    availableSeats: classInfo.totalSeats - bookedSeats
  });
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const train = await Train.create(req.body);
  res.status(201).json(train);
});

router.get("/", async (req, res) => {
  const trains = await Train.find();
  res.json(trains);
});

module.exports = router;
