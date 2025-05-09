// cloudinaryConfig.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { configDotenv } from "dotenv";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "silapor_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export { cloudinary, storage };
