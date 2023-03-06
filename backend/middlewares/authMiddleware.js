const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
  try {
    let decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decode.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized");
  }
});

exports.socketAuthenticate = asyncHandler(async (socket, next) => {
  let parsedCookies = {};
  if (socket.handshake.headers && socket.handshake.headers.cookie) {
    let cookies = socket.handshake.headers.cookie.split("; ");
    cookies.forEach((cookie) => {
      parsedCookies[cookie.split("=")[0]] = cookie.split("=")[1];
    });
  }
  if (!parsedCookies.auth_token) {
    const error = { message: "Not authorized" };
    return next(error);
  }
  try {
    let decode = jwt.verify(parsedCookies.auth_token, process.env.JWT_SECRET);
    let user = await User.findById(decode.id).select("-password");
    if (!user) {
      return next({ message: "Not authorized" });
    }
    socket.user = user;
    next();
  } catch (error) {
    console.log(error);

    return next({ message: "Not authorized" });
  }
});
