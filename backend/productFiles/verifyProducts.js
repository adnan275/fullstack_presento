import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                id: {
                    gte: 11,
                    lte: 15,
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        console.log(`\n✅ Found ${products.length} new products:\n`);

        products.forEach((p) => {
            console.log(`📦 ID ${p.id}: ${p.name}`);
            console.log(`   Price: ₹${p.price} | Stock: ${p.stock} | Category: ${p.category}`);
            console.log(`   Badge: ${p.badge || 'None'} | Featured: ${p.isFeatured}`);
            console.log(`   Image URL: ${p.imageUrl}`);
            console.log(`   Description: ${p.shortDescription}`);
            console.log('');
        });

        const totalProducts = await prisma.product.count();
        console.log(`\n📊 Total products in database: ${totalProducts}\n`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyProducts();
