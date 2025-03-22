import express from 'express';
import { CreateProperty } from '../controllers/propertyController.js';
import { authenticateUser} from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';


const router = express.Router();


router.post('/add', authenticateUser ,upload.array('images'), CreateProperty);


export default router;