require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Importation de la fonction de connexion
const connectDB = require("./models/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const bookingRoutes = require("./routes/bookings");
const articlesRoutes = require("./routes/articles");

var app = express();

// Connexion à MongoDB
connectDB();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuration CORS avec options
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://www.taxi-niceairport.com",
    "https://taxi-niceairport.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bookings", bookingRoutes);
app.use("/articles", articlesRoutes);
// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
