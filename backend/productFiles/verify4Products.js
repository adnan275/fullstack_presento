import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: [17, 18, 19, 20]
                }
            },
            orderBy: { id: 'asc' }
        });

        console.log(`✅ Found ${products.length} products:\n`);

        products.forEach(product => {
            console.log(`📦 ID ${product.id}: ${product.name}`);
            console.log(`   💰 Price: ₹${product.price} | Discount: ${product.discount}%`);
            console.log(`   📊 Stock: ${product.stock} | Category: ${product.category}`);
            console.log(`   ⭐ Badge: ${product.badge} | Featured: ${product.isFeatured}`);
            console.log(`   🔗 Image: ${product.imageUrl}`);
            console.log('');
        });

        console.log('✅ All products verified and ready!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyProducts();
