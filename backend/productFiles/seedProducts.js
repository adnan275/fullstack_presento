import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const products = [
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_0_1766729398127.jpg',
        name: 'Pink Self-Care Gift Basket',
        description: 'Indulge in luxury with our Pink Self-Care Gift Basket, a curated collection of premium beauty essentials and accessories. This elegant basket features a beautiful marble-effect mug, cosmetics, jewelry accessories, decorative items, and more. Perfect for birthdays, anniversaries, or just to show someone you care. Each item is carefully selected to create a memorable gifting experience.',
        shortDescription: 'Luxurious self-care gift basket with beauty essentials and accessories in elegant pink tones',
        price: 2499,
        stock: 25,
        category: 'Gifts',
        badge: 'Trending',
        discount: 10,
        isFeatured: true,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_1_1766729398127.png',
        name: '50th Anniversary LED Light',
        description: 'Celebrate 50 amazing years of love with this stunning heart-shaped LED light. Featuring elegant engraving with "50 AMAZING YEARS" and romantic details including weeks, months, days, and hours together. The warm LED glow creates a beautiful ambiance, making it a perfect keepsake for golden anniversary celebrations. Comes with a wooden base for elegant display.',
        shortDescription: 'Beautiful heart-shaped LED light celebrating 50 years of love, perfect anniversary gift',
        price: 1299,
        stock: 30,
        category: 'Personalized',
        badge: 'Popular',
        discount: 5,
        isFeatured: false,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_2_1766729398127.jpg',
        name: 'Personalized Red Leather Gift Set',
        description: 'Elevate your gifting with this premium 4-piece personalized leather gift set in rich burgundy. The set includes a long wallet, passport holder, cardholder, and keychain, all beautifully presented in an elegant black gift box. Each piece can be customized with a name, making it a thoughtful and sophisticated gift for professionals, travelers, or anyone who appreciates fine accessories.',
        shortDescription: 'Elegant 4-piece personalized leather gift set in rich burgundy with wallet and accessories',
        price: 3499,
        stock: 15,
        category: 'Personalized',
        badge: 'Premium',
        discount: 15,
        isFeatured: true,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_3_1766729398127.jpg',
        name: 'Happy Birthday Gift Box',
        description: 'Make birthdays extra special with this delightful gift box featuring LED fairy lights spelling "HAPPY BIRTHDAY", beauty products, accessories, and decorative flowers. The box includes nail polish, beauty tools, jewelry pieces, and charming pink decorative elements. Perfect for surprising friends, family, or loved ones on their special day.',
        shortDescription: 'Delightful birthday gift box with LED lights, beauty products, and decorative elements',
        price: 1899,
        stock: 35,
        category: 'Gifts',
        badge: 'New Arrival',
        discount: 0,
        isFeatured: false,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_4_1766729398127.jpg',
        name: 'Personalized Tumblers Set',
        description: 'Stay hydrated in style with this set of 4 personalized insulated tumblers. Available in beautiful colors - soft pink, vibrant red, hot pink, and matte black - each tumbler can be customized with a name in elegant script. The 40oz capacity with straw makes them perfect for daily use, gym sessions, or outdoor activities. Premium insulation keeps drinks cold for 24 hours or hot for 12 hours.',
        shortDescription: 'Set of 4 personalized insulated tumblers with custom names in vibrant colors',
        price: 2199,
        stock: 40,
        category: 'Personalized',
        badge: 'Trending',
        discount: 12,
        isFeatured: true,
    },
];

async function uploadImageToCloudinary(localPath) {
    try {
        console.log(`📤 Uploading image: ${path.basename(localPath)}`);
        const result = await cloudinary.uploader.upload(localPath, {
            folder: 'presento_products',
            resource_type: 'auto',
        });
        console.log(`✅ Uploaded successfully: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Error uploading ${localPath}:`, error.message);
        throw error;
    }
}

async function seedProducts() {
    try {
        console.log('🌱 Starting product seeding...\n');

        for (const productData of products) {
            const { localImagePath, ...productInfo } = productData;

            if (!fs.existsSync(localImagePath)) {
                console.error(`❌ Image not found: ${localImagePath}`);
                continue;
            }

            const imageUrl = await uploadImageToCloudinary(localImagePath);

            const product = await prisma.product.create({
                data: {
                    ...productInfo,
                    imageUrl,
                },
            });

            console.log(`✅ Created product: ${product.name} (ID: ${product.id})`);
            console.log(`   Price: ₹${product.price} | Stock: ${product.stock} | Category: ${product.category}`);
            console.log(`   Badge: ${product.badge || 'None'} | Featured: ${product.isFeatured}\n`);
        }

        console.log('🎉 All products seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedProducts()
    .then(() => {
        console.log('\n✨ Seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Seeding failed:', error);
        process.exit(1);
    });
