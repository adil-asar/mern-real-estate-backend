import express from 'express';
import { CreateProperty , GetAllProperties ,deleteProperty} from '../controllers/propertyController.js';
import { authenticateUser} from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';


const router = express.Router();



router.post(
  "/add",
  authenticateUser,
  upload.array("images", 10),
  CreateProperty
);

router.get(
  "/All",
  authenticateUser,  
  GetAllProperties
);

router.delete("/delete/:id",authenticateUser,deleteProperty)





export default router;