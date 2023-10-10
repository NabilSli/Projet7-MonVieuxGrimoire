const router = express.Router();

const multer = require("../middleware/multer-config");
const express = require("express");
const auth = require("../middleware/auth");

const bookCtrl = require("../controllers/books");

router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
