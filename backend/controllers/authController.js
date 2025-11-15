import express from 'express';
import User from '../models/userModel.js';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generateToken from '../config/token.js';
import { validationResult } from 'express-validator';


export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;
    const alreadyExist = await User.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Required for HTTPS (Vercel + Render)
      sameSite: "none", // Allows cross-site cookie
      path: "/", // Important
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("registration error :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Required for HTTPS (Vercel + Render)
      sameSite: "none", // Allows cross-site cookie
      path: "/", // Important
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("login error :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error("logout error :", error);
        res.status(500).json({ message: 'Server error' });
    }
}