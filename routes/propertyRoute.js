import express from 'express';
import { CreateProperty } from '../controllers/propertyController.js';
import { authenticateUser} from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import multer from "multer";

const router = express.Router();

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ error: `Unknown upload error: ${err.message}` });
  }
  next();
};

router.post(
  "/add",
  authenticateUser,
  upload.array("images", 10),
  multerErrorHandler,
  CreateProperty
);




export default router;