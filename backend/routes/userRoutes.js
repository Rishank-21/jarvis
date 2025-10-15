import express from 'express';
const router = express.Router();
import { askToAssistant, getCurrentUser, updateAssistant } from '../controllers/userController.js';
import {isAuth} from '../middlewares/isAuth.js';
import upload from "../middlewares/multer.js"
router.get('/current', isAuth, getCurrentUser);
router.post("/update", upload.single("assistantImage"), isAuth, updateAssistant);
router.post('/ask' , isAuth , askToAssistant)

export default router;
