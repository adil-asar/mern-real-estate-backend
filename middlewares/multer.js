import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // double-check spelling

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern_real_estate_project",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

export default upload;
