import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

import connectDB from './config/db.js';
connectDB();

import cookieParser from 'cookie-parser';
app.use(cookieParser());
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import geminiResponse from "./gemini.js"
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["https://virtual-assistant-theta-swart.vercel.app"],
  credentials: true
}));



app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get("/" ,async (req , res) => {
  try {
    const prompt = req.query.prompt
    let data = await geminiResponse(prompt)
  res.json(data)
  } catch (error) {
    console.error("error during fetching : " , error)
    res.json("fetching error ", error)
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

