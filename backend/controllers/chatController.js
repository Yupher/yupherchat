const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

exports.accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User is required");
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name picture email",
  });
  if (isChat.length > 0) {
    return res.status(200).json(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    let createChat = await Chat.create(chatData);
    if (!createChat) {
      res.status(500);
      console.log("error while creating the chat".red.bold);
      throw new Error("Something went wrong");
    }
    const fullChat = await Chat.findById(createChat._id).populate(
      "users",
      "-password",
    );

    if (!fullChat) {
      res.status(404);
      console.log("error while trying to find the created chat".red.bold);
      throw new Error("chat not found");
    }
    return res.status(201).json(fullChat);
  }
});

exports.fetchChats = asyncHandler(async (req, res, next) => {
  let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });
  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name picture email",
  });
  return res.status(200).json(chats);
});

exports.createGroupChat = asyncHandler(async (req, res, next) => {
  let { name, users } = req.body;
  if (!name || !users) {
    res.status(400);
    throw new Error(
      "Please give the chat a name and add users to create a group chat",
    );
  }
  if (users.length < 2) {
    res.status(400);
    throw new Error("You must add at least two users to create group chat");
  }
  users.push(req.user._id);
  let groupChat = await Chat.create({
    chatName: name,
    users,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });
  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(201).json(fullGroupChat);
});

exports.renameGroupChat = asyncHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(400);
    throw new Error("Something went wrong while updating the name");
  }
  if (
    !chat.users.find((user) => user._id.toString() === req.user._id.toString())
  ) {
    res.status(400);
    throw new Error("Something went wrong while updating the name");
  }
  const updatedName = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName ? chatName : this.chatName },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedName) {
    res.status(400);
    throw new Error("Something went wrong while updating the name");
  }
  return res.status(200).json(updatedName);
});

exports.addToGroup = asyncHandler(async (req, res, next) => {
  const { userId, chatId } = req.body;
  let chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(400);
    throw new Error("Chat not found");
  }

  //check if is admin
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Only admin can add  members");
  }

  let exist = false;
  chat.users.forEach((user) => {
    if (user.toString() === userId.toString()) {
      exist = true;
    }
  });

  if (exist) {
    res.status(400);
    throw new Error("User already exists in the group chat");
  } else {
    chat.users.push(userId);

    await chat.save();
    const added = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      res.status(500);
      throw new Error("Something went wrong");
    }
    res.status(200).json(added);
  }
});

exports.removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;
  let chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }
  //check if is admin or the same user
  if (
    chat.groupAdmin.toString() !== req.user._id.toString() &&
    req.user._id.toString() !== userId.toString()
  ) {
    res.status(401);
    throw new Error("Only admin can delete other members");
  }

  if (chat.groupAdmin.toString() === userId.toString()) {
    res.status(401);
    throw new Error("Admin can not leave you may want to delete the group");
  }

  let filtredUsers = chat.users.filter(
    (user) => user.toString() !== userId.toString(),
  );
  chat = await Chat.findByIdAndUpdate(
    chatId,
    { users: [...filtredUsers] },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  return res.status(200).json(chat);
});

exports.deleteGroup = asyncHandler(async (req, res, next) => {
  let chat = await Chat.findById(req.params.id);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only admin can delete the group");
  }
  await Chat.findByIdAndDelete(req.params.id);
  res.status(201).json({ id: chat._id, chatName: chat.chatName });
});
