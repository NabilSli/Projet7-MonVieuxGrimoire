const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose");
const book = require("./models/Book");

mongoose
  .connect(
    "mongodb+srv://nabsli:nabsli@cluster0.34z1lvz.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
const booksRoutes = require("./routes/books");

app.use(express.json());
// app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/books", booksRoutes);

module.exports = app;
