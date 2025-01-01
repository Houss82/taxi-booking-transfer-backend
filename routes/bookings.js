const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Créer une nouvelle réservation
router.post("/", async (req, res) => {
  try {
    // Validation du type de réservation
    if (
      !req.body.bookingType ||
      !["book", "quote"].includes(req.body.bookingType.toLowerCase())
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing bookingType" });
    }

    const bookingData = {
      departure: req.body.departure,
      arrival: req.body.arrival,
      date: new Date(req.body.date),
      time: req.body.time,
      passengers: Number(req.body.passengers),
      luggage: Number(req.body.luggage),
      vehicleType: req.body.vehicleType,
      bookingType: req.body.bookingType.toLowerCase(),
      price: Number(req.body.price) || 0,
      customerInfo: {
        firstName: req.body.customerInfo.firstName,
        lastName: req.body.customerInfo.lastName,
        email: req.body.customerInfo.email,
        phone: req.body.customerInfo.phone,
        specialRequests: req.body.customerInfo.specialRequests || "",
      },
      status: req.body.status || "pending",
    };

    console.log("Vérification des données avant sauvegarde :", bookingData);

    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Erreur complète:", error);
    res.status(400).json({
      message: "Erreur lors de la création de la réservation",
      error: error.message,
      details: error.errors,
    });
  }
});

// Obtenir toutes les réservations
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir une réservation spécifique
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: "Réservation non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour une réservation
router.patch("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Annuler une réservation
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
