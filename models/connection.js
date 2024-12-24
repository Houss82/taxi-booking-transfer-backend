const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://mansourhoussem1982:0LshwJSY0rc7rFQ1@cluster0.5lywams.mongodb.net/taxi-nice-airport";

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
