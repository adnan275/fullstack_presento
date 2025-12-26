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

const products = [
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_0_1766731744938.png',
        name: 'Magnetic Levitating Moon Lamp',
        description: 'Experience the magic of the cosmos with our stunning Magnetic Levitating Moon Lamp. This 3D printed moon replica floats effortlessly above its wooden base using advanced magnetic levitation technology. The warm LED glow creates a mesmerizing ambiance perfect for bedrooms, living rooms, or offices. The realistic lunar surface details make it an extraordinary conversation piece and a unique gift for space enthusiasts, tech lovers, or anyone who appreciates innovative home decor. USB powered with touch control for easy operation.',
        shortDescription: '3D printed levitating moon lamp with magnetic base and warm LED lighting',
        price: 2999,
        stock: 20,
        category: 'Home Decor',
        badge: 'Premium',
        discount: 15,
        isFeatured: true,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_1_1766731744938.png',
        name: 'Custom Sound Wave Acrylic Display',
        description: 'Preserve your most precious moments forever with our Custom Sound Wave Acrylic Display. Transform meaningful audio - wedding vows, "I love you", a baby\'s first words, or favorite song - into stunning visual art. Each piece is laser-engraved on premium acrylic with your custom sound wave pattern and personalized date or message. The elegant design makes it a perfect anniversary gift, wedding keepsake, or romantic gesture that captures the sound of love in a beautiful, tangible form. Comes with wooden stand for display.',
        shortDescription: 'Personalized acrylic sound wave art with custom audio visualization and date',
        price: 1799,
        stock: 30,
        category: 'Personalized',
        badge: 'Best Seller',
        discount: 10,
        isFeatured: true,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_2_1766731744938.png',
        name: 'Smart Coffee Mug Warmer',
        description: 'Never drink cold coffee again with our Smart Coffee Mug Warmer. This sleek, minimalist warming pad keeps your beverages at the perfect temperature throughout your workday. USB-powered for convenience, it features auto shut-off safety and works with any mug or cup. Ideal for busy professionals, students, or anyone who enjoys hot beverages at their own pace. The modern black design complements any desk setup, making it a practical yet thoughtful gift for coffee and tea lovers. Maintains temperature at 55°C (131°F).',
        shortDescription: 'USB-powered smart mug warmer keeps beverages hot, perfect for desk use',
        price: 699,
        stock: 60,
        category: 'Accessories',
        badge: 'Popular',
        discount: 5,
        isFeatured: false,
    },
    {
        localImagePath: '/Users/adnanrizvi/.gemini/antigravity/brain/aeb6f45d-7c61-4560-83e4-8ca997ccb292/uploaded_image_3_1766731744938.png',
        name: 'Gratitude Self-Care Essentials Box',
        description: 'Embrace mindfulness and self-love with our Gratitude Self-Care Essentials Box. This thoughtfully curated set includes a premium Gratitude journal for daily reflections, a luxurious silk sleep mask for restful nights, a satin scrunchie to protect your hair, calming aromatherapy oil, and dried lavender sprigs. Beautifully packaged in an elegant white box, it\'s the perfect gift for birthdays, self-care Sundays, or showing someone you care about their wellbeing. Encourage relaxation, gratitude, and peaceful moments with this complete wellness package.',
        shortDescription: 'Curated self-care gift box with gratitude journal, silk sleep mask, and aromatherapy',
        price: 1499,
        stock: 35,
        category: 'Gifts for Her',
        badge: 'Trending',
        discount: 12,
        isFeatured: true,
    },
];

async function uploadImageToCloudinary(localPath) {
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

async function addProducts() {
    try {
        console.log('🌱 Starting batch product addition...\n');
        console.log(`📦 Adding ${products.length} products\n`);

        for (const productData of products) {
            const { localImagePath, ...productInfo } = productData;

            const imageUrl = await uploadImageToCloudinary(localImagePath);

            const product = await prisma.product.create({
                data: {
                    ...productInfo,
                    imageUrl,
                },
            });

            console.log(`\n✅ Product ${product.id}: ${product.name}`);
            console.log(`   💰 Price: ₹${product.price} | Stock: ${product.stock}`);
            console.log(`   🏷️ ${product.category} | Badge: ${product.badge}`);
            console.log(`   ✨ Featured: ${product.isFeatured}\n`);
        }

        console.log('🎉 All products added successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Total products: ${products.length}`);
        console.log(`   Total stock: ${products.reduce((sum, p) => sum + p.stock, 0)} units`);
        console.log(`   Total value: ₹${products.reduce((sum, p) => sum + p.price, 0)}`);

    } catch (error) {
        console.error('❌ Error adding products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

addProducts()
    .then(() => {
        console.log('\n✨ Process completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Process failed:', error);
        process.exit(1);
    });
