import express from 'express';
const router = express.Router();
import { registerUser , loginUser , logoutUser} from '../controllers/authController.js';

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/logout', logoutUser);
router

export default router;