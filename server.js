const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Voilà la réponse du serveur 1 !");
});

server.listen(process.env.PORT || 3000);
