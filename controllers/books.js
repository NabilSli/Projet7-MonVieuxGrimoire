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
        const filename = book.imageUrl.split("/image")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(res.status(200).json({ message: "Objet suprimé" }))
            .catch((error) => res.status(401).json({ error }));
        });
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
  return sumOfRatings / ratings.length;
}

exports.addRating = async (req, res, next) => {
  try {
    const grade = req.body.rating;
    const bookId = req.params.id;

    console.log(req.params);
    if (!grade || (grade <= 0 && grade > 5) || !bookId) {
      return res
        .status(400)
        .json({ error: "veuillez renseigner tout les parametres" });
    }
    Book.findOne({ _id: bookId })
      .then(async (book) => {
        let isAlreadyRated = false;

        await book.ratings.map((rating) => {
          console.log(Boolean(rating.userId.toString() === req.auth.userId));
          if (
            rating.userId.toString().toLowerCase() ===
            req.auth.userId.toLowerCase()
          ) {
            isAlreadyRated = true;
          }
        });

        if (isAlreadyRated) {
          return res
            .status(400)
            .json({ error: "vous avez deja noter ce livre" });
        }

        const updatedBook = await book.updateOne({
          ratings: [...book.ratings, { userId: req.auth.userId, grade: grade }],
        });
        console.log(updatedBook);
        const newAverageRating = calculateAverageRating([
          ...book.ratings,
          { grade },
        ]);
        await Book.findByIdAndUpdate(bookId, {
          averageRating: newAverageRating,
        });
        return res
          .status(200)
          .json({ message: "Votre note a ete prise en compte" });
      })
      .catch(() => {
        return res.status(404).json({ error: "Le livre est introuvable" });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
