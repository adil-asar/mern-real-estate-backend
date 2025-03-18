import express from 'express';
import {
    Signup,
    Signin,
    ValidateUser
} from '../controllers/userController.js'
import { authenticateUser} from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.get('/validate',authenticateUser ,ValidateUser);

export default router;