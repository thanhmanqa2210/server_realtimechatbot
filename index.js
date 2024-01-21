const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messagesRoute");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL_ATLAS = process.env.URL_MONGODB_ATLAS;
app.use(cors());
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
    console.log(err.message,"có lỗi xảy ra");
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
