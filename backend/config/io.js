const socketIo = require("socket.io");
const { sendMessage } = require("../ioHandlers/messageHandler");

const socket = (server, options) => {
  const io = socketIo(server, options);
  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
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
