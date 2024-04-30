const asyncHandler = require("express-async-handler");
const events = require("events");

const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const messageEvent = new events();

const sendMessage = asyncHandler(async (socket, message) => {
  //console.log(socket.user);
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
  //let preview = await linkPreview(message.content);
  //console.log(preview);
  let newMessage = {
    sender: socket.user._id,
    chat: message.chatId,
    type: message.type,
    content: message.content,
  };
  let createMessage = await Message.create(newMessage);
  if (!createMessage) {
    return socket.emit("send message error", "Message not saved!");
  }
  createMessage = await createMessage.populate("sender", "name picture");
  createMessage = await createMessage.populate("chat");
  createMessage = await User.populate(createMessage, {
    path: "chat.users",
    select: "name email picture",
  });

  chat.latestMessage = createMessage._id;
  await chat.save();

  socket.to(message.chatId).emit("message notification", "new message");
  socket.emit("message saved", createMessage);

  messageEvent.emit("message sent", createMessage);

  return socket.to(message.chatId).emit("message recieved", createMessage);
});

module.exports = { messageEvent, sendMessage };
