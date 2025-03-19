import express from 'express';
import { CreateProperty } from '../controllers/propertyController.js';
import { authenticateUser} from '../middlewares/auth.js';



const router = express.Router();


router.post('/', authenticateUser , CreateProperty);


export default router;