const multer = require("../middleware/multer-config");
const express = require("express");
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/books");

const router = express.Router();

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.get("/:id", bookCtrl.getOneBook);

module.exports = router;
