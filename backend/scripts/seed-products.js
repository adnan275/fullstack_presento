import prisma from '../prisma/client.js';

const products = [
    {
        name: "Personalized Photo Frame Gift Hamper",
        description: "A perfect gift hamper featuring a customizable photo frame, premium chocolates, scented candles, and a handwritten greeting card. Ideal for birthdays, anniversaries, or any special occasion.",
        shortDescription: "Beautiful personalized photo frame with chocolates and greeting card",
        price: 1299,
        discount: 15,
        stock: 50,
        category: "Personalized",
        badge: "Best Seller",
        sku: "1001",
        isFeatured: true,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/gift-hamper.jpg"
    },
    {
        name: "Luxury Spa & Wellness Gift Set",
        description: "Indulge in luxury with this premium spa gift set featuring aromatic bath salts, essential oils, body butter, face masks, and a plush towel. Perfect for self-care or gifting to someone special.",
        shortDescription: "Premium spa essentials for ultimate relaxation",
        price: 2499,
        discount: 20,
        stock: 30,
        category: "Gifts for Her",
        badge: "Trending",
        sku: "1002",
        isFeatured: true,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/spa-gift.jpg"
    },
    {
        name: "Kids Adventure Explorer Play Set",
        description: "Spark imagination with this complete adventure set including binoculars, compass, flashlight, magnifying glass, and explorer's backpack. Perfect for outdoor adventures and learning.",
        shortDescription: "Complete adventure set for young explorers",
        price: 899,
        discount: 10,
        stock: 75,
        category: "Kids Gifts",
        badge: "Popular",
        sku: "1003",
        isFeatured: false,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/kids-toys.jpg"
    },
    {
        name: "Romantic Couple's Date Night Box",
        description: "Create unforgettable memories with this romantic date night box featuring scented candles, wine glasses, gourmet chocolates, rose petals, and a curated playlist card. Perfect for anniversaries or special celebrations.",
        shortDescription: "Everything needed for a perfect romantic evening",
        price: 1799,
        discount: 25,
        stock: 20,
        category: "Romantic",
        badge: "Limited Edition",
        sku: "1004",
        isFeatured: true,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/romantic-gift.jpg"
    },
    {
        name: "Premium Home Decor Accent Set",
        description: "Elevate your living space with this premium home decor set featuring designer vases, decorative candle holders, wall art, and accent cushions. Modern design meets timeless elegance.",
        shortDescription: "Elegant decor pieces to transform any space",
        price: 3299,
        discount: 30,
        stock: 40,
        category: "Home Decor",
        badge: "New Arrival",
        sku: "1005",
        isFeatured: true,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/home-decor.jpg"
    }
];

async function seedProducts() {
    console.log('Starting to seed products...');

    try {
        for (const product of products) {
            const existing = await prisma.product.findFirst({
                where: { sku: product.sku }
            });

            if (existing) {
                console.log(`Product ${product.sku} already exists, skipping...`);
                continue;
            }

            const created = await prisma.product.create({
                data: product
            });

            console.log(`✓ Created: ${created.name} (SKU: ${created.sku})`);
        }

        console.log('\n✅ All products seeded successfully!');

        const count = await prisma.product.count();
        console.log(`Total products in database: ${count}`);

    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedProducts();
