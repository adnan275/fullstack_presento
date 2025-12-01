import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding trending products...');

    const products = [
        {
            name: 'Personalized Name Ring',
            description: 'Elegant personalized name ring with timeless design. Perfect gift for loved ones.',
            price: 1299,
            stock: 50,
            category: 'Jewelry',
            imageUrl: '/trending/ring.png'
        },
        {
            name: 'Luxury Gift Hamper',
            description: 'Perfect luxury gift hamper curated for her with premium items and elegant packaging.',
            price: 2499,
            stock: 30,
            category: 'Gift Hampers',
            imageUrl: '/trending/hamper.jpg'
        },
        {
            name: 'Anniversary LED Lamp',
            description: 'Capture special moments with this customizable LED lamp. Perfect anniversary gift.',
            price: 899,
            stock: 45,
            category: 'Home Decor',
            imageUrl: '/trending/lamp.png'
        },
        {
            name: 'Premium Mens Combo',
            description: 'Classy and functional combo set for men including wallet, pen, and keychain.',
            price: 1799,
            stock: 25,
            category: 'Mens Accessories',
            imageUrl: '/trending/wallet-set.jpg'
        },
        {
            name: 'Ultimate Surprise Box',
            description: 'Limited edition surprise box to unwrap happiness. Curated with love and care.',
            price: 3499,
            stock: 15,
            category: 'Gift Hampers',
            imageUrl: '/trending/gift-box.jpg'
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
