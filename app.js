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

app.post("api/books", (req, res, next) => {
  const book = new Book({ ...req.body });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.put("api/books", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("api/books", (req, res, next) => {
  book
    .deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé" }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/books", (req, res, next) => {
  book
    .find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
  // const books = [
  // {
  //   userId: "nabs",
  //   title: "Le Dernier Jour d'un condamné",
  //   author: "Victor Hugo",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/HugoLastDayCondemnedMan.jpg/250px-HugoLastDayCondemnedMan.jpg",
  //   year: 1829,
  //   genre: "Roman",
  //   ratings: [
  //     {
  //       userId: "identifiant mongoDB",
  //       grade: "5",
  //     },
  //   ],
  //   averageRating: "5",
  // },
  // {
  //   userId: "nabs",
  //   title: "Odes et Ballades",
  //   author: "Victor Hugo",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/HugoOdesBallades.jpg/250px-HugoOdesBallades.jpg",
  //   year: 1828,
  //   genre: "Poésie",
  //   ratings: [
  //     {
  //       userId: "identifiant mongoDB",
  //       grade: "4",
  //     },
  //   ],
  //   averageRating: "2",
  // },
  // ];
});

module.exports = app;
