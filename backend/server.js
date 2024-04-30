const fs = require("fs");
const path = require("path");
const app = require("./app");
//const spdy = require("spdy");
const http = require("http");
const socket = require("./config/io");

// const options = {
//   key: fs.readFileSync(path.resolve(path.join(__dirname, "../", "server.key"))),
//   cert: fs.readFileSync(
//     path.resolve(path.join(__dirname, "../", "server.crt")),
//   ),
// };

const server = http.createServer(app);
//const server = https.createServer(options, app);

socket(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://localhost:5173",
      "https://www.chat.yupher.com",
      "https://yupher.com",
      "http://yupher.com",
      "http://localhost:4173",
    ],
    credentials: true,
  },
  pingTimeout: 60 * 1000,
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("secure server running"));
