import express from 'express';
import { CreateContact , GetAllContacts , DeleteContact} from '../controllers/contactController.js';
import { authenticateUser} from '../middlewares/auth.js';

const router = express.Router();

router.post("/add", CreateContact);
router.get("/all", authenticateUser, GetAllContacts);
router.delete("/delete/:id", authenticateUser, DeleteContact);

export default router;

