const fs = require("fs");
const path = require("path");
const app = require("./app");
const spdy = require("spdy");
const https = require("https");
const socket = require("./config/io");

const options = {
  key: fs.readFileSync(path.resolve(path.join(__dirname, "../", "key.pem"))),
  cert: fs.readFileSync(
    path.resolve(path.join(__dirname, "../", "certificate.pem")),
  ),
};

const server = spdy.createServer(options, app);
//const server = https.createServer(options, app);

socket(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://localhost:5173",
    ],
  },
  pingTimeout: 60 * 1000,
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("secure server running"));
