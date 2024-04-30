const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const autopush = require("http2-express-autopush");
const logger = require("./config/logger");
require("dotenv").config();
require("colors");
const app = express();
const connectDb = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

connectDb();
app.use(cookieParser());
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://localhost:5173",
    "http://localhost:4173",
    "http://yupher.com",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.url} | frontend origin: ${
      req.headers.origin ||
      req.headers.referer ||
      req.headers["x-frontend-origin"]
    }`,
  );

  next();
});

// app.get("/", (req, res) => {
//   res.redirect("https://localhost:5000/api/users/me");
// });
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/files", require("./routes/filesRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../", "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "dist", "index.html"),
    );
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
