import cloudinary from '../utils/cloudinary.js';
import prisma from '../prisma/client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageFiles = [
    {
        sku: '1001',
        localPath: '/Users/adnanrizvi/.gemini/antigravity/brain/05787a1f-9308-4b8f-b68f-e2d1d9b30b02/personalized_photo_frame_hamper_1765136568952.png',
        folder: 'presento_products'
    },
    {
        sku: '1002',
        localPath: '/Users/adnanrizvi/.gemini/antigravity/brain/05787a1f-9308-4b8f-b68f-e2d1d9b30b02/luxury_spa_wellness_set_1765136584926.png',
        folder: 'presento_products'
    },
    {
        sku: '1003',
        localPath: '/Users/adnanrizvi/.gemini/antigravity/brain/05787a1f-9308-4b8f-b68f-e2d1d9b30b02/kids_adventure_explorer_set_1765136600967.png',
        folder: 'presento_products'
    },
    {
        sku: '1004',
        localPath: '/Users/adnanrizvi/.gemini/antigravity/brain/05787a1f-9308-4b8f-b68f-e2d1d9b30b02/romantic_couple_date_box_1765136616290.png',
        folder: 'presento_products'
    },
    {
        sku: '1005',
        localPath: '/Users/adnanrizvi/.gemini/antigravity/brain/05787a1f-9308-4b8f-b68f-e2d1d9b30b02/premium_home_decor_set_1765136632958.png',
        folder: 'presento_products'
    }
];

async function uploadAndUpdateImages() {
    console.log('Starting image upload and database update...\n');

    for (const imageFile of imageFiles) {
        try {
            console.log(`Processing SKU ${imageFile.sku}...`);

            if (!fs.existsSync(imageFile.localPath)) {
                console.log(`  ❌ File not found: ${imageFile.localPath}`);
                continue;
            }

            console.log(`  📤 Uploading to Cloudinary...`);
            const result = await cloudinary.uploader.upload(imageFile.localPath, {
                folder: imageFile.folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto' }
                ]
            });

            console.log(`  ✅ Uploaded: ${result.secure_url}`);

            const product = await prisma.product.findFirst({
                where: { sku: imageFile.sku }
            });

            if (!product) {
                console.log(`  ❌ Product not found with SKU: ${imageFile.sku}`);
                continue;
            }

            await prisma.product.update({
                where: { id: product.id },
                data: { imageUrl: result.secure_url }
            });

            console.log(`  ✅ Updated product: ${product.name}\n`);

        } catch (error) {
            console.error(`  ❌ Error processing SKU ${imageFile.sku}:`, error.message);
        }
    }

    console.log('\n✅ All images uploaded and products updated!');

    const products = await prisma.product.findMany({
        where: {
            sku: {
                in: ['1001', '1002', '1003', '1004', '1005']
            }
        },
        select: {
            sku: true,
            name: true,
            imageUrl: true
        }
    });

    console.log('\nUpdated Products:');
    products.forEach(p => {
        console.log(`  ${p.sku}: ${p.name}`);
        console.log(`    Image: ${p.imageUrl}\n`);
    });

    await prisma.$disconnect();
}

uploadAndUpdateImages();
