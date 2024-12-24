const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Créer une nouvelle réservation
router.post("/", async (req, res) => {
  try {
    console.log("Données reçues:", req.body); // Pour déboguer
    const booking = new Booking({
      departure: req.body.departure,
      arrival: req.body.arrival,
      date: req.body.date,
      time: req.body.time,
      passengers: req.body.passengers,
      luggage: req.body.luggage,
      vehicleType: req.body.vehicleType,
      price: req.body.price,
      customerInfo: {
        firstName: req.body.customerInfo.firstName,
        lastName: req.body.customerInfo.lastName,
        email: req.body.customerInfo.email,
        phone: req.body.customerInfo.phone,
        specialRequests: req.body.customerInfo.specialRequests,
      },
      status: req.body.status || "pending",
      createdAt: req.body.createdAt || new Date(),
    });

    const savedBooking = await booking.save();
    console.log("Réservation sauvegardée:", savedBooking); // Pour déboguer
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error); // Pour déboguer
    res.status(400).json({ message: error.message });
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
