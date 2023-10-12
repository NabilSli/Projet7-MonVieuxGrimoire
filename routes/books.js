const multer = require("../middleware/multer-config");
const express = require("express");
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/books");

const router = express.Router();

router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);
router.post("/rating", bookCtrl.addRating);

module.exports = router;
