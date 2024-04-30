const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const uploadImage = require("../config/imageUpload");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

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
    const expiresIn = Date.now() + 30 * 24 * 3600 * 1000;
    return res
      .setHeader(
        "Set-Cookie",
        `auth_token=${generateToken(newUser._id)};path=/;Expires=${new Date(
          expiresIn,
        ).toUTCString()};HttpOnly=true;HostOnly=true,SameSite=true;Secure=true`,
      )
      .status(200)
      .json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        token: generateToken(user._id),
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

  // res.setHeader(
  //   "Set-Cookie",
  //   `auth-token=${generateToken(
  //     user._id,
  //   )};path=/;httpOnly=false;secure=false;sameSite=none;Expires=${new Date(
  //     30 * 24 * 3600 * 1000,
  //   ).toUTCString()}`,
  // );

  const expiresIn = Date.now() + 30 * 24 * 3600 * 1000;

  return res
    .setHeader(
      "Set-Cookie",
      `auth_token=${generateToken(user._id)};path=/;Expires=${new Date(
        expiresIn,
      ).toUTCString()};HttpOnly=true;HostOnly=true,SameSite=true;Secure=true`,
    )
    .status(200)
    .json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  // return res.status(200).json({
  //   _id: user.id,
  //   name: user.name,
  //   email: user.email,
  //   picture: user.picture,
  //   token: generateToken(user._id),
  // });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res
    .setHeader(
      "Set-Cookie",
      `auth_token=};path=/;Expires=${new Date(
        -1,
      ).toUTCString()};HttpOnly=false;HostOnly=true,SameSite=true;Secure=true`,
    )
    .status(200)
    .json({ message: "Logged out" });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  //let { _id, name, email } = req.user;
  res.status(200).json(req.user);
});

exports.getAll = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search } },
        ],
      }
    : {};

  const page =
    req.query.page && req.query.page > 0 ? parseInt(req.query.page, 10) : 1;

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password")
    .sort({ createdAt: 1 })
    .skip((page - 1) * 10)
    .limit(10);
  console.log(users);
  res.status(200).json(users);
});
