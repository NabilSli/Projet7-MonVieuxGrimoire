const sharp = require("sharp");

const fs = require("fs");

const sharpImage = (req, res, next) => {
  try {
    const extension = req.file.filename.split(".").pop();
    const filename = req.file.filename.split(`.${extension}`)[0];

    sharp(req.file.path)
      .resize({ width: 800 })
      .webp({ quality: 80 })
      .toFile(`images/${filename}.webp`)
      .then(() => {
        fs.unlink(`images/${req.file.filename}`, () => {
          req.file.path = `images/${filename}.webp`;
          req.file.filename = `${filename}.webp`;
          next();
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = sharpImage;
