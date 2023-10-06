const express = require("express");
// const cors = require("cors");

const app = express();

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

app.get("/api/books", (req, res) => {
  const books = [
    {
      userId: "nabs",
      title: "Le Dernier Jour d'un condamné",
      author: "Victor Hugo",
      imageUrl: "",
      year: 1829,
      genre: "Roman",
      ratings: [
        {
          userId: "identifiant mongoDB",
          grade: "5",
        },
      ],
      averageRating: "",
    },
    {
      userId: "nabs",
      title: "Odes et Ballades",
      author: "Victor Hugo",
      imageUrl: "",
      year: 1828,
      genre: "Poésie",
      ratings: [
        {
          userId: "identifiant mongoDB",
          grade: "4",
        },
      ],
      averageRating: "",
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
