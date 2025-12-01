import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
    console.log("Login route accessed");
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    }
})

router.post("/signup", async (req, res) => {
    console.log("Signup route accessed");
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            }
        })

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            message: "Signup successful",
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        })
    } catch (error) {
        console.log("Error during signup:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            stack: error.stack
        })
    }
})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ user });
    } catch (error) {
        console.log("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error" });
    }
})

export default router;
