const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connecté avec succès 👍");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
