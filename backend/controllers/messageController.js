const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400);
    throw new Error("Bad request");
  }
  let chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("This chat doesn't exist");
  }
  if (!chat.users.find((user) => user.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Forbidden");
  }
  let newMessage = {
    sender: req.user._id,
    chat: chatId,
    content,
  };
  let message = await Message.create(newMessage);
  message = await message.populate("sender", "name picture");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name email picture",
  });
  chat.latestMessage = message;
  await chat.save();
  res.status(201).json(message);
});

exports.allMessages = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    res.status(404);
    throw new Error("This chat doesn't exist");
  }
  if (!chat.users.find((user) => user.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Forbidden");
  }
  const messages = await Message.find({ chat: chat._id })
    .populate("sender", "name email picture")
    .populate("chat")
    .sort({ updatedAt: 1 });

  res.status(200).json(messages);
});
