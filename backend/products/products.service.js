import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ProductService {
    async uploadImage(localPath) {
        try {
            console.log(`📤 Uploading: ${localPath.split('/').pop()}`);
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'presento_products',
                resource_type: 'auto',
            });
            console.log(`✅ Uploaded: ${result.secure_url}`);
            return result.secure_url;
        } catch (error) {
            console.error(`❌ Upload failed:`, error.message);
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const product = await prisma.product.create({
                data: productData,
            });
            return product;
        } catch (error) {
            console.error(`❌ Failed to create product:`, error.message);
            throw error;
        }
    }

    async addProducts(productsData) {
        const createdProducts = [];

        for (const productData of productsData) {
            try {
                const { imagePath, ...productInfo } = productData;

                const imageUrl = await this.uploadImage(imagePath);

                const product = await this.createProduct({
                    ...productInfo,
                    imageUrl,
                });

                createdProducts.push(product);

                console.log(`\n✅ Product ${product.id}: ${product.name}`);
                console.log(`   💰 Price: ₹${product.price} | Stock: ${product.stock}`);
                console.log(`   🏷️ ${product.category} | Badge: ${product.badge}`);
            } catch (error) {
                console.error(`\n❌ Failed to add product: ${productData.name}`);
                console.error(error.message);
            }
        }

        return createdProducts;
    }

    async verifyProduct(id) {
        try {
            const product = await prisma.product.findUnique({
                where: { id },
            });
            return product;
        } catch (error) {
            console.error(`❌ Verification failed for ID ${id}:`, error.message);
            return null;
        }
    }

    async verifyProducts(ids) {
        const products = [];

        for (const id of ids) {
            const product = await this.verifyProduct(id);
            if (product) {
                products.push(product);
                console.log(`✅ ID ${id}: ${product.name}`);
                console.log(`   💰 ₹${product.price} | Stock: ${product.stock} | ${product.category}`);
            } else {
                console.log(`❌ ID ${id}: Not found`);
            }
        }

        return products;
    }

    async listAllProducts() {
        try {
            const products = await prisma.product.findMany({
                orderBy: { id: 'asc' },
            });
            return products;
        } catch (error) {
            console.error(`❌ Failed to list products:`, error.message);
            throw error;
        }
    }

    async updateProduct(id, data) {
        try {
            const product = await prisma.product.update({
                where: { id },
                data,
            });
            console.log(`✅ Updated product ${id}: ${product.name}`);
            return product;
        } catch (error) {
            console.error(`❌ Failed to update product ${id}:`, error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await prisma.product.delete({
                where: { id },
            });
            console.log(`✅ Deleted product ${id}: ${product.name}`);
            return product;
        } catch (error) {
            console.error(`❌ Failed to delete product ${id}:`, error.message);
            throw error;
        }
    }

    async disconnect() {
        await prisma.$disconnect();
    }
}
