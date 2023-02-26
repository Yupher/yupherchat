const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Message is empty!"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
