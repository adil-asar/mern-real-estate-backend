import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinay.js";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern_real_estate_project', 
    allowedFormats: ['jpeg', 'png', 'jpg' , 'gif' , 'webp', 'svg' , 'tiff' , 'jfif'],
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

export default upload;