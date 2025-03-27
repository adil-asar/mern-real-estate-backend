import express from 'express';
import { authenticateUser} from '../middlewares/auth.js';
import {subscribeToNewsletter , getSubscribedUsers , deleteSubscribedUsers} from "../controllers/subscribeController.js"
const router = express.Router();

router.post("/add", authenticateUser, subscribeToNewsletter);
router.get("/all", authenticateUser, getSubscribedUsers);
router.delete("/delete/:id", authenticateUser, deleteSubscribedUsers);

export default router;