const socketIo = require("socket.io");
const { sendMessage, messageEvent } = require("../ioHandlers/messageHandler");
const { socketAuthenticate } = require("../middlewares/authMiddleware");
const logger = require("./logger");

const socket = (server, options) => {
  const io = socketIo(server, options);

  io.use(socketAuthenticate);

  io.on("connection", (socket) => {
    console.log("connected");
    socket.on("setup", (userData) => {
      //console.log(userData);
      //socket.join(userData._id);
      socket.emit("connected");
      console.log("user connected");
    });

    socket.on("join chat", (room, err) => {
      //console.log("err: ", err);
      //console.log("room: ", room);
      socket.join(room);
    });
    socket.on("new message", (message) => {
      //console.log("io", message);
      sendMessage(socket, message);
      // socket.emit("message notification", "new message");
    });
    messageEvent.on("message sent", (data) => {
      //console.log("event consume: ", data.chat._id.toString());
      socket.emit("message notification", data);
    });
  });
  io.on("close", () => console.log("socket disconnected"));
};

module.exports = socket;
