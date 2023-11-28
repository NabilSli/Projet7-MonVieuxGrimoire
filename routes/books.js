const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharpImage = require("../middleware/sharp");

const bookCtrl = require("../controllers/books");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.post("/", auth, [multer, sharpImage], bookCtrl.createBook);
router.put("/:id", auth, [multer, sharpImage], bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.get("/:id", bookCtrl.getOneBook);

module.exports = router;
