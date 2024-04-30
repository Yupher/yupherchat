const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
  try {
    //console.log("token: ", token);
    let decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decode.id).select("-password").lean();
    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized");
  }
});

exports.socketAuthenticate = async (socket, next) => {
  try {
    let parsedCookies = {};
    //console.log(socket.handshake.headers);
    ///console.log(parsedCookies);
    if (
      socket.handshake &&
      socket.handshake.headers &&
      socket.handshake.headers.cookie
    ) {
      let cookies = socket.handshake.headers.cookie.split("; ");

      cookies.forEach((cookie) => {
        parsedCookies[cookie.split("=")[0]] = cookie.split("=")[1];
      });
      //console.log(parsedCookies);
    }
    if (
      socket.handshake &&
      socket.handshake.headers &&
      socket.handshake.headers.authorization &&
      socket.handshake.headers.authorization.startsWith("Bearer")
    ) {
      let { authorization } = socket.handshake.headers;
      parsedCookies["auth_token"] = authorization.split(" ")[1];
    }

    if (!parsedCookies.auth_token) {
      const error = { message: "Not authorized" };
      console.log(error);
      return next(error);
    }

    let decode = jwt.verify(parsedCookies.auth_token, process.env.JWT_SECRET);
    //console.log(parsedCookies);

    let user = await User.findById(decode.id).select("-password");

    if (!user) {
      return next({ message: "Not authorized" });
    }
    socket.user = user;
    next();
  } catch (error) {
    console.log(error);

    return socket.emit("send message error", "Not authorized");
  }
};
