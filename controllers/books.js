const Book = require("../models/Book");

exports.createBook((req, res, next) => {
  const book = new Book({ ...req.body });
  book
    .save()
    .then((createdBook) => res.status(201).json(createdBook))
    .catch((error) => res.status(400).json({ error }));
});

exports.modifyBook((req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

exports.deleteBook((req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé" }))
    .catch((error) => res.status(400).json({ error }));
});

exports.getOneBook((req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
});

exports.getAllBooks((req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
});
