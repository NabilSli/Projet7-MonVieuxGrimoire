const { log } = require("console");
const Book = require("../models/book");
const fs = require("fs");
const { ObjectId } = require("mongodb");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  console.log("auth", req.auth);
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(200).json({ message: "objet enregistré" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisée" });
      } else {
        if (req.file && book.imageUrl) {
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.error(
                "Erreur lors de la suppression de l'ancienne image :",
                err
              );
            }
          });
        }

        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.i }
        )
          .then(() => res.status(200).json({ message: "Livre modifié" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "not authorized" });
      } else {
        if (book.imageUrl) {
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.error("Erreur lors de la suppression de l'image :", err);
            }
          });
        }

        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0;

  const sumOfRatings = ratings.reduce((acc, rating) => acc + rating.grade, 0);
  const average = sumOfRatings / ratings.length;

  return Math.round(average);
}

exports.addRating = async (req, res, next) => {
  try {
    const grade = req.body.rating;
    const bookId = req.params.id;

    if (!grade || (grade <= 0 && grade > 5) || !bookId) {
      return res
        .status(400)
        .json({ error: "veuillez renseigner tout les parametres" });
    }

    try {
      const book = await Book.findOne({ _id: bookId });

      let isAlreadyRated = false;

      book.ratings.forEach((rating) => {
        if (
          rating._id.toString().toLowerCase() === req.auth.userId.toLowerCase()
        ) {
          isAlreadyRated = true;
        }
      });

      if (isAlreadyRated) {
        return res.status(400).json({ error: "vous avez deja noter ce livre" });
      }

      await book.updateOne({
        ratings: [...book.ratings, { userId: req.auth.userId, grade: grade }],
      });

      const newAverageRating = calculateAverageRating([
        ...book.ratings,
        { grade },
      ]);

      const updatedBook = await Book.findByIdAndUpdate(bookId, {
        averageRating: newAverageRating,
      });

      return res.status(200).json(updatedBook);
    } catch (error) {
      return res.status(404).json({ error: "Le livre est introuvable" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getBestRating = async (req, res, next) => {
  try {
    const bestRatedBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);

    res.status(200).json(bestRatedBooks);
  } catch (error) {
    res.status(500).json({
      error:
        "Une erreur est survenue lors de la récupération des livres les mieux notés.",
    });
  }
};
