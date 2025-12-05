import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding trending products...');

    const products = [
        {
            name: 'Personalized Name Ring',
            description: 'Elegant personalized ring with custom name engraving. Perfect gift for loved ones.',
            price: 599,
            stock: 100,
            category: 'Personalized Jewelry',
            imageUrl: '/assets/trending_2.png',
            badge: 'Best Seller',
            isFeatured: true
        },
        {
            name: 'Luxury Gift Hamper',
            description: 'Curated luxury hamper with premium items and beautiful packaging. Perfect for her.',
            price: 1599,
            stock: 40,
            category: 'Hamper',
            imageUrl: '/assets/trending_5.jpg',
            badge: 'New Arrival',
            isFeatured: true
        },
        {
            name: 'Anniversary LED Lamp',
            description: 'Beautiful LED lamp with custom anniversary message. Capture the moment.',
            price: 899,
            stock: 75,
            category: 'Anniversary Gift',
            imageUrl: '/assets/trending_4.png',
            badge: 'Popular',
            isFeatured: true
        },
        {
            name: 'Premium Men\'s Combo',
            description: 'Luxury gift set for men with wallet, pen, and accessories. Classy and functional.',
            price: 1899,
            stock: 30,
            category: 'Gift Set',
            imageUrl: '/assets/trending_3.jpg',
            badge: 'Trending',
            isFeatured: true
        },
        {
            name: 'Ultimate Surprise Box',
            description: 'A delightful surprise box filled with personalized gifts and treats. Unwrap happiness!',
            price: 1299,
            stock: 50,
            category: 'Birthday Gift',
            imageUrl: '/assets/trending_1.jpg',
            badge: 'Limited Edition',
            isFeatured: true
        }
    ];

    for (const product of products) {
        const created = await prisma.product.create({
            data: product
        });
        console.log(`Created product: ${created.name} (ID: ${created.id})`);
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
