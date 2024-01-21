const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    message: {
      text: String,
      require: false,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);
