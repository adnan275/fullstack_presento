import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateToken, async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "Failed to fetch addresses" });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    try {
        const { fullName, phone, email, address, city, state, pincode } = req.body;

        if (!fullName || !phone || !email || !address || !city || !state || !pincode) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: req.user.userId,
                fullName,
                phone,
                email,
                address,
                city,
                state,
                pincode,
            },
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ error: "Failed to add address" });
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const addressId = parseInt(req.params.id);
        const { fullName, phone, email, address, city, state, pincode } = req.body;

        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== req.user.userId) {
            return res.status(404).json({ error: "Address not found or unauthorized" });
        }

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                fullName,
                phone,
                email,
                address,
                city,
                state,
                pincode,
            },
        });

        res.json(updatedAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Failed to update address" });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const addressId = parseInt(req.params.id);

        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== req.user.userId) {
            return res.status(404).json({ error: "Address not found or unauthorized" });
        }

        await prisma.address.delete({
            where: { id: addressId },
        });

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ error: "Failed to delete address" });
    }
});

export default router;
