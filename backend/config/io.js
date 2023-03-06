const socketIo = require("socket.io");
const { sendMessage } = require("../ioHandlers/messageHandler");
const { socketAuthenticate } = require("../middlewares/authMiddleware");

const socket = (server, options) => {
  const io = socketIo(server, options);
  io.use(socketAuthenticate);
  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      console.log(userData);
      //socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });
    socket.on("new message", (message) => {
      sendMessage(socket, message);
    });
  });
};

module.exports = socket;
