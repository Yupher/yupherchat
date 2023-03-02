const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("colors");
const app = express();
const connectDb = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => res.send("secure"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
