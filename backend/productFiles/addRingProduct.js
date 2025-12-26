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

const productData = {
    localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_1766731037672.png',
    name: 'Personalized Name Ring with Heart',
    description: 'Express your love with this elegant personalized name ring featuring a delicate heart accent. Crafted in beautiful gold tone, this adjustable ring can be customized with any name in stylish script font. The unique design combines the name with a charming heart symbol, making it a perfect gift for loved ones, anniversaries, or special occasions. The adjustable band ensures a comfortable fit for any finger size. Perfect for gifting to someone special or treating yourself to a meaningful piece of jewelry.',
    shortDescription: 'Elegant gold-toned personalized name ring with heart accent, adjustable fit',
    price: 899,
    stock: 50,
    category: 'Personalized',
    badge: 'Trending',
    discount: 10,
    isFeatured: true,
};

async function uploadImageToCloudinary(localPath) {
    try {
        console.log(`📤 Uploading image: ${localPath}`);
        const result = await cloudinary.uploader.upload(localPath, {
            folder: 'presento_products',
            resource_type: 'auto',
        });
        console.log(`✅ Uploaded successfully: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Error uploading image:`, error.message);
        throw error;
    }
}

async function addProduct() {
    try {
        console.log('🌱 Starting product addition...\n');

        const imageUrl = await uploadImageToCloudinary(productData.localImagePath);

        const { localImagePath, ...productInfo } = productData;

        const product = await prisma.product.create({
            data: {
                ...productInfo,
                imageUrl,
            },
        });

        console.log(`\n✅ Product added successfully!`);
        console.log(`📦 ID: ${product.id}`);
        console.log(`📝 Name: ${product.name}`);
        console.log(`💰 Price: ₹${product.price}`);
        console.log(`📊 Stock: ${product.stock}`);
        console.log(`🏷️ Category: ${product.category}`);
        console.log(`⭐ Badge: ${product.badge}`);
        console.log(`✨ Featured: ${product.isFeatured}`);
        console.log(`🔗 Image URL: ${product.imageUrl}`);
        console.log('\n🎉 Product is now live on your website!');

    } catch (error) {
        console.error('❌ Error adding product:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

addProduct()
    .then(() => {
        console.log('\n✨ Process completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Process failed:', error);
        process.exit(1);
    });
