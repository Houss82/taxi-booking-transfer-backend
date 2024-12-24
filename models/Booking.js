const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  departure: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
  },
  luggage: {
    type: Number,
    required: true,
    min: 0,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["Standard", "Business", "Business Van"],
  },
  price: {
    type: Number,
    required: true,
  },
  bookingType: {
    type: String,
    required: true,
    enum: ["book", "quote"],
  },
  customerInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    specialRequests: String,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
