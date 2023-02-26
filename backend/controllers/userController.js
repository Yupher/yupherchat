const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const uploadImage = require("../config/imageUpload");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.register = asyncHandler(async (req, res, next) => {
  let { name, email, password, picture } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Fields are required!");
  }

  let user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("A user already exists with this email");
  }
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);

  user = { name, email, password: hashedPassword };
  if (picture) {
    user.picture = await uploadImage(picture);
  }
  let newUser = await User.create(user);

  if (newUser) {
    return res.status(201).json({
      _id: newUser.id,
      name,
      email,
      picture: user.picture,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  let user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Incorrect password or email");
  }

  return res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    token: generateToken(user._id),
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  let { _id, name, email } = req.user;
  res.status(200).json({ id: _id, name, email });
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  res.status(200).json(users);
});
