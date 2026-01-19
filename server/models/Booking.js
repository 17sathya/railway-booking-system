const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
    },
    journeyDate: {
      type: Date,
      required: true,
    },
    classType: String,
    seatNumbers: [Number],
    PNR: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
