const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
cloudinary.config({
  secure: true,
});
const uploadImage = async (image) => {
  const options = {
    public_id: `chatapp/profiles/${uuidv4()}`,
  };
  try {
    let upload = await cloudinary.uploader.upload(image, options);
    return upload.secure_url;
  } catch (error) {
    console.log("cloudinary error".red.bold);
    console.log(error);
  }
};

module.exports = uploadImage;
