const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // Limite de 1 Mo (1 Mo = 1024 ko)
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(
        new Error(
          "Seuls les fichiers JPG, JPEG ou PNG de moins de 1mo sont autorisés."
        )
      );
    }
    callback(null, true);
  },
}).single("image");

module.exports = upload;
//TODO: tester en plus taille max de l'image (1mb), ajouter sharp pour ecrasement d'image
// module.exports = multer({ storage: storage }).single("image");
