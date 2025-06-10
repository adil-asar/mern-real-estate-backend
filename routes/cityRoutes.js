import express from 'express';
import { getAllCities , createCity} from '../controllers/cityController.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = express.Router();

router.get("/all",  getAllCities);
router.post("/add", authenticateUser, createCity);


export default router;