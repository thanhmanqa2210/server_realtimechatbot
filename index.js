const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messagesRoute");
const app = express();
require("dotenv").config();
const socket = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL_ATLAS = process.env.URL_MONGODB_ATLAS;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://realtime-chatapp-navy.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
// Add headers before the routes are defined
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,OPTIONS,PUT,PATCH,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
  res.setHeader("Access-Control-Allow-Credentials", true);
});
app.use(express.json());

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err.message, "có lỗi xảy ra");
  });

app.get("/", function (req, res) {
  res.send(" Chưa có dữ liệu gì cả !");
});
app.use("/api/auth/", userRouter);
app.use("/api/messages/", messageRouter);

const server = app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
    allowedHeaders: [
      "Access-Control-Allow-Origin:https://realtime-chatapp-navy.vercel.app",
    ],
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
