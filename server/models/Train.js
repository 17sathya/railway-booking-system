const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  classType: String, // Sleeper, AC
  totalSeats: Number,
});

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true,
  },
  trainName: String,
  source: String,
  destination: String,
  departureTime: String,
  arrivalTime: String,
  classes: [classSchema],
});

module.exports = mongoose.model("Train", trainSchema);
