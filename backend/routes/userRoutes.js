

import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant, deleteHistory } from "../controllers/userController.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/current", isAuth, getCurrentUser);
router.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);
router.post("/ask", isAuth, askToAssistant);
router.delete("/history", isAuth, deleteHistory);

export default router;
