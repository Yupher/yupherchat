const fs = require("fs");
const path = require("path");
const app = require("./app");
const spdy = require("spdy");
const https = require("https");

const options = {
  key: fs.readFileSync(path.resolve(path.join(__dirname, "../", "key.pem"))),
  cert: fs.readFileSync(
    path.resolve(path.join(__dirname, "../", "certificate.pem")),
  ),
};

const server = spdy.createServer(options, app);
//const server = https.createServer(options, app);

const io = require("socket.io")(server, {
  cors: { origin: process.env.FRONTEND_URL },
  pingTimeout: 60 * 1000,
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    //socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("new message", (message) => {
    let { chat } = message;

    socket.to(chat._id).emit("message recieved", message);
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("secure server running"));
