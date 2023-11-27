const sharp = require("sharp");

sharp(req.file.path)
  .resize({ width: 800 })
  .webp({ quality: 80 })
  .toBuffer((err, buffer, info) => {
    if (err) {
      console.error("Erreur lors du traitement de l'image :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors du traitement de l'image" });
    }

    const fileSize = Buffer.byteLength(buffer, "base64");

    if (fileSize < 1000000) {
      //enregistrez le buffer dans le fichier image
    } else {
      res.status(400).json({ error });
      console.log("L'image est toujours trop grande");
    }
  });
