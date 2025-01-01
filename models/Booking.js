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
  bookingType: {
    type: String,
    required: [true, "Le type de réservation est requis"],
    enum: {
      values: ["book", "quote"],
      message: "Le type de réservation doit être 'book' ou 'quote'",
    },
    default: "book",
  },
  price: {
    type: Number,
    required: true,
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

// Middleware pour le debug
bookingSchema.pre("save", function (next) {
  console.log("Pre-save booking data:", this.toObject());
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
