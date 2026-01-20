const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ PNR generator
const generatePNR = () => {
  return "PNR" + Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * @route   POST /api/bookings
 * @desc    Book a ticket
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { trainId, journeyDate, classType, seatCount } = req.body;

    if (!trainId || !journeyDate || !classType || !seatCount) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    const classInfo = train.classes.find(
      (c) => c.classType === classType
    );
    if (!classInfo) {
      return res.status(400).json({ message: "Class not found" });
    }

    const bookings = await Booking.find({
      train: trainId,
      journeyDate: new Date(journeyDate),
      classType,
      status: "CONFIRMED",
    });

    let bookedSeats = [];
    bookings.forEach((b) => {
      bookedSeats = bookedSeats.concat(b.seatNumbers);
    });

    const availableSeats =
      classInfo.totalSeats - bookedSeats.length;

    if (availableSeats < seatCount) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    // Seat allocation
    let assignedSeats = [];
    let seatNo = 1;

    while (assignedSeats.length < seatCount) {
      if (!bookedSeats.includes(seatNo)) {
        assignedSeats.push(seatNo);
      }
      seatNo++;
    }

    const booking = await Booking.create({
      user: req.user.id,
      train: trainId,
      journeyDate,
      classType,
      seatNumbers: assignedSeats,
      PNR: generatePNR(),
    });

    res.status(201).json({
      message: "Ticket booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
