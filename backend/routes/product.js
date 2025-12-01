
import express from "express";
import prisma from "../prisma/client.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    let imageUrl = "";

    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "presento_products", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ error: "Image upload failed: " + cloudinaryError.message });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        imageUrl,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Product create error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    res.json(products);
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Fetch product error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.orderItem.deleteMany({
      where: { productId: productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    console.log("✅ Product deleted:", product.name, "(ID:", id, ") - Removed from", );
    res.json({
      success: true,
      message: "Product deleted successfully",
      deletedProductId: productId,
    });
  } catch (err) {
    console.error("Product delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/stock", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock === null) {
      return res.status(400).json({ error: "Stock amount is required" });
    }

    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ error: "Stock must be a non-negative number" });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stock: stockNum },
    });

    console.log("✅ Stock updated for", product.name, "- New stock:", stockNum);
    res.json({ success: true, message: "Stock updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Stock update error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
