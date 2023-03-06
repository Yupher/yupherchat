const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

exports.sendMessage = asyncHandler(async (socket, message) => {
  if (!message.content) {
    return socket.emit("send message error", "Message is empty!");
  }
  let chat = await Chat.findById(message.chatId);
  if (!chat) {
    return socket.emit("send message error", "Chat not found!");
  }
  if (
    !chat.users.find((user) => user.toString() === socket.user._id.toString())
  ) {
    return socket.emit("send message error", "Forbbiden!");
  }

  let newMessage = {
    sender: socket.user._id,
    chat: message.chatId,
    content: message.content,
  };
  let createMessage = await Message.create(newMessage);
  createMessage = await createMessage.populate("sender", "name picture");
  createMessage = await createMessage.populate("chat");
  createMessage = await User.populate(createMessage, {
    path: "chat.users",
    select: "name email picture",
  });
  chat.latestMessage = createMessage;
  await chat.save();

  socket.emit("message saved", createMessage);

  return socket.to(message.chatId).emit("message recieved", createMessage);
});
