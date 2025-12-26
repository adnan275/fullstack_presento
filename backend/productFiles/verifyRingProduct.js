import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProduct() {
    try {
        const product = await prisma.product.findUnique({
            where: { id: 16 }
        });

        if (product) {
            console.log('✅ Product found in database:\n');
            console.log(`📦 ID: ${product.id}`);
            console.log(`📝 Name: ${product.name}`);
            console.log(`💰 Price: ₹${product.price}`);
            console.log(`📊 Stock: ${product.stock}`);
            console.log(`🏷️ Category: ${product.category}`);
            console.log(`⭐ Badge: ${product.badge}`);
            console.log(`💎 Discount: ${product.discount}%`);
            console.log(`✨ Featured: ${product.isFeatured}`);
            console.log(`🔗 Image URL: ${product.imageUrl}`);
            console.log(`📄 Short Description: ${product.shortDescription}`);
            console.log(`\n✅ Product is ready to display on the website!`);
        } else {
            console.log('❌ Product not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyProduct();
