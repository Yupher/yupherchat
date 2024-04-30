const mongoose = require("mongoose");

const FileSchema = mongoose.Schema(
  {
    path: {
      type: String,
      trim: true,
      required: [true, "path is required!"],
    },
    fileType: {
      type: String,
      trim: true,
      required: [true, "file must have type!"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("file", FileSchema);
