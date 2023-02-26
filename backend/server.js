const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("colors");
const app = express();
const connectDb = require("./config/db");
const {
  NotFound,
  errorHandler,
  notFound,
} = require("./middlewares/errorMiddleware");

connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`server runin at port ${port}`.blue.underline),
);
const io = require("socket.io")(server, {
  cors: { origin: process.env.FRONTEND_URL },
  pingTimeout: 60 * 1000,
});

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("setup", (userData) => {
    //socket.join(userData._id);
    socket.emit("connected");
  });
  console.log(socket.rooms);
  socket.on("join chat", (room) => {
    console.log("user joined", room);
    socket.join(room);
  });
  socket.on("new message", (message) => {
    let { chat } = message;

    socket.to(chat._id).emit("message recieved", message);
  });
});
