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
