const asyncHandler = require("express-async-handler");

exports.sendMessage = asyncHandler(async (socket, message) => {
  let { chat } = message;

  socket.to(chat._id).emit("message recieved", message);
});
