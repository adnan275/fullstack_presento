import prisma from '../prisma/client.js';

async function setAutoIncrement() {
    try {
        console.log('🔧 Setting auto-increment values for Product and Order tables...\n');

        await prisma.$executeRawUnsafe('ALTER TABLE `Product` AUTO_INCREMENT = 1001');
        console.log('✅ Product table: AUTO_INCREMENT set to 1001');

        await prisma.$executeRawUnsafe('ALTER TABLE `Order` AUTO_INCREMENT = 1001');
        console.log('✅ Order table: AUTO_INCREMENT set to 1001');

        console.log('\n🎉 Auto-increment values updated successfully!');
        console.log('📝 New products and orders will now start from ID 1001');
        console.log('📝 Existing products and orders keep their current IDs');

        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();

        console.log('\n📊 Current Database Stats:');
        console.log(`   Products: ${productCount}`);
        console.log(`   Orders: ${orderCount}`);

        if (productCount > 0) {
            const maxProduct = await prisma.product.findFirst({
                orderBy: { id: 'desc' },
                select: { id: true, name: true }
            });
            console.log(`   Highest Product ID: ${maxProduct.id} (${maxProduct.name})`);
            console.log(`   Next Product ID will be: ${Math.max(maxProduct.id + 1, 1001)}`);
        } else {
            console.log('   Next Product ID will be: 1001');
        }

        if (orderCount > 0) {
            const maxOrder = await prisma.order.findFirst({
                orderBy: { id: 'desc' },
                select: { id: true }
            });
            console.log(`   Highest Order ID: ${maxOrder.id}`);
            console.log(`   Next Order ID will be: ${Math.max(maxOrder.id + 1, 1001)}`);
        } else {
            console.log('   Next Order ID will be: 1001');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting auto-increment:', error);
        process.exit(1);
    }
}

setAutoIncrement();
