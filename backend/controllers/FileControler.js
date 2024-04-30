const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const { v1: uuidv1 } = require("uuid");
const fileModel = require("../models/fileModel");

//this should be another service
exports.uploadFile = asyncHandler(async (req, res, next) => {
  let files = req.files.files;

  if (!files) {
    res.status(400);
    throw new Error("Files is empty");
  }

  let arr = Array.isArray(files) ? files : [files];

  const promises = arr.map(async (file) => {
    let fileName = `${uuidv1()}-${new Date().toISOString().split("T")[0]}.${
      file.mimetype.split("/")[1]
    }`;
    let mv = path.join(__dirname, "..", "assets", "uploads", fileName);

    const newFile = await fileModel.create({
      path: mv,
      fileType: file.mimetype,
    });
    await file.mv(mv);
    if (!newFile) {
      res.status(500);
      throw new Error("Something went wrong");
    }
    console.log("new file", newFile);
    return {
      type: newFile.fileType,
      content: `${req.protocol}://${req.get("host")}/api/files/${newFile._id}`,
    };
  });

  const resp = await Promise.all(promises);
  if (!resp) {
    res.status(500);
    throw new Error("Could not save the file");
  }
  //   console.log(resp);
  return res.status(201).json(resp);
});

exports.downloadFile = asyncHandler(async (req, res, nex) => {
  const { id } = req.params;

  let foundFile = await fileModel.findById(id);

  if (!foundFile) {
    return fs
      .createReadStream(
        path.join(
          __dirname,
          "..",
          "assets",
          "main-qimg-2b20b84d40137d0d35568d8b1a7c6e0c-lq.jpg",
        ),
      )
      .pipe(res);
  }
  return fs.createReadStream(foundFile.path).pipe(res);
});
